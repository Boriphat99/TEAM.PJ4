-- รันไฟล์นี้ใน Supabase SQL Editor 1 ครั้ง (รันซ้ำได้) แก้ปัญหาอัปโหลด/ลบรูปใน bucket branding และ avatars

-- ผู้ใช้ที่ล็อกอินอ่านไฟล์ใน bucket สาธารณะได้ (จำเป็นต่อการลบ/เขียนทับไฟล์ผ่าน Storage API: upsert และ remove ต้องมีสิทธิ์ SELECT)
drop policy if exists st_br_sel on storage.objects;
drop policy if exists st_av_sel on storage.objects;
create policy st_br_sel on storage.objects for select to authenticated using (bucket_id = 'branding');
create policy st_av_sel on storage.objects for select to authenticated using (bucket_id = 'avatars');
