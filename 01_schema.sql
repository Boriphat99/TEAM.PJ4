-- =====================================================================
-- T&T Mansion — ระบบรับชำระค่าบริการหอพัก  |  PostgreSQL (Supabase)
-- รันทั้งไฟล์ใน Supabase Dashboard > SQL Editor (รันซ้ำได้ ไม่ทำข้อมูลเดิมหาย)
-- ตารางตาม ER Diagram ในโครงร่างปัญหาพิเศษ + ตารางเสริมที่เว็บต้องใช้
-- v2: ตรวจเทียบกับโค้ดเว็บ T-M.html ทุกจุดที่เรียกฐานข้อมูล และแก้จุดที่ทำให้เชื่อมไม่สมบูรณ์
--     (1) บันทึกโปรไฟล์/ภาษา (เว็บส่งคอลัมน์ id ไปด้วย)  (2) อีเมลถึงเวลาส่งทันที
--     (3) เงินแรกเข้าของสัญญาเดิมไม่ถูกเขียนทับ  (4) ประทับผู้อนุมัติ/วันที่อนุมัติ  (5) สถานะบิลตรงกับการชำระเสมอ
-- =====================================================================

create extension if not exists pgcrypto;
create sequence if not exists public.app_seq;   -- เลขลำดับให้ฝั่งเว็บใช้เป็น id ตัวเลขของผู้ใช้/ผู้เช่า

-- ---------------------------------------------------------------------
-- 1) ตาราง
-- ---------------------------------------------------------------------

-- อีเมลที่กำหนดเป็นผู้ดูแลระบบ / เจ้าของกิจการ (แก้ในไฟล์ 02_staff_emails.sql)
create table if not exists public.staff_emails (
  email text primary key check (email = lower(email)),
  role  text not null check (role in ('admin','owner'))
);

-- SETTINGS
create table if not exists public.app_settings (
  id               uuid primary key default gen_random_uuid(),
  rent_rate        numeric(10,2) not null default 3600,
  electricity_rate numeric(10,2) not null default 8,
  default_deposit  numeric(10,2) not null default 7600,
  fine_per_day     numeric(10,2) not null default 50,
  max_fine         numeric(10,2) not null default 250,
  due_day          int  not null default 5 check (due_day between 1 and 28),
  promptpay_id     text,
  dorm_name        text default 'T&T Mansion',
  address          text,
  phone            text,
  tax_id           text,
  payee_name       text,
  system_url       text,          -- ลิงก์เว็บที่ใส่ในอีเมล
  line_id          text,          -- LINE Official Account
  line_qr_path     text,          -- path รูป QR LINE ใน bucket branding
  updated_at       timestamptz default now()
);
create unique index if not exists app_settings_singleton on public.app_settings ((true));

-- USERS (บัญชีเข้าสู่ระบบ: ผู้ดูแล / เจ้าของ / ผู้เช่า)
create table if not exists public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  app_id      bigint not null unique default nextval('public.app_seq'),
  role        text   not null default 'tenant' check (role in ('owner','admin','tenant')),
  email       text   not null,
  full_name   text,
  phone       text,
  gender      text,
  avatar_path text,
  lang        text default 'th' check (lang in ('th','en')),
  created_at  timestamptz default now()
);

-- TENANTS
create table if not exists public.tenants (
  id         uuid primary key default gen_random_uuid(),
  app_id     bigint not null unique default nextval('public.app_seq'),
  user_id    uuid unique references public.users(id) on delete set null,
  full_name  text not null,
  phone      text,
  email      text,
  gender     text,
  address    text,
  created_at timestamptz default now()
);

-- ROOMS
create table if not exists public.rooms (
  id                 uuid primary key default gen_random_uuid(),
  room_no            text not null unique,
  occupancy_status   text not null default 'free' check (occupancy_status in ('free','busy','maint')),
  current_meter      numeric(10,0) not null default 0,   -- เลขมิเตอร์ล่าสุด
  contract_pdf_path  text,                                -- ไฟล์สัญญาเช่า (bucket contracts)
  contract_pdf_name  text,
  contract_pdf_size  int
);

-- CONTRACTS
create table if not exists public.contracts (
  id             uuid primary key default gen_random_uuid(),
  tenant_id      uuid not null references public.tenants(id) on delete cascade,
  room_id        uuid not null references public.rooms(id),
  start_date     date not null default current_date,
  end_date       date,
  deposit_amount numeric(10,2) not null default 7600,
  status         text not null default 'active' check (status in ('active','ended')),
  moved_out_at   timestamptz,
  created_at     timestamptz default now()
);
create unique index if not exists contracts_one_active_per_room   on public.contracts(room_id)   where status = 'active';
create unique index if not exists contracts_one_active_per_tenant on public.contracts(tenant_id) where status = 'active';

-- METER_READINGS
create table if not exists public.meter_readings (
  id               uuid primary key default gen_random_uuid(),
  room_id          uuid not null references public.rooms(id),
  billing_month    text not null check (billing_month ~ '^\d{4}-\d{2}$'),
  previous_reading numeric(10,0) not null,
  current_reading  numeric(10,0) not null,
  units_used       numeric(10,0) generated always as (current_reading - previous_reading) stored,
  created_at       timestamptz default now(),
  check (current_reading >= previous_reading),
  unique (room_id, billing_month)
);

-- INVOICES
create table if not exists public.invoices (
  id            uuid primary key default gen_random_uuid(),
  code          text not null unique,            -- เลขที่บิล เช่น INV202609-101
  contract_id   uuid not null references public.contracts(id),
  billing_month text not null check (billing_month ~ '^\d{4}-\d{2}$'),
  issue_date    date not null default current_date,
  due_date      date not null,
  status        text not null default 'unpaid' check (status in ('unpaid','pending','paid','overdue')),
  total_amount  numeric(12,2) not null default 0,
  created_at    timestamptz default now(),
  unique (contract_id, billing_month)
);

-- INVOICE_ITEMS
create table if not exists public.invoice_items (
  id               uuid primary key default gen_random_uuid(),
  invoice_id       uuid not null references public.invoices(id) on delete cascade,
  meter_reading_id uuid references public.meter_readings(id),
  item_type        text not null check (item_type in ('rent','electricity','other','fine')),
  description      text,
  amount           numeric(12,2) not null default 0,
  unique (invoice_id, item_type)
);

-- PAYMENTS
create table if not exists public.payments (
  id             uuid primary key default gen_random_uuid(),
  invoice_id     uuid not null references public.invoices(id) on delete cascade,
  receipt_no     text unique,
  payment_method text not null default 'qr' check (payment_method in ('qr','cash')),
  slip_url       text,                          -- path ใน bucket slips (private)
  amount_paid    numeric(12,2) not null default 0,
  verify_status  text not null default 'pending' check (verify_status in ('pending','approved','rejected')),
  submitted_at   timestamptz default now(),
  paid_at        timestamptz,
  verified_at    timestamptz,
  verified_by    uuid references public.users(id)
);
create unique index if not exists payments_one_open_per_invoice on public.payments(invoice_id) where verify_status <> 'rejected';

-- ตารางเสริม: คำขอช่วยเหลือ / ข่าวสาร / คิวอีเมล / บันทึกการใช้งาน
create table if not exists public.support_tickets (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,
  author_id   uuid not null references public.users(id),
  author_name text,
  author_room text,
  category    text not null,
  title       text not null,
  body        text not null,
  status      text not null default 'open' check (status in ('open','prog','done')),
  admin_reply text,
  replied_by  text,
  replied_at  timestamptz,
  image_paths text[] not null default '{}',     -- bucket attachments (private)
  created_at  timestamptz default now()
);

create table if not exists public.news (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  body        text not null,
  author_name text,
  created_at  timestamptz default now()
);

create table if not exists public.email_queue (
  id          uuid primary key default gen_random_uuid(),
  kind        text not null check (kind in ('invoice','receipt')),
  invoice_id  uuid not null references public.invoices(id) on delete cascade,
  to_email    text not null,
  subject     text,
  status      text not null default 'pending' check (status in ('pending','sent','failed','wait')),
  error       text,
  attempts    int not null default 0,
  send_after  timestamptz not null default now() - interval '5 seconds',   -- ถึงเวลาส่งทันที (เว็บสั่งส่งเองหลังออกบิล/อนุมัติ)
  created_at  timestamptz default now(),
  sent_at     timestamptz,
  unique (kind, invoice_id)
);

-- (ติดตั้งซ้ำบนโปรเจกต์เดิม) ปรับค่าเริ่มต้นและปลดอีเมลที่ค้างให้ถึงเวลาส่ง
alter table public.email_queue alter column send_after set default now() - interval '5 seconds';
update public.email_queue set send_after = now() where status in ('pending','wait') and send_after > now();

create table if not exists public.audit_logs (
  id         bigint generated always as identity primary key,
  actor_id   uuid references public.users(id) on delete set null,
  actor_name text,
  action     text not null,
  created_at timestamptz default now()
);
create index if not exists audit_logs_created_idx on public.audit_logs(created_at desc);

-- ---------------------------------------------------------------------
-- 2) ฟังก์ชันช่วยตรวจสิทธิ์ (security definer = ไม่ติด RLS ของตัวเอง)
-- ---------------------------------------------------------------------
create or replace function public.app_role() returns text
language sql stable security definer set search_path = public as
$$ select role from public.users where id = auth.uid() $$;

create or replace function public.my_tenant_id() returns uuid
language sql stable security definer set search_path = public as
$$ select id from public.tenants where user_id = auth.uid() limit 1 $$;

create or replace function public.my_contract_ids() returns setof uuid
language sql stable security definer set search_path = public as
$$ select id from public.contracts where tenant_id = public.my_tenant_id() $$;

create or replace function public.my_room_ids() returns setof uuid
language sql stable security definer set search_path = public as
$$ select room_id from public.contracts where tenant_id = public.my_tenant_id() $$;

create or replace function public.my_invoice_ids() returns setof uuid
language sql stable security definer set search_path = public as
$$ select id from public.invoices where contract_id in (select public.my_contract_ids()) $$;

-- เบอร์โทรติดต่อผู้ดูแล/เจ้าของ (ให้ผู้เช่าและเจ้าของเห็นในหน้าช่วยเหลือ โดยไม่เปิดตารางผู้ใช้ทั้งหมด)
create or replace function public.get_contacts()
returns table(role text, full_name text, phone text)
language sql stable security definer set search_path = public as
$$ select u.role, u.full_name, u.phone from public.users u where u.role in ('admin','owner') $$;

-- ---------------------------------------------------------------------
-- 3) สมัครสมาชิก -> สร้างโปรไฟล์อัตโนมัติ + กำหนดบทบาทจาก staff_emails
--    (ผู้ที่สมัครด้วยอีเมลใน staff_emails จะได้เป็นผู้ดูแล/เจ้าของ นอกนั้นเป็นผู้เช่า)
-- ---------------------------------------------------------------------
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as
$$
declare r text; nm text; ph text; gd text;
begin
  select role into r from public.staff_emails where email = lower(new.email);
  r  := coalesce(r, 'tenant');
  nm := coalesce(nullif(new.raw_user_meta_data->>'full_name',''), split_part(new.email,'@',1));
  ph := nullif(new.raw_user_meta_data->>'phone','');
  gd := nullif(new.raw_user_meta_data->>'gender','');
  insert into public.users(id, role, email, full_name, phone, gender)
  values (new.id, r, lower(new.email), nm, ph, gd);
  if r = 'tenant' then
    insert into public.tenants(user_id, full_name, phone, email, gender)
    values (new.id, nm, ph, lower(new.email), gd);
  end if;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

-- ถ้าเพิ่มอีเมลใน staff_emails ทีหลัง และคนนั้นสมัครไปแล้ว ให้เปลี่ยนบทบาทตามทันที
create or replace function public.sync_staff_role() returns trigger
language plpgsql security definer set search_path = public as
$$
begin
  update public.users set role = new.role where email = new.email;
  delete from public.tenants t
   where t.user_id in (select id from public.users where email = new.email)
     and not exists (select 1 from public.contracts c where c.tenant_id = t.id);
  return new;
end $$;

drop trigger if exists staff_emails_sync on public.staff_emails;
create trigger staff_emails_sync after insert or update on public.staff_emails
for each row execute function public.sync_staff_role();

-- ---------------------------------------------------------------------
-- 4) คิวอีเมลอัตโนมัติ: ออกใบแจ้งหนี้ -> คิวอีเมลใบแจ้งหนี้ / อนุมัติชำระ -> คิวอีเมลใบเสร็จ
--    (Edge Function "send-email" มาอ่านคิวแล้วส่งจริง)
-- ---------------------------------------------------------------------
create or replace function public.queue_invoice_email() returns trigger
language plpgsql security definer set search_path = public as
$$
declare em text; rn text; dn text;
begin
  select coalesce(t.email, us.email), r.room_no into em, rn
    from public.contracts c
    join public.tenants t on t.id = c.tenant_id
    left join public.users us on us.id = t.user_id
    join public.rooms r on r.id = c.room_id
   where c.id = new.contract_id;
  select dorm_name into dn from public.app_settings limit 1;
  if em is not null then
    insert into public.email_queue(kind, invoice_id, to_email, subject)
    values ('invoice', new.id, em, 'ใบแจ้งหนี้ ' || new.billing_month || ' ห้อง ' || rn || ' - ' || coalesce(dn,'T&T Mansion'))
    on conflict (kind, invoice_id) do nothing;
  end if;
  return new;
end $$;

drop trigger if exists trg_invoice_email on public.invoices;
create trigger trg_invoice_email after insert on public.invoices
for each row execute function public.queue_invoice_email();

create or replace function public.queue_receipt_email() returns trigger
language plpgsql security definer set search_path = public as
$$
declare em text; rn text; dn text; bm text;
begin
  if new.verify_status = 'approved' and (tg_op = 'INSERT' or old.verify_status is distinct from 'approved') then
    select coalesce(t.email, us.email), r.room_no, i.billing_month into em, rn, bm
      from public.invoices i
      join public.contracts c on c.id = i.contract_id
      join public.tenants t on t.id = c.tenant_id
      left join public.users us on us.id = t.user_id
      join public.rooms r on r.id = c.room_id
     where i.id = new.invoice_id;
    select dorm_name into dn from public.app_settings limit 1;
    if em is not null then
      insert into public.email_queue(kind, invoice_id, to_email, subject)
      values ('receipt', new.invoice_id, em, 'ใบเสร็จรับเงิน ' || bm || ' ห้อง ' || rn || ' - ' || coalesce(dn,'T&T Mansion'))
      on conflict (kind, invoice_id) do nothing;
    end if;
  end if;
  return new;
end $$;

drop trigger if exists trg_receipt_email on public.payments;
create trigger trg_receipt_email after insert or update of verify_status on public.payments
for each row execute function public.queue_receipt_email();

-- ---------------------------------------------------------------------
-- 5) ผู้เช่าแจ้งชำระเงิน (แนบสลิป) -- ผ่านฟังก์ชันนี้เท่านั้น ผู้เช่าแก้ตารางตรงๆ ไม่ได้
--    คำนวณค่าปรับฝั่งเซิร์ฟเวอร์: วันละ fine_per_day สูงสุด max_fine (นับตั้งแต่เลยวันครบกำหนด)
-- ---------------------------------------------------------------------
create or replace function public.submit_payment(p_invoice uuid, p_slip text)
returns void language plpgsql security definer set search_path = public as
$$
declare inv public.invoices; s public.app_settings; d int; fn numeric := 0; base numeric;
begin
  if public.app_role() is distinct from 'tenant' then raise exception 'not allowed'; end if;
  select * into inv from public.invoices where id = p_invoice and id in (select public.my_invoice_ids());
  if not found then raise exception 'invoice not found'; end if;
  if inv.status <> 'unpaid' then raise exception 'invoice is not payable'; end if;
  select * into s from public.app_settings limit 1;
  d := ((now() at time zone 'Asia/Bangkok')::date - inv.due_date);
  if d > 0 then fn := least(s.max_fine, d * s.fine_per_day); end if;
  select coalesce(sum(amount),0) into base from public.invoice_items where invoice_id = inv.id and item_type <> 'fine';
  if fn > 0 then
    insert into public.invoice_items(invoice_id, item_type, description, amount)
    values (inv.id, 'fine', 'ค่าปรับล่าช้า', fn)
    on conflict (invoice_id, item_type) do update set amount = excluded.amount;
  end if;
  insert into public.payments(invoice_id, payment_method, slip_url, amount_paid, verify_status, submitted_at)
  values (inv.id, 'qr', p_slip, base + fn, 'pending', now());
  update public.invoices set status = 'pending', total_amount = base + fn where id = inv.id;
end $$;

-- ---------------------------------------------------------------------
-- 5b) ทริกเกอร์ป้องกันข้อมูล + ความสอดคล้องของสถานะ (เพิ่มใน v2)
-- ---------------------------------------------------------------------
-- รหัสผู้ใช้ห้ามเปลี่ยน
create or replace function public.users_guard() returns trigger
language plpgsql as
$$
begin
  if new.id is distinct from old.id then raise exception 'users.id is immutable'; end if;
  return new;
end $$;
drop trigger if exists trg_users_guard on public.users;
create trigger trg_users_guard before update on public.users for each row execute function public.users_guard();

-- ผู้เช่าแก้อีเมล/การผูกบัญชีของตัวเองไม่ได้ (ผู้ดูแลและการรันจาก SQL Editor แก้ได้)
create or replace function public.tenants_guard() returns trigger
language plpgsql security definer set search_path = public as
$$
begin
  new.id := old.id; new.app_id := old.app_id; new.created_at := old.created_at;
  if auth.uid() is not null and public.app_role() is distinct from 'admin' then
    new.user_id := old.user_id; new.email := old.email;
  end if;
  return new;
end $$;
drop trigger if exists trg_tenants_guard on public.tenants;
create trigger trg_tenants_guard before update on public.tenants for each row execute function public.tenants_guard();

-- เงินแรกเข้าบันทึกครั้งเดียว ณ วันเริ่มสัญญา: แก้ค่าตั้งต้นในหน้าตั้งค่าแล้วสัญญาเดิมไม่เปลี่ยนตาม
-- และสัญญาเดิมย้ายผู้เช่า/ห้องไม่ได้ (ย้ายห้องให้ทำสัญญาใหม่)
create or replace function public.contracts_guard() returns trigger
language plpgsql security definer set search_path = public as
$$
begin
  new.id := old.id; new.created_at := old.created_at;
  if auth.uid() is not null then
    new.deposit_amount := old.deposit_amount;
    new.tenant_id := old.tenant_id;
    new.room_id := old.room_id;
  end if;
  return new;
end $$;
drop trigger if exists trg_contracts_guard on public.contracts;
create trigger trg_contracts_guard before update on public.contracts for each row execute function public.contracts_guard();

-- ประทับผู้ตรวจสอบ/วันที่ตรวจสอบ/วันที่ชำระ เมื่อสถานะเปลี่ยนเป็นอนุมัติหรือปฏิเสธ
create or replace function public.payments_stamp() returns trigger
language plpgsql security definer set search_path = public as
$$
begin
  if new.verify_status in ('approved','rejected')
     and (tg_op = 'INSERT' or old.verify_status is distinct from new.verify_status) then
    if auth.uid() is not null then new.verified_by := auth.uid(); end if;
    new.verified_at := coalesce(new.verified_at, now());
    if new.verify_status = 'approved' then new.paid_at := coalesce(new.paid_at, now()); end if;
  end if;
  return new;
end $$;
drop trigger if exists trg_payments_stamp on public.payments;
create trigger trg_payments_stamp before insert or update on public.payments for each row execute function public.payments_stamp();

-- สถานะบิลตรงกับการชำระเสมอ (อนุมัติ -> ชำระแล้ว / ปฏิเสธ -> กลับเป็นยังไม่ชำระ ให้ผู้เช่าส่งสลิปใหม่ได้)
create or replace function public.payments_sync_invoice() returns trigger
language plpgsql security definer set search_path = public as
$$
begin
  if new.verify_status = 'approved' then
    update public.invoices set status = 'paid' where id = new.invoice_id and status <> 'paid';
  elsif new.verify_status = 'rejected' and tg_op = 'UPDATE' and old.verify_status is distinct from 'rejected' then
    update public.invoices set status = 'unpaid' where id = new.invoice_id and status = 'pending';
  end if;
  return new;
end $$;
drop trigger if exists trg_payments_sync_invoice on public.payments;
create trigger trg_payments_sync_invoice after insert or update of verify_status on public.payments
for each row execute function public.payments_sync_invoice();

-- บันทึกเวลาแก้ไขตั้งค่าอัตโนมัติ
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$ begin new.updated_at := now(); return new; end $$;
drop trigger if exists trg_settings_touch on public.app_settings;
create trigger trg_settings_touch before update on public.app_settings for each row execute function public.touch_updated_at();

-- ดัชนีของคอลัมน์ที่ใช้ในนโยบาย RLS และการค้นหา (ให้เร็วขึ้นเมื่อข้อมูลมาก)
create index if not exists contracts_tenant_idx   on public.contracts(tenant_id);
create index if not exists contracts_room_idx     on public.contracts(room_id);
create index if not exists meter_readings_room_ix on public.meter_readings(room_id);
create index if not exists invoices_contract_idx  on public.invoices(contract_id);
create index if not exists invoices_status_idx    on public.invoices(status);
create index if not exists invoice_items_inv_idx  on public.invoice_items(invoice_id);
create index if not exists payments_invoice_idx   on public.payments(invoice_id);
create index if not exists tickets_author_idx     on public.support_tickets(author_id);
create index if not exists email_queue_due_idx    on public.email_queue(status, send_after);

-- ---------------------------------------------------------------------
-- 6) สิทธิ์ตาราง + Row Level Security
--    ผู้ดูแลระบบ (admin) = จัดการได้ทั้งหมด | เจ้าของ (owner) = ดูรายงานอย่างเดียว
--    ผู้เช่า (tenant) = เห็นเฉพาะข้อมูลของห้อง/บิล/สัญญาตัวเอง
-- ---------------------------------------------------------------------
revoke all on all tables    in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
revoke all on all functions in schema public from public, anon, authenticated;

grant usage on schema public to anon, authenticated;
grant execute on function public.app_role(), public.my_tenant_id(), public.my_contract_ids(),
  public.my_room_ids(), public.my_invoice_ids(), public.get_contacts(), public.submit_payment(uuid, text)
  to authenticated;

grant select on public.app_settings, public.rooms, public.tenants, public.contracts, public.meter_readings,
  public.invoices, public.invoice_items, public.payments, public.support_tickets, public.news,
  public.email_queue, public.audit_logs, public.staff_emails, public.users to authenticated;
grant update on public.app_settings, public.rooms, public.tenants, public.contracts, public.meter_readings,
  public.invoices, public.invoice_items, public.payments, public.support_tickets, public.news,
  public.email_queue to authenticated;
grant update (id, full_name, phone, gender, avatar_path, lang) on public.users to authenticated;   -- ห้ามแก้ role/email เอง (เว็บส่ง id มาด้วยทุกครั้ง จึงต้องให้สิทธิ์ แต่มีทริกเกอร์ users_guard ห้ามเปลี่ยนค่า id)
grant insert on public.contracts, public.meter_readings, public.invoices, public.invoice_items,
  public.payments, public.support_tickets, public.news, public.audit_logs, public.staff_emails to authenticated;
grant delete on public.invoice_items, public.news, public.staff_emails to authenticated;
grant update, delete on public.staff_emails to authenticated;

alter table public.staff_emails    enable row level security;
alter table public.app_settings    enable row level security;
alter table public.users           enable row level security;
alter table public.tenants         enable row level security;
alter table public.rooms           enable row level security;
alter table public.contracts       enable row level security;
alter table public.meter_readings  enable row level security;
alter table public.invoices        enable row level security;
alter table public.invoice_items   enable row level security;
alter table public.payments        enable row level security;
alter table public.support_tickets enable row level security;
alter table public.news            enable row level security;
alter table public.email_queue     enable row level security;
alter table public.audit_logs      enable row level security;

-- staff_emails: เฉพาะผู้ดูแล
drop policy if exists p_staff_all on public.staff_emails;
create policy p_staff_all on public.staff_emails for all to authenticated
  using (public.app_role() = 'admin') with check (public.app_role() = 'admin');

-- app_settings: ทุกคนที่ล็อกอินอ่านได้ (ต้องใช้ค่าเช่า/พร้อมเพย์) แก้ได้เฉพาะผู้ดูแล
drop policy if exists p_set_sel on public.app_settings;
drop policy if exists p_set_upd on public.app_settings;
create policy p_set_sel on public.app_settings for select to authenticated using (true);
create policy p_set_upd on public.app_settings for update to authenticated
  using (public.app_role() = 'admin') with check (public.app_role() = 'admin');

-- users
drop policy if exists p_users_sel on public.users;
drop policy if exists p_users_upd on public.users;
create policy p_users_sel on public.users for select to authenticated
  using (id = auth.uid() or public.app_role() in ('admin','owner'));
create policy p_users_upd on public.users for update to authenticated
  using (id = auth.uid() or public.app_role() = 'admin') with check (id = auth.uid() or public.app_role() = 'admin');

-- tenants
drop policy if exists p_ten_sel on public.tenants;
drop policy if exists p_ten_upd on public.tenants;
create policy p_ten_sel on public.tenants for select to authenticated
  using (public.app_role() in ('admin','owner') or user_id = auth.uid());
create policy p_ten_upd on public.tenants for update to authenticated
  using (public.app_role() = 'admin' or user_id = auth.uid()) with check (public.app_role() = 'admin' or user_id = auth.uid());

-- rooms
drop policy if exists p_room_sel on public.rooms;
drop policy if exists p_room_upd on public.rooms;
create policy p_room_sel on public.rooms for select to authenticated
  using (public.app_role() in ('admin','owner') or id in (select public.my_room_ids()));
create policy p_room_upd on public.rooms for update to authenticated
  using (public.app_role() = 'admin') with check (public.app_role() = 'admin');

-- contracts
drop policy if exists p_con_sel on public.contracts;
drop policy if exists p_con_ins on public.contracts;
drop policy if exists p_con_upd on public.contracts;
create policy p_con_sel on public.contracts for select to authenticated
  using (public.app_role() in ('admin','owner') or tenant_id = public.my_tenant_id());
create policy p_con_ins on public.contracts for insert to authenticated with check (public.app_role() = 'admin');
create policy p_con_upd on public.contracts for update to authenticated
  using (public.app_role() = 'admin') with check (public.app_role() = 'admin');

-- meter_readings
drop policy if exists p_mr_sel on public.meter_readings;
drop policy if exists p_mr_ins on public.meter_readings;
drop policy if exists p_mr_upd on public.meter_readings;
create policy p_mr_sel on public.meter_readings for select to authenticated
  using (public.app_role() in ('admin','owner') or room_id in (select public.my_room_ids()));
create policy p_mr_ins on public.meter_readings for insert to authenticated with check (public.app_role() = 'admin');
create policy p_mr_upd on public.meter_readings for update to authenticated
  using (public.app_role() = 'admin') with check (public.app_role() = 'admin');

-- invoices
drop policy if exists p_inv_sel on public.invoices;
drop policy if exists p_inv_ins on public.invoices;
drop policy if exists p_inv_upd on public.invoices;
create policy p_inv_sel on public.invoices for select to authenticated
  using (public.app_role() in ('admin','owner') or contract_id in (select public.my_contract_ids()));
create policy p_inv_ins on public.invoices for insert to authenticated with check (public.app_role() = 'admin');
create policy p_inv_upd on public.invoices for update to authenticated
  using (public.app_role() = 'admin') with check (public.app_role() = 'admin');

-- invoice_items
drop policy if exists p_it_sel on public.invoice_items;
drop policy if exists p_it_ins on public.invoice_items;
drop policy if exists p_it_upd on public.invoice_items;
drop policy if exists p_it_del on public.invoice_items;
create policy p_it_sel on public.invoice_items for select to authenticated
  using (public.app_role() in ('admin','owner') or invoice_id in (select public.my_invoice_ids()));
create policy p_it_ins on public.invoice_items for insert to authenticated with check (public.app_role() = 'admin');
create policy p_it_upd on public.invoice_items for update to authenticated
  using (public.app_role() = 'admin') with check (public.app_role() = 'admin');
create policy p_it_del on public.invoice_items for delete to authenticated using (public.app_role() = 'admin');

-- payments (ผู้เช่าส่งผ่าน submit_payment เท่านั้น)
drop policy if exists p_pay_sel on public.payments;
drop policy if exists p_pay_ins on public.payments;
drop policy if exists p_pay_upd on public.payments;
create policy p_pay_sel on public.payments for select to authenticated
  using (public.app_role() in ('admin','owner') or invoice_id in (select public.my_invoice_ids()));
create policy p_pay_ins on public.payments for insert to authenticated with check (public.app_role() = 'admin');
create policy p_pay_upd on public.payments for update to authenticated
  using (public.app_role() = 'admin') with check (public.app_role() = 'admin');

-- support_tickets: เจ้าของ/ผู้เช่าส่งคำขอได้ ผู้ดูแลส่งไม่ได้ (รับและช่วยเหลืออย่างเดียว)
drop policy if exists p_tk_sel on public.support_tickets;
drop policy if exists p_tk_ins on public.support_tickets;
drop policy if exists p_tk_upd on public.support_tickets;
create policy p_tk_sel on public.support_tickets for select to authenticated
  using (public.app_role() = 'admin' or author_id = auth.uid());
create policy p_tk_ins on public.support_tickets for insert to authenticated
  with check (author_id = auth.uid() and public.app_role() in ('owner','tenant') and status = 'open');
create policy p_tk_upd on public.support_tickets for update to authenticated
  using (public.app_role() = 'admin') with check (public.app_role() = 'admin');

-- news
drop policy if exists p_news_sel on public.news;
drop policy if exists p_news_ins on public.news;
drop policy if exists p_news_upd on public.news;
drop policy if exists p_news_del on public.news;
create policy p_news_sel on public.news for select to authenticated using (true);
create policy p_news_ins on public.news for insert to authenticated with check (public.app_role() = 'admin');
create policy p_news_upd on public.news for update to authenticated
  using (public.app_role() = 'admin') with check (public.app_role() = 'admin');
create policy p_news_del on public.news for delete to authenticated using (public.app_role() = 'admin');

-- email_queue (เซิร์ฟเวอร์เป็นคนเพิ่มแถว ผู้ดูแลดูและสั่งส่งซ้ำได้)
drop policy if exists p_mq_sel on public.email_queue;
drop policy if exists p_mq_upd on public.email_queue;
create policy p_mq_sel on public.email_queue for select to authenticated using (public.app_role() = 'admin');
create policy p_mq_upd on public.email_queue for update to authenticated
  using (public.app_role() = 'admin') with check (public.app_role() = 'admin');

-- audit_logs
drop policy if exists p_log_sel on public.audit_logs;
drop policy if exists p_log_ins on public.audit_logs;
create policy p_log_sel on public.audit_logs for select to authenticated using (public.app_role() in ('admin','owner'));
create policy p_log_ins on public.audit_logs for insert to authenticated with check (actor_id = auth.uid());

-- ---------------------------------------------------------------------
-- 7) Storage (ไฟล์) : สลิป / สัญญา PDF / รูปโปรไฟล์ / รูปแนบคำขอ / QR LINE
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('slips',       'slips',       false, 5242880, array['image/jpeg','image/png']),
  ('contracts',   'contracts',   false, 5242880, array['application/pdf']),
  ('avatars',     'avatars',     true,  5242880, array['image/jpeg','image/png','image/webp']),
  ('attachments', 'attachments', false, 5242880, array['image/jpeg','image/png','image/webp']),
  ('branding',    'branding',    true,  2097152, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- slips: path = {invoice_uuid}/{timestamp}.jpg
drop policy if exists st_slips_ins on storage.objects;
drop policy if exists st_slips_sel on storage.objects;
create policy st_slips_ins on storage.objects for insert to authenticated
  with check (bucket_id = 'slips' and public.app_role() = 'tenant'
    and (storage.foldername(name))[1] in (select i::text from public.my_invoice_ids() i));
create policy st_slips_sel on storage.objects for select to authenticated
  using (bucket_id = 'slips' and (public.app_role() in ('admin','owner')
    or (storage.foldername(name))[1] in (select i::text from public.my_invoice_ids() i)));

-- contracts: path = {room_no}.pdf  (ผู้ดูแลอัปโหลด / ผู้เช่าเห็นเฉพาะห้องตัวเอง)
drop policy if exists st_con_sel on storage.objects;
drop policy if exists st_con_ins on storage.objects;
drop policy if exists st_con_upd on storage.objects;
drop policy if exists st_con_del on storage.objects;
create policy st_con_sel on storage.objects for select to authenticated
  using (bucket_id = 'contracts' and (public.app_role() in ('admin','owner')
    or exists (select 1 from public.rooms r where r.id in (select public.my_room_ids()) and name = r.room_no || '.pdf')));
create policy st_con_ins on storage.objects for insert to authenticated
  with check (bucket_id = 'contracts' and public.app_role() = 'admin');
create policy st_con_upd on storage.objects for update to authenticated
  using (bucket_id = 'contracts' and public.app_role() = 'admin');
create policy st_con_del on storage.objects for delete to authenticated
  using (bucket_id = 'contracts' and public.app_role() = 'admin');

-- avatars: path = {auth_uid}.jpg (อ่านสาธารณะ เขียนได้เฉพาะของตัวเอง)
drop policy if exists st_av_ins on storage.objects;
drop policy if exists st_av_upd on storage.objects;
drop policy if exists st_av_del on storage.objects;
create policy st_av_ins on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and name like auth.uid()::text || '.%');
create policy st_av_upd on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and name like auth.uid()::text || '.%');
create policy st_av_del on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and name like auth.uid()::text || '.%');

-- attachments: path = {auth_uid}/{ticket_code}/{n}.jpg
drop policy if exists st_att_ins on storage.objects;
drop policy if exists st_att_sel on storage.objects;
create policy st_att_ins on storage.objects for insert to authenticated
  with check (bucket_id = 'attachments' and public.app_role() in ('owner','tenant')
    and (storage.foldername(name))[1] = auth.uid()::text);
create policy st_att_sel on storage.objects for select to authenticated
  using (bucket_id = 'attachments' and (public.app_role() = 'admin' or (storage.foldername(name))[1] = auth.uid()::text));

-- branding: path = line_qr.png (อ่านสาธารณะ ผู้ดูแลเขียน)
drop policy if exists st_br_ins on storage.objects;
drop policy if exists st_br_upd on storage.objects;
drop policy if exists st_br_del on storage.objects;
create policy st_br_ins on storage.objects for insert to authenticated
  with check (bucket_id = 'branding' and public.app_role() = 'admin');
create policy st_br_upd on storage.objects for update to authenticated
  using (bucket_id = 'branding' and public.app_role() = 'admin');
create policy st_br_del on storage.objects for delete to authenticated
  using (bucket_id = 'branding' and public.app_role() = 'admin');

-- ---------------------------------------------------------------------
-- 8) Realtime (ให้หน้าเว็บอัปเดตเรียลไทม์เมื่อมีบิล/สลิป/คำขอ/ข่าวใหม่)
-- ---------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['app_settings','rooms','users','tenants','contracts','meter_readings','invoices',
                           'invoice_items','payments','support_tickets','news','email_queue']
  loop
    begin
      execute format('alter publication supabase_realtime add table public.%I', t);
    exception when duplicate_object then null;
    end;
  end loop;
end $$;

-- ---------------------------------------------------------------------
-- 9) ข้อมูลเริ่มต้น: ค่าตั้งต้นระบบ + ห้องพัก 27 ห้อง (101-109, 201-209, 301-309)
-- ---------------------------------------------------------------------
insert into public.app_settings (rent_rate, electricity_rate, default_deposit, fine_per_day, max_fine, due_day, dorm_name)
select 3600, 8, 7600, 50, 250, 5, 'T&T Mansion'
where not exists (select 1 from public.app_settings);

insert into public.rooms (room_no)
select (f * 100 + n)::text from generate_series(1,3) f, generate_series(1,9) n
on conflict (room_no) do nothing;

-- ---------------------------------------------------------------------
-- (ทางเลือก) ตั้งเวลาให้เซิร์ฟเวอร์ส่งอีเมลที่ค้างในคิวทุก 5 นาที
-- เปิดใช้ extensions pg_cron และ pg_net ก่อน แล้วแก้ <PROJECT_REF> และ <SERVICE_ROLE_KEY> ก่อนรัน
-- (เก็บคีย์ใน Vault จะปลอดภัยกว่า) เว็บจะสั่งส่งอีเมลให้เองทุกครั้งที่ผู้ดูแลออกบิล/อนุมัติ จึงไม่บังคับ
-- ---------------------------------------------------------------------
-- select cron.schedule('send-email-sweep', '*/5 * * * *', $$
--   select net.http_post(
--     url := 'https://<PROJECT_REF>.supabase.co/functions/v1/send-email',
--     headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer <SERVICE_ROLE_KEY>'),
--     body := '{"sweep":true}'::jsonb);
-- $$);
