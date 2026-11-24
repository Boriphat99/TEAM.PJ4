-- รูปสลิปต้องเป็นไฟล์ที่อัปโหลดเข้าที่เก็บสลิปของบิลนั้นเท่านั้น (<invoice id>/<เวลา>.jpg)
-- กันการส่งลิงก์รูปจากเว็บอื่นเข้ามาแทนสลิป เมื่อเรียกฟังก์ชันตรง ๆ โดยไม่ผ่านหน้าเว็บ
create or replace function public.submit_payment(p_invoice uuid, p_slip text, p_ref text default null, p_bank text default null)
returns void language plpgsql security definer set search_path to 'public' as $function$
declare inv public.invoices; s public.app_settings; d int; fn numeric := 0; base numeric; ref text; bank text;
begin
  if public.app_role() is distinct from 'tenant' then raise exception 'not allowed'; end if;
  select * into inv from public.invoices where id = p_invoice and id in (select public.my_invoice_ids());
  if not found then raise exception 'invoice not found'; end if;
  if coalesce(p_slip, '') !~ ('^' || inv.id::text || '/[0-9]{10,16}\.jpg$') then
    raise exception 'รูปสลิปไม่ถูกต้อง กรุณาแนบสลิปใหม่';
  end if;
  ref := nullif(left(regexp_replace(coalesce(p_ref, ''), '[^A-Za-z0-9]', '', 'g'), 40), '');
  bank := nullif(left(regexp_replace(coalesce(p_bank, ''), '[^0-9]', '', 'g'), 3), '');
  if ref is not null and exists (
    select 1 from public.payments where slip_ref = ref and verify_status in ('pending', 'approved')
      and not (invoice_id = inv.id and verify_status = 'pending')) then
    raise exception 'สลิปนี้ถูกใช้ซ้ำ ใช้แจ้งชำระไม่ได้ กรุณาแนบสลิปของรายการโอนครั้งนี้';
  end if;
  if inv.status = 'pending' then
    update public.payments set slip_url = p_slip, submitted_at = now(), slip_ref = ref, slip_bank = bank
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
    insert into public.invoice_items(invoice_id, item_type, description, amount) values (inv.id, 'fine', 'ค่าปรับล่าช้า', fn)
      on conflict (invoice_id, item_type) do update set amount = excluded.amount;
  end if;
  insert into public.payments(invoice_id, payment_method, slip_url, amount_paid, verify_status, submitted_at, slip_ref, slip_bank)
    values (inv.id, 'qr', p_slip, base + fn, 'pending', now(), ref, bank);
  update public.invoices set status = 'pending', total_amount = base + fn where id = inv.id;
end $function$;
revoke all on function public.submit_payment(uuid, text, text, text) from public, anon;
grant execute on function public.submit_payment(uuid, text, text, text) to authenticated;

-- สิทธิ์ที่ไม่ได้ใช้: บัญชีสาธารณะไม่ต้อง TRUNCATE/TRIGGER/REFERENCES ตาราง LINE
revoke truncate, trigger, references on public.line_link_codes, public.line_link_fails, public.line_links, public.notify_log from anon, authenticated;
revoke select on public.line_links, public.notify_log from anon;
