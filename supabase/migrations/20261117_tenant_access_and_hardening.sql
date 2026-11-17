-- 17 พ.ย. 2569 — ใช้กับ Supabase TT-M แล้ว (2 migration: tenant_access_active_room_only, harden_functions_policies_indexes)

-- ===== 1) ผู้เช่าเห็นห้อง/สัญญา PDF/เลขมิเตอร์ เฉพาะห้องที่มีสัญญาอยู่ตอนนี้ =====
-- เดิม my_room_ids() นับสัญญาที่สิ้นสุดแล้วด้วย ผู้เช่าที่ย้ายออกจึงยังเปิดสัญญา PDF และเลขมิเตอร์ของห้องเดิมได้
create or replace function public.my_room_ids()
returns setof uuid language sql stable security definer set search_path = public as $$
  select room_id from public.contracts
   where tenant_id = public.my_tenant_id() and status = 'active'
$$;

-- เลขมิเตอร์ที่ผูกกับบิลของตัวเอง (ให้ประวัติบิลห้องเก่ายังแสดงเลขมิเตอร์ได้)
create or replace function public.my_meter_ids()
returns setof uuid language sql stable security definer set search_path = public as $$
  select it.meter_reading_id from public.invoice_items it
   where it.meter_reading_id is not null
     and it.invoice_id in (select public.my_invoice_ids())
$$;
revoke execute on function public.my_meter_ids() from public, anon;
grant execute on function public.my_meter_ids() to authenticated;

drop policy if exists p_mr_sel on public.meter_readings;
create policy p_mr_sel on public.meter_readings for select to authenticated using (
  public.app_role() = any (array['admin','owner'])
  or room_id in (select public.my_room_ids())
  or id in (select public.my_meter_ids())
);

-- ===== 2) ข้อเตือนจาก Supabase advisor =====
alter function public.users_guard() set search_path = public;
alter function public.touch_updated_at() set search_path = public;
alter function public.period_locked(text) set search_path = public;

-- ฟังก์ชันภายใน (trigger / ตัวออกเลขใบเสร็จ) ไม่ต้องเรียกผ่าน API
revoke execute on function public.guard_invoice_lock() from public, anon, authenticated;
revoke execute on function public.guard_item_lock()    from public, anon, authenticated;
revoke execute on function public.guard_meter_chain()  from public, anon, authenticated;
revoke execute on function public.guard_meter_lock()   from public, anon, authenticated;
revoke execute on function public.next_receipt_no()    from public, anon, authenticated;
revoke execute on function public.period_locked(text)  from public, anon;
grant  execute on function public.period_locked(text)  to authenticated;

-- RLS: ประเมิน auth.uid() ครั้งเดียวต่อคำสั่ง
alter policy p_users_sel on public.users using ((id = (select auth.uid())) or (app_role() = any (array['admin','owner'])));
alter policy p_users_upd on public.users using ((id = (select auth.uid())) or (app_role() = 'admin')) with check ((id = (select auth.uid())) or (app_role() = 'admin'));
alter policy p_ten_sel on public.tenants using ((app_role() = any (array['admin','owner'])) or (user_id = (select auth.uid())));
alter policy p_ten_upd on public.tenants using ((app_role() = 'admin') or (user_id = (select auth.uid()))) with check ((app_role() = 'admin') or (user_id = (select auth.uid())));
alter policy p_tk_ins on public.support_tickets with check ((author_id = (select auth.uid())) and (app_role() = any (array['owner','tenant'])) and (status = 'open'));
alter policy p_tk_sel on public.support_tickets using ((app_role() = 'admin') or (author_id = (select auth.uid())));
alter policy p_log_ins on public.audit_logs with check (actor_id = (select auth.uid()));

-- ดัชนีให้ foreign key
create index if not exists audit_logs_actor_idx on public.audit_logs(actor_id);
create index if not exists invoice_items_meter_idx on public.invoice_items(meter_reading_id);
create index if not exists payments_verified_by_idx on public.payments(verified_by);
