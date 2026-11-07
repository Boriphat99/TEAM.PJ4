-- =====================================================================
-- 07) กฎการแก้ไข: ผู้เช่าส่งสลิปใหม่ได้ก่อนผู้ดูแลยืนยัน · ผู้ดูแลแก้บิลได้เมื่อยังไม่ชำระ · เลขมิเตอร์ก่อนหน้าถูกล็อก
-- รันใน Supabase SQL Editor 1 ครั้ง (รันซ้ำได้) · ต้องรัน 01 และ 05_period_lock.sql มาก่อน
-- =====================================================================

-- ---------- 1) ผู้เช่าส่งสลิปใหม่ได้ ตราบที่ผู้ดูแลยังไม่ยืนยัน ----------
-- บิลสถานะ pending (ส่งสลิปแล้ว รอตรวจสอบ) -> แทนที่สลิปเดิมได้ และค่าปรับคงตามวันที่แจ้งชำระครั้งแรก
-- เมื่อผู้ดูแลอนุมัติ (paid) แล้วเรียกฟังก์ชันนี้ไม่ได้อีก · ถ้าผู้ดูแลปฏิเสธ บิลกลับเป็น unpaid แล้วส่งใหม่ได้ตามเดิม
create or replace function public.submit_payment(p_invoice uuid, p_slip text)
returns void language plpgsql security definer set search_path = public as
$$
declare inv public.invoices; s public.app_settings; d int; fn numeric := 0; base numeric;
begin
  if public.app_role() is distinct from 'tenant' then raise exception 'not allowed'; end if;
  select * into inv from public.invoices where id = p_invoice and id in (select public.my_invoice_ids());
  if not found then raise exception 'invoice not found'; end if;

  if inv.status = 'pending' then
    update public.payments set slip_url = p_slip, submitted_at = now()
     where invoice_id = inv.id and verify_status = 'pending' and payment_method = 'qr';
    if not found then raise exception 'payment cannot be edited'; end if;
    return;
  end if;

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

-- ---------- 2) เลขมิเตอร์ก่อนหน้าถูกล็อก ----------
-- เลขก่อนหน้าของรอบใหม่ = เลขล่าสุดของรอบก่อนหน้าเสมอ (ฐานข้อมูลตั้งให้เอง พิมพ์เองไม่ได้)
-- แก้เลขล่าสุดของรอบหนึ่งไม่ได้ ถ้าห้องนั้นมีรอบถัดไปแล้ว หรือบิลของรอบนั้นรอตรวจสอบ/ชำระแล้ว
-- (คำสั่งจาก SQL Editor / service role ที่ไม่มีผู้ใช้ล็อกอิน จะไม่ถูกบล็อก ไว้แก้ไขกรณีฉุกเฉิน)
create or replace function public.guard_meter_chain()
returns trigger language plpgsql security definer set search_path = public as $$
declare prev numeric;
begin
  if auth.uid() is null then return new; end if;
  select current_reading into prev from public.meter_readings
   where room_id = new.room_id and billing_month < new.billing_month
     and (tg_op = 'INSERT' or id <> new.id)
   order by billing_month desc limit 1;
  if prev is not null then new.previous_reading := prev; end if;
  if tg_op = 'UPDATE' and new.current_reading is distinct from old.current_reading then
    if exists (select 1 from public.meter_readings
                where room_id = new.room_id and billing_month > new.billing_month) then
      raise exception 'แก้เลขมิเตอร์ไม่ได้ เพราะห้องนี้ออกบิลรอบถัดไปแล้ว (ใช้เลขนี้เป็นเลขก่อนหน้า)';
    end if;
    if exists (select 1 from public.invoice_items it join public.invoices i on i.id = it.invoice_id
                where it.meter_reading_id = old.id and i.status in ('pending','paid')) then
      raise exception 'บิลนี้รอตรวจสอบหรือชำระแล้ว แก้เลขมิเตอร์ไม่ได้';
    end if;
  end if;
  return new;
end $$;

drop trigger if exists trg_meter_chain on public.meter_readings;
create trigger trg_meter_chain before insert or update on public.meter_readings
  for each row execute function public.guard_meter_chain();

-- ---------- 3) รายการในบิลแก้ไม่ได้เมื่อบิลรอตรวจสอบ/ชำระแล้ว ----------
-- (เพิ่มจากกฎล็อกรอบบิลเดิมใน 05: ค่าปรับล่าช้ายังคิดตอนผู้เช่าแจ้งชำระได้เสมอ)
create or replace function public.guard_item_lock()
returns trigger language plpgsql security definer set search_path = public as $$
declare bm text; st text; t text;
begin
  if auth.uid() is null then return coalesce(new, old); end if;
  t := coalesce(new.item_type, old.item_type);
  if t = 'fine' then return coalesce(new, old); end if;
  if tg_op = 'UPDATE'
     and new.amount      is not distinct from old.amount
     and new.description is not distinct from old.description
     and new.item_type   is not distinct from old.item_type then
    return new;
  end if;
  select billing_month, status into bm, st from public.invoices where id = coalesce(new.invoice_id, old.invoice_id);
  if public.period_locked(bm) then
    raise exception 'รอบบิล % ปิดแล้ว ไม่สามารถเพิ่ม/แก้ไข/ลบรายการในใบแจ้งหนี้ได้', bm;
  end if;
  if tg_op <> 'INSERT' and st in ('pending','paid') then
    raise exception 'บิลนี้รอตรวจสอบหรือชำระแล้ว ไม่สามารถแก้ไขรายการได้';
  end if;
  return coalesce(new, old);
end $$;

-- ตรวจสอบ:
-- select tgname from pg_trigger where not tgisinternal and tgname in ('trg_meter_chain','trg_item_lock','trg_meter_lock');
