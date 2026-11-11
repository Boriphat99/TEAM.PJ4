// Supabase Edge Function: create-tenant
// ผู้ดูแลระบบสร้างบัญชีผู้เช่า (อีเมล + รหัสผ่านเริ่มต้น) พร้อมเปิดสัญญาเช่าให้ห้องที่เลือก ในขั้นตอนเดียว
//
// ความปลอดภัย:
//  - ต้องเรียกด้วย JWT ของผู้ใช้ที่ล็อกอินอยู่ และผู้ใช้นั้นต้องมี role = 'admin' ใน public.users
//  - ใช้ SUPABASE_SERVICE_ROLE_KEY (มีให้อัตโนมัติใน Edge Function) เฉพาะฝั่งเซิร์ฟเวอร์ ไม่ส่งไปหน้าเว็บ
//  - ถ้าเปิดสัญญาไม่สำเร็จ จะลบบัญชีที่เพิ่งสร้างทิ้ง (ไม่ให้เหลือข้อมูลครึ่งๆ กลางๆ)
//  - ติดธง user_metadata.must_change_pw = true เพื่อให้หน้าเว็บแจ้งเตือนผู้เช่าให้เปลี่ยนรหัสผ่าน
//
// body: { email, password, full_name, phone?, room_no, start_date (YYYY-MM-DD), end_date? }
// ตอบกลับ: { user_id, tenant_id, contract_id }
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), {
    status: s,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
const bad = (msg: string, s = 400) => json({ error: msg }, s);
const isDate = (v: unknown) =>
  typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && !isNaN(Date.parse(v));

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return bad('method not allowed', 405);

  const url = Deno.env.get('SUPABASE_URL')!;
  const admin = createClient(url, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false },
  });

  // 1) ตรวจว่าผู้เรียกเป็นผู้ดูแลระบบจริง
  const token = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
  if (!token) return bad('กรุณาเข้าสู่ระบบ', 401);
  const { data: caller, error: ce } = await admin.auth.getUser(token);
  if (ce || !caller?.user) return bad('กรุณาเข้าสู่ระบบใหม่', 401);
  const { data: me } = await admin
    .from('users')
    .select('role, full_name')
    .eq('id', caller.user.id)
    .maybeSingle();
  if (me?.role !== 'admin') return bad('เฉพาะผู้ดูแลระบบเท่านั้นที่เพิ่มผู้เช่าได้', 403);

  // 2) ตรวจข้อมูล
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return bad('ข้อมูลไม่ถูกต้อง');
  }
  const email = String(b.email || '')
    .trim()
    .toLowerCase();
  const password = String(b.password || '');
  const full_name = String(b.full_name || '').trim();
  const phone = String(b.phone || '').trim() || null;
  const room_no = String(b.room_no || '').trim();
  const start_date = b.start_date;
  const end_date = b.end_date || null;
  if (!full_name) return bad('กรุณากรอกชื่อ - นามสกุล');
  if (!/^\S+@\S+\.\S+$/.test(email)) return bad('รูปแบบอีเมลไม่ถูกต้อง');
  if (password.length < 6) return bad('รหัสผ่านต้องมีอย่างน้อย 6 ตัว');
  if (phone && !/^[0-9\-+ ]{9,15}$/.test(phone)) return bad('เบอร์โทรไม่ถูกต้อง');
  if (!room_no) return bad('กรุณาเลือกห้อง');
  if (!isDate(start_date)) return bad('กรุณาระบุวันเริ่มสัญญา');
  if (end_date && (!isDate(end_date) || String(end_date) < String(start_date)))
    return bad('วันสิ้นสุดสัญญาต้องไม่ก่อนวันเริ่มสัญญา');

  const { data: staff } = await admin
    .from('staff_emails')
    .select('email')
    .eq('email', email)
    .maybeSingle();
  if (staff) return bad('อีเมลนี้เป็นอีเมลของผู้ดูแล/เจ้าของ ใช้เป็นบัญชีผู้เช่าไม่ได้');

  // 3) ห้องต้องมีอยู่และว่าง
  const { data: room } = await admin
    .from('rooms')
    .select('id, room_no, occupancy_status')
    .eq('room_no', room_no)
    .maybeSingle();
  if (!room) return bad('ไม่พบห้อง ' + room_no);
  if (room.occupancy_status === 'maint') return bad('ห้อง ' + room_no + ' ปิดปรับปรุงอยู่');
  const { count: busy } = await admin
    .from('contracts')
    .select('id', { count: 'exact', head: true })
    .eq('room_id', room.id)
    .eq('status', 'active');
  if (busy) return bad('ห้อง ' + room_no + ' มีผู้เช่าอยู่แล้ว');

  // 4) สร้างบัญชี (trigger handle_new_user จะสร้างแถว public.users + public.tenants ให้)
  const { data: cu, error: ue } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, phone, must_change_pw: true },
  });
  if (ue || !cu?.user) {
    const m = String(ue?.message || '');
    if (/already|registered|exists/i.test(m)) return bad('อีเมลนี้มีบัญชีอยู่แล้ว');
    return bad('สร้างบัญชีไม่สำเร็จ: ' + m, 500);
  }
  const uid = cu.user.id;
  const rollback = async (msg: string) => {
    await admin.auth.admin.deleteUser(uid).catch(() => {});
    return bad(msg, 500);
  };

  const { data: ten } = await admin.from('tenants').select('id').eq('user_id', uid).maybeSingle();
  if (!ten) return rollback('สร้างข้อมูลผู้เช่าไม่สำเร็จ');

  // 5) เปิดสัญญาเช่า (เงินแรกเข้าตามค่าที่ตั้งไว้ในระบบ)
  const { data: S } = await admin
    .from('app_settings')
    .select('default_deposit')
    .limit(1)
    .maybeSingle();
  const { data: con, error: ke } = await admin
    .from('contracts')
    .insert({
      tenant_id: ten.id,
      room_id: room.id,
      start_date,
      end_date,
      deposit_amount: S?.default_deposit ?? 7600,
      status: 'active',
    })
    .select('id')
    .single();
  if (ke || !con) return rollback('เปิดสัญญาเช่าไม่สำเร็จ: ' + (ke?.message || ''));

  await admin.from('audit_logs').insert({
    actor_id: caller.user.id,
    actor_name: me?.full_name ?? null,
    action: `เพิ่มผู้เช่า ${full_name} ห้อง ${room_no} (สัญญาเริ่ม ${start_date})`,
  });
  return json({ user_id: uid, tenant_id: ten.id, contract_id: con.id });
});
