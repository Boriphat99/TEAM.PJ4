-- =====================================================================
-- 05) กรองอีเมล (เฉพาะ Gmail และ psru.ac.th) + ล็อกรอบบิลหลังวันที่ 10 ของเดือนถัดไป
-- รันใน Supabase SQL Editor 1 ครั้ง (รันซ้ำได้) · ทำงานฝั่งฐานข้อมูล จึงข้ามไม่ได้แม้เรียก API ตรง
-- =====================================================================

-- ---------- 1) กรองอีเมลตอนสมัคร / เปลี่ยนอีเมล ----------
-- อนุญาต: @gmail.com, @psru.ac.th และโดเมนย่อยของ psru.ac.th (เช่น @student.psru.ac.th)
create or replace function public.enforce_email_domain()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if lower(coalesce(new.email, '')) !~ '@(gmail\.com|([a-z0-9-]+\.)*psru\.ac\.th)$' then
    raise exception 'อนุญาตเฉพาะอีเมล @gmail.com และ @psru.ac.th เท่านั้น';
  end if;
  return new;
end $$;

drop trigger if exists trg_email_domain_ins on auth.users;
create trigger trg_email_domain_ins before insert on auth.users
  for each row execute function public.enforce_email_domain();

drop trigger if exists trg_email_domain_upd on auth.users;
create trigger trg_email_domain_upd before update of email on auth.users
  for each row when (new.email is distinct from old.email)
  execute function public.enforce_email_domain();

-- ---------- 2) ล็อกรอบบิล ----------
-- รอบ YYYY-MM ล็อกเมื่อถึงวันที่ 11 ของเดือนถัดไป 00:00 (เวลาไทย)
-- ล็อกแล้ว: ออกบิลย้อนหลังไม่ได้ · แก้เลขมิเตอร์ไม่ได้ · แก้ค่าเช่า/ค่าไฟ/ค่าอื่นในบิลไม่ได้ · ลบบิลไม่ได้
-- ยังทำได้: ดูบิล · ผู้เช่าชำระเงิน · แอดมินอนุมัติ/ปฏิเสธสลิป · ค่าปรับล่าช้า
-- (คำสั่งจาก SQL Editor / service role ที่ไม่มีผู้ใช้ล็อกอิน จะไม่ถูกบล็อก ไว้แก้ไขกรณีฉุกเฉิน)
create or replace function public.period_locked(p text)
returns boolean language sql stable as $$
  select p is not null
     and (now() at time zone 'Asia/Bangkok') >= (to_date(p || '-01', 'YYYY-MM-DD') + interval '1 month' + interval '10 days');
$$;

create or replace function public.guard_meter_lock()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then return coalesce(new, old); end if;
  if tg_op = 'INSERT' then
    if public.period_locked(new.billing_month) then
      raise exception 'รอบบิล % ปิดแล้ว (เกินวันที่ 10 ของเดือนถัดไป) ไม่สามารถบันทึกเลขมิเตอร์ย้อนหลังได้', new.billing_month;
    end if;
    return new;
  elsif tg_op = 'UPDATE' then
    if (new.current_reading  is distinct from old.current_reading
     or new.previous_reading is distinct from old.previous_reading
     or new.billing_month    is distinct from old.billing_month)
     and (public.period_locked(old.billing_month) or public.period_locked(new.billing_month)) then
      raise exception 'รอบบิล % ปิดแล้ว ไม่สามารถแก้ไขเลขมิเตอร์ได้', old.billing_month;
    end if;
    return new;
  else
    if public.period_locked(old.billing_month) then
      raise exception 'รอบบิล % ปิดแล้ว ไม่สามารถลบเลขมิเตอร์ได้', old.billing_month;
    end if;
    return old;
  end if;
end $$;

drop trigger if exists trg_meter_lock on public.meter_readings;
create trigger trg_meter_lock before insert or update or delete on public.meter_readings
  for each row execute function public.guard_meter_lock();

create or replace function public.guard_invoice_lock()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then return coalesce(new, old); end if;
  if tg_op = 'INSERT' then
    if public.period_locked(new.billing_month) then
      raise exception 'รอบบิล % ปิดแล้ว (เกินวันที่ 10 ของเดือนถัดไป) ไม่สามารถออกบิลย้อนหลังได้', new.billing_month;
    end if;
    return new;
  else
    if public.period_locked(old.billing_month) then
      raise exception 'รอบบิล % ปิดแล้ว ไม่สามารถลบใบแจ้งหนี้ได้', old.billing_month;
    end if;
    return old;
  end if;
end $$;

drop trigger if exists trg_invoice_lock on public.invoices;
create trigger trg_invoice_lock before insert or delete on public.invoices
  for each row execute function public.guard_invoice_lock();

create or replace function public.guard_item_lock()
returns trigger language plpgsql security definer set search_path = public as $$
declare bm text; t text;
begin
  if auth.uid() is null then return coalesce(new, old); end if;
  t := coalesce(new.item_type, old.item_type);
  if t = 'fine' then return coalesce(new, old); end if;           -- ค่าปรับล่าช้า คิดตอนชำระ ต้องทำได้เสมอ
  if tg_op = 'UPDATE'
     and new.amount      is not distinct from old.amount
     and new.description is not distinct from old.description
     and new.item_type   is not distinct from old.item_type then
    return new;                                                     -- ไม่มีการเปลี่ยนค่าจริง
  end if;
  select billing_month into bm from public.invoices where id = coalesce(new.invoice_id, old.invoice_id);
  if public.period_locked(bm) then
    raise exception 'รอบบิล % ปิดแล้ว ไม่สามารถเพิ่ม/แก้ไข/ลบรายการในใบแจ้งหนี้ได้', bm;
  end if;
  return coalesce(new, old);
end $$;

drop trigger if exists trg_item_lock on public.invoice_items;
create trigger trg_item_lock before insert or update or delete on public.invoice_items
  for each row execute function public.guard_item_lock();

-- ตรวจสอบ:
-- select period_locked('2026-08'), period_locked(to_char(now() at time zone 'Asia/Bangkok','YYYY-MM'));
-- select tgname from pg_trigger where not tgisinternal and tgname in ('trg_meter_lock','trg_invoice_lock','trg_item_lock');
-- select tgname from pg_trigger where tgrelid = 'auth.users'::regclass and tgname like 'trg_email_domain%';
