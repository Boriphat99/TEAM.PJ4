-- =====================================================================
-- กำหนดอีเมลผู้ดูแลระบบ และเจ้าของกิจการ
-- 1) แก้อีเมลด้านล่างเป็นอีเมลจริง  2) รันใน SQL Editor
-- 3) ให้แต่ละคนไป "สมัครสมาชิก" ที่หน้าเว็บด้วยอีเมลนั้น ระบบจะกำหนดบทบาทให้อัตโนมัติ
--    (ถ้าสมัครไปก่อนแล้ว บทบาทจะถูกเปลี่ยนทันทีเมื่อรันไฟล์นี้)
-- อีเมลอื่นทุกอีเมลที่สมัครผ่านหน้าลงทะเบียน = ผู้เช่า
-- แนะนำ: เปิด "Confirm email" ใน Authentication > Providers > Email เพื่อกันคนอื่นสมัครแทนอีเมลของผู้ดูแล/เจ้าของ
-- =====================================================================
insert into public.staff_emails (email, role) values
  (lower('boriphat.k@psru.ac.th'), 'admin'),    -- ผู้ดูแลระบบ
  (lower('boriphatkamsang@gmail.com'), 'owner')     -- เจ้าของกิจการ
on conflict (email) do update set role = excluded.role;

-- ตรวจสอบ
-- select * from public.staff_emails;
-- select email, role, full_name from public.users order by created_at;
