-- 17 พ.ย. 2569 — ใช้กับ Supabase TT-M แล้ว (migration: move_in_out_meter_and_contract_files)
-- เลขมิเตอร์ตอนย้ายเข้า/ออก + บิลสุดท้ายตอนย้ายออก + ไฟล์สัญญาต่อสัญญา
alter table public.contracts
  add column if not exists start_meter numeric check (start_meter is null or start_meter >= 0),
  add column if not exists end_meter numeric check (end_meter is null or end_meter >= 0),
  add column if not exists pdf_path text,
  add column if not exists pdf_name text,
  add column if not exists pdf_size integer;

alter table public.invoices
  add column if not exists kind text not null default 'monthly' check (kind in ('monthly','final')),
  add column if not exists meter_from numeric,
  add column if not exists meter_to numeric;
alter table public.invoices drop constraint if exists invoices_contract_id_billing_month_key;
create unique index if not exists invoices_contract_month_monthly_key
  on public.invoices(contract_id, billing_month) where kind = 'monthly';

-- เลขก่อนหน้า: ถ้าสัญญาปัจจุบันของห้องเริ่มหลังวันจดมิเตอร์ครั้งล่าสุด ใช้เลขตอนย้ายเข้า
create or replace function public.guard_meter_chain()
returns trigger language plpgsql security definer set search_path = public as $$
declare prev numeric; pm text; sm numeric; sd date;
begin
  if auth.uid() is null then return new; end if;
  select current_reading, billing_month into prev, pm from public.meter_readings
   where room_id = new.room_id and billing_month < new.billing_month
     and (tg_op = 'INSERT' or id <> new.id)
   order by billing_month desc limit 1;
  select c.start_meter, c.start_date into sm, sd from public.contracts c
   where c.room_id = new.room_id and c.start_meter is not null
     and c.start_date <= to_date(new.billing_month || '-27', 'YYYY-MM-DD')
   order by c.start_date desc limit 1;
  if sm is not null and (pm is null or sd >= to_date(pm || '-27', 'YYYY-MM-DD')) then
    prev := sm;
  end if;
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
revoke execute on function public.guard_meter_chain() from public, anon, authenticated;

-- ไฟล์สัญญา: ผู้เช่าเปิดได้เฉพาะไฟล์ของสัญญาตัวเอง (<contract_id>.pdf)
drop policy if exists st_con_sel on storage.objects;
create policy st_con_sel on storage.objects for select to authenticated using (
  bucket_id = 'contracts' and (
    public.app_role() = any (array['admin','owner'])
    or name in (select c::text || '.pdf' from public.my_contract_ids() c)
  )
);
