-- =====================================================================
-- 06) ข้อมูลสรุปสำหรับแดชบอร์ดตัวอย่างในหน้าต้อนรับ (ก่อนเข้าสู่ระบบ)
-- รันใน Supabase SQL Editor 1 ครั้ง (รันซ้ำได้)
--
-- คืนค่าเป็น JSON: ค่าตั้งต้น (ค่าเช่า/ค่าไฟ/วันครบกำหนด), สถานะห้อง, และใบแจ้งหนี้ย้อนหลัง 6 เดือน
-- ไม่มีชื่อ อีเมล เบอร์โทร สลิป หรือข้อมูลบัญชีผู้ใช้ มีเพียงเลขห้อง สถานะ และยอดเงินของบิล
-- หน้าเว็บเรียกครั้งแรกตอนเปิดหน้า แล้วโหลดใหม่ทุก 1 ชั่วโมง
-- หากไม่ต้องการเปิดเผยยอดเงินต่อสาธารณะ ให้ลบไฟล์นี้ออก/ไม่รัน (หน้าเว็บจะกลับไปแสดงข้อมูลตัวอย่างเดิม)
-- =====================================================================
create or replace function public.public_stats()
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'at', now(),
    'set', (select jsonb_build_object(
              'rent', rent_rate, 'rate', electricity_rate, 'dep', default_deposit,
              'fpd', fine_per_day, 'max', max_fine, 'due', due_day, 'name', dorm_name)
            from public.app_settings limit 1),
    'rooms', coalesce((
      select jsonb_agg(jsonb_build_object(
               'n', r.room_no,
               'st', case when exists (select 1 from public.contracts c where c.room_id = r.id and c.status = 'active')
                          then 'occ' else r.occupancy_status end)
             order by r.room_no)
      from public.rooms r), '[]'::jsonb),
    'inv', coalesce((
      select jsonb_agg(x order by x.per desc, x.room)
      from (
        select i.code, i.billing_month as per, r.room_no as room, i.status as s,
               i.created_at as iss, pm.paid_at as paid,
               coalesce(sum(it.amount) filter (where it.item_type = 'rent'), 0)        as rent,
               coalesce(sum(it.amount) filter (where it.item_type = 'electricity'), 0) as el,
               coalesce(sum(it.amount) filter (where it.item_type = 'other'), 0)       as x,
               coalesce(sum(it.amount) filter (where it.item_type = 'fine'), 0)        as fine
        from public.invoices i
        join public.contracts c on c.id = i.contract_id
        join public.rooms r on r.id = c.room_id
        left join public.invoice_items it on it.invoice_id = i.id
        left join lateral (
          select p.paid_at from public.payments p
          where p.invoice_id = i.id and p.verify_status = 'approved'
          order by p.paid_at desc limit 1) pm on true
        where i.billing_month >= to_char((now() at time zone 'Asia/Bangkok') - interval '5 months', 'YYYY-MM')
        group by i.id, r.room_no, pm.paid_at
      ) x), '[]'::jsonb)
  );
$$;

revoke all on function public.public_stats() from public;
grant execute on function public.public_stats() to anon, authenticated;

-- ทดสอบ: select public.public_stats();
