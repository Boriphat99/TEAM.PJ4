-- 18 พ.ย. 2569 — ระบบแจ้งเตือนผ่าน LINE chatbot (วัตถุประสงค์ 2.3)
-- แบบ: docs/superpowers/specs/2026-11-16-line-notify-design.md
-- ฐานข้อมูลเป็นตัวสั่งส่ง: trigger + pg_cron → notify_line() → pg_net → Edge Function line-notify → LINE Push API

create extension if not exists pg_net with schema extensions;
create extension if not exists pg_cron;

-- ===== ตาราง =====
-- บัญชีที่เชื่อม LINE แล้ว (เก็บเฉพาะ LINE userId)
create table if not exists public.line_links (
  user_id uuid primary key references public.users(id) on delete cascade,
  line_user_id text not null unique,
  linked_at timestamptz not null default now()
);
-- รหัสเชื่อม 6 หลัก อายุ 10 นาที (1 รหัสต่อผู้ใช้)
create table if not exists public.line_link_codes (
  code text primary key check (code ~ '^\d{6}$'),
  user_id uuid not null unique references public.users(id) on delete cascade,
  expires_at timestamptz not null
);
-- พิมพ์รหัสผิด (จำกัด 5 ครั้ง/ชั่วโมง ต่อบัญชี LINE)
create table if not exists public.line_link_fails (
  id bigserial primary key,
  line_user_id text not null,
  at timestamptz not null default now()
);
create index if not exists line_link_fails_user_at on public.line_link_fails(line_user_id, at);
-- บันทึกการส่งทุกครั้ง (กันส่งซ้ำ + แสดง "ส่งเตือนล่าสุด")
create table if not exists public.notify_log (
  id bigserial primary key,
  invoice_id uuid references public.invoices(id) on delete cascade,
  payment_id uuid references public.payments(id) on delete cascade,
  kind text not null check (kind in ('bill','due_soon','overdue','last_day','receipt','reject','slip','manual')),
  to_user uuid references public.users(id) on delete set null,
  ok boolean not null default false,
  error text,
  sent_at timestamptz not null default now()
);
create index if not exists notify_log_inv_idx on public.notify_log(invoice_id, kind);
create index if not exists notify_log_pay_idx on public.notify_log(payment_id);
create index if not exists notify_log_user_idx on public.notify_log(to_user);

alter table public.line_links enable row level security;
alter table public.line_link_codes enable row level security;
alter table public.line_link_fails enable row level security;
alter table public.notify_log enable row level security;

drop policy if exists p_ll_sel on public.line_links;
create policy p_ll_sel on public.line_links for select to authenticated using (
  user_id = (select auth.uid()) or public.app_role() = any (array['admin','owner'])
);
drop policy if exists p_nl_sel on public.notify_log;
create policy p_nl_sel on public.notify_log for select to authenticated using (
  public.app_role() = any (array['admin','owner'])
);
-- เขียนได้เฉพาะผ่าน RPC / Edge Function (service role)
revoke insert, update, delete on public.line_links, public.line_link_codes, public.line_link_fails, public.notify_log from anon, authenticated;
revoke select on public.line_link_codes, public.line_link_fails from anon, authenticated;

-- ===== RPC ของผู้ใช้ =====
create or replace function public.line_link_code()
returns text language plpgsql security definer set search_path = public, extensions as $$
declare u uuid := auth.uid(); c text;
begin
  if u is null then raise exception 'กรุณาเข้าสู่ระบบ'; end if;
  delete from public.line_link_codes where user_id = u or expires_at < now();
  loop
    c := lpad(((('x' || encode(gen_random_bytes(4), 'hex'))::bit(32)::bigint) % 1000000)::text, 6, '0');
    exit when not exists (select 1 from public.line_link_codes where code = c);
  end loop;
  insert into public.line_link_codes(code, user_id, expires_at) values (c, u, now() + interval '10 minutes');
  return c;
end $$;

create or replace function public.line_unlink()
returns void language sql security definer set search_path = public as $$
  delete from public.line_links where user_id = auth.uid();
  delete from public.line_link_codes where user_id = auth.uid();
$$;

revoke execute on function public.line_link_code(), public.line_unlink() from public, anon;
grant execute on function public.line_link_code(), public.line_unlink() to authenticated;

-- ===== ตัวสั่งส่ง (ภายใน) =====
-- secret ภายในสำหรับเรียก line-notify (สุ่มครั้งเดียว เก็บใน Vault)
do $$ begin
  if not exists (select 1 from vault.secrets where name = 'line_notify_secret') then
    perform vault.create_secret(encode(extensions.gen_random_bytes(32), 'hex'), 'line_notify_secret', 'internal: DB -> line-notify');
  end if;
end $$;

-- Edge Function ตรวจ secret ผ่านฟังก์ชันนี้ (เรียกได้เฉพาะ service role) secret ไม่ต้องออกจากฐานข้อมูล
create or replace function public.notify_secret_ok(p text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from vault.decrypted_secrets where name = 'line_notify_secret' and decrypted_secret = p);
$$;
revoke execute on function public.notify_secret_ok(text) from public, anon, authenticated;

-- ส่งงานให้ line-notify (ไม่โยน error กลับ เพื่อไม่ให้การออกบิล/อนุมัติสะดุด)
create or replace function public.notify_line(p_kind text, p_invoice uuid default null, p_payment uuid default null)
returns bigint language plpgsql security definer set search_path = public, extensions as $$
declare s text; rid bigint;
begin
  select decrypted_secret into s from vault.decrypted_secrets where name = 'line_notify_secret';
  if s is null then return null; end if;
  select net.http_post(
    url := 'https://hpliogcnsxtnrvuyykzd.supabase.co/functions/v1/line-notify',
    body := jsonb_build_object('kind', p_kind, 'invoice_id', p_invoice, 'payment_id', p_payment),
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-notify-secret', s),
    timeout_milliseconds := 15000
  ) into rid;
  return rid;
exception when others then
  return null;
end $$;
revoke execute on function public.notify_line(text, uuid, uuid) from public, anon, authenticated;

-- ===== เหตุการณ์ =====
create or replace function public.line_invoice_trg()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  perform public.notify_line('bill', new.id, null);
  return new;
end $$;
drop trigger if exists trg_line_invoice on public.invoices;
create trigger trg_line_invoice after insert on public.invoices
  for each row execute function public.line_invoice_trg();

create or replace function public.line_payment_trg()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' and new.verify_status = 'pending' then
    perform public.notify_line('slip', new.invoice_id, new.id);
  end if;
  if new.verify_status = 'approved' and (tg_op = 'INSERT' or old.verify_status is distinct from 'approved') then
    perform public.notify_line('receipt', new.invoice_id, new.id);
  end if;
  if tg_op = 'UPDATE' and new.verify_status = 'rejected' and old.verify_status is distinct from 'rejected' then
    perform public.notify_line('reject', new.invoice_id, new.id);
  end if;
  return new;
end $$;
drop trigger if exists trg_line_payment on public.payments;
create trigger trg_line_payment after insert or update of verify_status on public.payments
  for each row execute function public.line_payment_trg();

revoke execute on function public.line_invoice_trg(), public.line_payment_trg() from public, anon, authenticated;

-- ===== เตือนตามวันที่ (ทุกวัน 09:00 น.) =====
-- ใกล้ครบกำหนด = วันครบกำหนด − 2 (วันที่ 3) · เลยกำหนด = +1 (วันที่ 6) · วันสุดท้ายก่อนผิดนัด = +5 (วันที่ 10)
create or replace function public.line_daily()
returns integer language plpgsql security definer set search_path = public as $$
declare d date := (now() at time zone 'Asia/Bangkok')::date; r record; n int := 0;
begin
  for r in
    select id, case when due_date - 2 = d then 'due_soon' when due_date + 1 = d then 'overdue' else 'last_day' end k
      from public.invoices
     where status = 'unpaid' and d in (due_date - 2, due_date + 1, due_date + 5)
  loop
    perform public.notify_line(r.k, r.id, null);
    n := n + 1;
  end loop;
  return n;
end $$;
revoke execute on function public.line_daily() from public, anon, authenticated;

select cron.unschedule(jobid) from cron.job where jobname = 'line-daily';
select cron.schedule('line-daily', '0 2 * * *', 'select public.line_daily()');

-- ===== ส่งเตือนเองจากหน้า "ติดตามหนี้ค้าง" (แอดมิน) =====
create or replace function public.line_remind(p_invoice uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if public.app_role() is distinct from 'admin' then raise exception 'เฉพาะผู้ดูแลระบบ'; end if;
  if not exists (select 1 from public.invoices where id = p_invoice and status = 'unpaid') then
    raise exception 'บิลนี้ไม่ได้ค้างชำระ';
  end if;
  perform public.notify_line('manual', p_invoice, null);
end $$;

-- ส่งเตือนทุกบิลที่เลยกำหนดและผู้เช่าเชื่อม LINE แล้ว · คืนจำนวนบิลที่ส่ง
create or replace function public.line_remind_overdue()
returns integer language plpgsql security definer set search_path = public as $$
declare d date := (now() at time zone 'Asia/Bangkok')::date; r record; n int := 0;
begin
  if public.app_role() is distinct from 'admin' then raise exception 'เฉพาะผู้ดูแลระบบ'; end if;
  for r in
    select i.id from public.invoices i
      join public.contracts c on c.id = i.contract_id
      join public.tenants t on t.id = c.tenant_id
      join public.line_links l on l.user_id = t.user_id
     where i.status = 'unpaid' and i.due_date < d
  loop
    perform public.notify_line('manual', r.id, null);
    n := n + 1;
  end loop;
  return n;
end $$;
revoke execute on function public.line_remind(uuid), public.line_remind_overdue() from public, anon;
grant execute on function public.line_remind(uuid), public.line_remind_overdue() to authenticated;
