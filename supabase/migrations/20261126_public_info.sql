-- ข้อมูลสาธารณะสำหรับหน้าต้อนรับ (ไม่ต้องล็อกอิน): จำนวนห้องว่าง และข้อมูลติดต่อ/อัตราค่าบริการของหอ
-- ไม่มีข้อมูลผู้เช่า ไม่มีเลขห้องที่มีคนอยู่ มีแค่ตัวเลขรวม
create or replace function public.public_info()
returns jsonb
language sql
stable
security definer
set search_path to 'public'
as $$
  select jsonb_build_object(
    'total', (select count(*) from public.rooms where occupancy_status <> 'maint'),
    'free',  (select count(*) from public.rooms where occupancy_status = 'free'),
    'name',  s.dorm_name,
    'phone', s.phone,
    'line',  s.line_id,
    'rent',  s.rent_rate,
    'rate',  s.electricity_rate,
    'due',   s.due_day,
    'fpd',   s.fine_per_day,
    'max',   s.max_fine
  )
  from public.app_settings s
  limit 1;
$$;
revoke all on function public.public_info() from public;
grant execute on function public.public_info() to anon, authenticated;
