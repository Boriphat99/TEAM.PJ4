-- =====================================================================
-- 08) เลขใบเสร็จออกโดยฐานข้อมูล (ไม่ซ้ำ) + เก็บเหตุผลที่ปฏิเสธสลิป
-- รันใน Supabase SQL Editor 1 ครั้ง (รันซ้ำได้) · ต้องรัน 01 มาก่อน
-- =====================================================================

-- ---------- 1) เหตุผลที่ปฏิเสธสลิป (ผู้เช่าเห็นในหน้าใบแจ้งหนี้) ----------
alter table public.payments add column if not exists reject_reason text;

-- ---------- 2) เลขใบเสร็จ: RC + ปีเดือน(เวลาไทย) + ลำดับ 4 หลักของเดือนนั้น เช่น RC202610-0007 ----------
-- ล็อกทั้งระบบตอนออกเลข (pg_advisory_xact_lock) จึงไม่ซ้ำแม้อนุมัติพร้อมกัน · เลขเดิมที่เคยออกแล้วคงเดิม
create or replace function public.next_receipt_no() returns text
language plpgsql security definer set search_path = public as
$$
declare pfx text := 'RC' || to_char(now() at time zone 'Asia/Bangkok', 'YYYYMM'); n int;
begin
  perform pg_advisory_xact_lock(hashtext('ttm_receipt_no'));
  select coalesce(max(substring(receipt_no from ('^' || pfx || '-([0-9]+)$'))::int), 0) + 1
    into n from public.payments where receipt_no like pfx || '-%';
  return pfx || '-' || lpad(n::text, 4, '0');
end $$;

-- ทริกเกอร์เดิม (ประทับผู้ตรวจสอบ/วันที่) + กฎเลขใบเสร็จ:
--  · อนุมัติครั้งแรก -> ฐานข้อมูลออกเลขให้เอง (ไม่รับเลขที่หน้าเว็บส่งมา)
--  · มีเลขแล้ว -> เปลี่ยนไม่ได้ · ยังไม่อนุมัติ -> ไม่มีเลข
create or replace function public.payments_stamp() returns trigger
language plpgsql security definer set search_path = public as
$$
declare keep text;
begin
  if tg_op = 'UPDATE' then keep := old.receipt_no; end if;
  if keep is not null then
    new.receipt_no := keep;
  elsif new.verify_status = 'approved' then
    new.receipt_no := public.next_receipt_no();
  else
    new.receipt_no := null;
  end if;

  if new.verify_status in ('approved','rejected')
     and (tg_op = 'INSERT' or old.verify_status is distinct from new.verify_status) then
    if auth.uid() is not null then new.verified_by := auth.uid(); end if;
    new.verified_at := coalesce(new.verified_at, now());
    if new.verify_status = 'approved' then new.paid_at := coalesce(new.paid_at, now()); end if;
  end if;
  return new;
end $$;

drop trigger if exists trg_payments_stamp on public.payments;
create trigger trg_payments_stamp before insert or update on public.payments
  for each row execute function public.payments_stamp();

-- ตรวจสอบ:
-- select receipt_no, verify_status, reject_reason from public.payments order by submitted_at desc limit 10;
