-- ตรวจสอบใบเสร็จจาก QR (เปิดได้โดยไม่ต้องเข้าสู่ระบบ)
-- ต้องมีทั้งเลขใบเสร็จและรหัสตรวจสอบ (12 ตัวแรกของ payments.id ที่สุ่มไว้) จึงเดาเลขใบเสร็จไล่ดูไม่ได้
-- ตอบเฉพาะใบเสร็จที่อนุมัติแล้ว และไม่ส่งชื่อ เบอร์โทร หรือข้อมูลส่วนตัวของผู้เช่า
create or replace function public.verify_receipt(p_no text, p_code text)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce((
    select jsonb_build_object(
      'ok', true,
      'receipt_no', p.receipt_no,
      'invoice_code', i.code,
      'billing_month', i.billing_month,
      'kind', i.kind,
      'room_no', r.room_no,
      'amount', p.amount_paid,
      'method', p.payment_method,
      'paid_at', coalesce(p.paid_at, p.verified_at),
      'dorm_name', (select dorm_name from public.app_settings limit 1))
      from public.payments p
      join public.invoices i on i.id = p.invoice_id
      join public.contracts c on c.id = i.contract_id
      join public.rooms r on r.id = c.room_id
     where p.receipt_no = p_no
       and p.verify_status = 'approved'
       and length(coalesce(p_code, '')) = 12
       and left(replace(p.id::text, '-', ''), 12) = lower(p_code)
     limit 1), jsonb_build_object('ok', false));
$$;
revoke all on function public.verify_receipt(text, text) from public;
grant execute on function public.verify_receipt(text, text) to anon, authenticated;
