-- สถานะห้องในฐานข้อมูลตรงกับผู้เช่าจริง
-- มีสัญญาที่มีผล (active) = busy · สัญญาสิ้นสุดและไม่เหลือสัญญาที่มีผล = free
-- ห้องปิดปรับปรุง (maint) ไม่แตะ · ห้อง "ไม่ว่าง" ที่แอดมินตั้งเองไม่มีสัญญา จึงไม่ถูกเปลี่ยน
create or replace function public.sync_room_occupancy()
returns trigger language plpgsql security definer set search_path = public as $$
declare rid uuid;
begin
  foreach rid in array array_remove(array[
      case when tg_op <> 'DELETE' then new.room_id end,
      case when tg_op <> 'INSERT' then old.room_id end], null)
  loop
    update public.rooms r
       set occupancy_status = case
             when exists (select 1 from public.contracts c where c.room_id = r.id and c.status = 'active') then 'busy'
             else 'free' end
     where r.id = rid and r.occupancy_status in ('free', 'busy')
       and r.occupancy_status is distinct from case
             when exists (select 1 from public.contracts c where c.room_id = r.id and c.status = 'active') then 'busy'
             else 'free' end;
  end loop;
  return null;
end $$;
revoke execute on function public.sync_room_occupancy() from public, anon, authenticated;

drop trigger if exists trg_room_occupancy on public.contracts;
create trigger trg_room_occupancy after insert or delete or update of status, room_id on public.contracts
  for each row execute function public.sync_room_occupancy();

-- ปรับข้อมูลที่มีอยู่ให้ตรง
update public.rooms r set occupancy_status = 'busy'
 where r.occupancy_status = 'free'
   and exists (select 1 from public.contracts c where c.room_id = r.id and c.status = 'active');
