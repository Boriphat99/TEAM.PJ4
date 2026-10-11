-- =====================================================================
-- ตรวจหลังติดตั้ง: รันใน SQL Editor แล้วเทียบผลกับคอมเมนต์ท้ายแต่ละบรรทัด
-- =====================================================================
select count(*) as tables_in_public from information_schema.tables where table_schema = 'public';            -- 14
select count(*) as rooms from public.rooms;                                                                  -- 27 (101-109, 201-209, 301-309)
select count(*) as tables_without_rls from pg_tables where schemaname = 'public' and not rowsecurity;         -- 0
select id, public from storage.buckets order by id;   -- attachments/contracts/slips = false, avatars/branding = true (รวม 5 ที่)
select tablename from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' order by 1;  -- 12 ตาราง
select proname from pg_proc where pronamespace = 'public'::regnamespace
   and proname in ('submit_payment','get_contacts','app_role','handle_new_user') order by 1;                  -- 4 ฟังก์ชัน
select tgname from pg_trigger where not tgisinternal and tgrelid::regclass::text like 'public.%' order by 1;  -- trg_* ครบ (ดูรายการทริกเกอร์ในไฟล์ 01)
select email, role from public.staff_emails;                                                                  -- อีเมลผู้ดูแล/เจ้าของที่ตั้งไว้ใน 02
select email, role, full_name from public.users order by created_at;                                          -- ผู้ที่สมัครแล้ว (ผู้ดูแล/เจ้าของ/ผู้เช่า)
select kind, status, error, count(*) from public.email_queue group by 1, 2, 3;                                -- สถานะอีเมลในคิว: sent = ส่งแล้ว, wait = ยังไม่ตั้ง RESEND_API_KEY
