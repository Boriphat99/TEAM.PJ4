// Supabase Edge Function: line-notify
// ส่งข้อความแจ้งเตือนเรื่องบิลผ่าน LINE (Push API)
//
// ผู้เรียก: ฐานข้อมูลเท่านั้น (notify_line() → pg_net) พร้อม header x-notify-secret
//   ตรวจ secret ด้วย RPC notify_secret_ok() (secret อยู่ใน Vault ไม่ออกจากฐานข้อมูล)
// body: { kind, invoice_id?, payment_id? }
//   kind: bill | due_soon | overdue | last_day | manual | receipt | reject | slip
// ผู้รับ: slip → ผู้ดูแลระบบทุกคนที่เชื่อม LINE · อื่น ๆ → ผู้เช่าเจ้าของบิล (ถ้าเชื่อม LINE)
// กันส่งซ้ำ: เหตุการณ์อัตโนมัติส่งครั้งเดียวต่อ (บิลหรือการชำระ, ชนิด, ผู้รับ) · manual ส่งซ้ำได้
// ทุกการส่งบันทึกใน notify_log · ยังไม่ได้ใส่ LINE_CHANNEL_ACCESS_TOKEN → บันทึก error 'no token'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const KINDS = ['bill', 'due_soon', 'overdue', 'last_day', 'manual', 'receipt', 'reject', 'slip'];
const BY_PAYMENT = ['receipt', 'reject', 'slip'];
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { 'Content-Type': 'application/json' } });

const baht = (n: number) =>
  '฿' +
  Number(n || 0).toLocaleString('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
const monthTh = (ym: string) => {
  const [y, m] = ym.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, 15)).toLocaleDateString('th-TH', {
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Bangkok',
  });
};
const dateTh = (d: string) =>
  new Date(d + 'T12:00:00+07:00').toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Bangkok',
  });
// วันนี้ตามเวลาไทย (YYYY-MM-DD) และจำนวนวันจาก a ถึง b
const todayTh = () => new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10);
const days = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 864e5);

Deno.serve(async req => {
  if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405);
  const sb = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    {
      auth: { persistSession: false },
    }
  );

  const secret = req.headers.get('x-notify-secret') || '';
  const { data: okSecret } = await sb.rpc('notify_secret_ok', { p: secret });
  if (!secret || okSecret !== true) return json({ error: 'unauthorized' }, 401);

  let b: { kind?: string; invoice_id?: string; payment_id?: string };
  try {
    b = await req.json();
  } catch {
    return json({ error: 'bad json' }, 400);
  }
  const kind = String(b.kind || '');
  if (!KINDS.includes(kind)) return json({ error: 'unknown kind' }, 400);

  // ---------- ข้อมูลบิล ----------
  const loadInv = async () => {
    const { data } = await sb
      .from('invoices')
      .select(
        'id, code, billing_month, due_date, status, total_amount, kind, meter_from, meter_to, contract_id, contracts(room_id, rooms(room_no), tenants(user_id, full_name)), invoice_items(item_type, description, amount, meter_reading_id)'
      )
      .eq('id', b.invoice_id)
      .maybeSingle();
    return data;
  };
  // deno-lint-ignore no-explicit-any
  let inv: any = b.invoice_id ? await loadInv() : null;
  if (!inv) return json({ error: 'invoice not found' }, 404);
  // บิลใหม่: รายการในบิลถูกบันทึกตามหลังแถวบิลเล็กน้อย รอแล้วอ่านใหม่ 1 ครั้ง
  if (kind === 'bill' && !(inv.invoice_items || []).length) {
    await new Promise(r => setTimeout(r, 2500));
    inv = (await loadInv()) || inv;
  }
  // deno-lint-ignore no-explicit-any
  let pay: any = null;
  if (b.payment_id) {
    const { data } = await sb
      .from('payments')
      .select('id, receipt_no, payment_method, amount_paid, verify_status, reject_reason')
      .eq('id', b.payment_id)
      .maybeSingle();
    pay = data;
  }
  const { data: S } = await sb
    .from('app_settings')
    .select('dorm_name, system_url, fine_per_day, max_fine')
    .limit(1)
    .maybeSingle();

  // เตือน/ส่งเองเฉพาะบิลที่ยังค้างจริง ณ ตอนส่ง
  if (['due_soon', 'overdue', 'last_day', 'manual'].includes(kind) && inv.status !== 'unpaid')
    return json({ skipped: 'not unpaid' });

  const room = inv.contracts?.rooms?.room_no ?? '-';
  const tenantName = inv.contracts?.tenants?.full_name ?? '';
  const items: {
    item_type: string;
    description: string | null;
    amount: number;
    meter_reading_id: string | null;
  }[] = inv.invoice_items || [];
  const amt = (t: string) =>
    items.filter(x => x.item_type === t).reduce((a, x) => a + Number(x.amount), 0);
  const base =
    items.filter(x => x.item_type !== 'fine').reduce((a, x) => a + Number(x.amount), 0) ||
    Number(inv.total_amount);
  const late = days(inv.due_date, todayTh());
  const fineNow =
    late > 0 ? Math.min(Number(S?.max_fine ?? 250), late * Number(S?.fine_per_day ?? 50)) : 0;
  const url = S?.system_url || 'https://boriphat99.github.io/TEAM.PJ4/';
  const head = `${S?.dorm_name || 'T&T Mansion'} · ห้อง ${room}`;
  const per = (inv.kind === 'final' ? 'บิลย้ายออก ' : 'รอบบิล ') + monthTh(inv.billing_month);
  const finePolicy = `ค่าปรับวันละ ${baht(Number(S?.fine_per_day ?? 50))} สูงสุด ${baht(Number(S?.max_fine ?? 250))}`;

  // หน่วยไฟ (บิลปกติจากเลขมิเตอร์ของบิล · บิลย้ายออกจาก meter_from/meter_to)
  let units = '';
  if (inv.kind === 'final')
    units = `มิเตอร์ ${inv.meter_from} → ${inv.meter_to} (${Number(inv.meter_to) - Number(inv.meter_from)} หน่วย)`;
  else {
    const mid = items.find(x => x.item_type === 'electricity')?.meter_reading_id;
    if (mid) {
      const { data: m } = await sb
        .from('meter_readings')
        .select('previous_reading, current_reading, units_used')
        .eq('id', mid)
        .maybeSingle();
      if (m) units = `${m.units_used} หน่วย (${m.previous_reading} → ${m.current_reading})`;
    }
  }

  const lines: string[] = [];
  switch (kind) {
    case 'bill':
      lines.push(
        inv.kind === 'final' ? 'บิลย้ายออก (ค่าไฟช่วงสุดท้าย)' : 'ใบแจ้งหนี้ใหม่',
        head,
        per
      );
      if (amt('rent')) lines.push(`ค่าเช่า ${baht(amt('rent'))}`);
      lines.push(`ค่าไฟ ${baht(amt('electricity'))}${units ? ' · ' + units : ''}`);
      for (const x of items.filter(x => x.item_type === 'other'))
        lines.push(`${x.description || 'ค่าใช้จ่ายเพิ่มเติม'} ${baht(Number(x.amount))}`);
      lines.push(
        `ยอดรวม ${baht(base)}`,
        `ครบกำหนดชำระ ${dateTh(inv.due_date)}`,
        `ชำระผ่าน QR ได้ที่ ${url}`
      );
      break;
    case 'due_soon':
      lines.push(
        'ใกล้ครบกำหนดชำระ',
        head,
        `${per} ยอด ${baht(base)}`,
        `ครบกำหนด ${dateTh(inv.due_date)}`,
        `ชำระหลังวันครบกำหนดมี${finePolicy}`,
        `ชำระได้ที่ ${url}`
      );
      break;
    case 'overdue':
      lines.push(
        'เลยกำหนดชำระแล้ว',
        head,
        `${per} ยอด ${baht(base)}`,
        `เริ่มมี${finePolicy}`,
        `ยอดที่ต้องชำระวันนี้ ${baht(base + fineNow)}`,
        `ชำระได้ที่ ${url}`
      );
      break;
    case 'last_day':
      lines.push(
        'วันนี้เป็นวันสุดท้ายก่อนผิดนัดชำระ',
        head,
        `${per} ยอด ${baht(base)} + ค่าปรับ ${baht(fineNow)}`,
        `ยอดที่ต้องชำระ ${baht(base + fineNow)}`,
        'หากยังไม่ชำระภายในวันนี้ บิลจะเป็นสถานะผิดนัดชำระ',
        `ชำระได้ที่ ${url}`
      );
      break;
    case 'manual':
      lines.push(
        'แจ้งเตือนค้างชำระ',
        head,
        `${per} ยอด ${baht(base)}`,
        late > 0
          ? `ค้างชำระ ${late} วัน · ค่าปรับ ${baht(fineNow)} · รวม ${baht(base + fineNow)}`
          : `ครบกำหนด ${dateTh(inv.due_date)}`,
        `ชำระได้ที่ ${url} หรือติดต่อผู้ดูแลหอพัก`
      );
      break;
    case 'receipt':
      lines.push(
        'ชำระเงินเรียบร้อยแล้ว',
        head,
        `${per} ยอด ${baht(Number(pay?.amount_paid ?? inv.total_amount))} (${pay?.payment_method === 'cash' ? 'เงินสด' : 'PromptPay QR'})`,
        `ใบเสร็จเลขที่ ${pay?.receipt_no || '-'} ออกแล้ว`,
        `ดูและดาวน์โหลดใบเสร็จได้ที่ ${url}`
      );
      break;
    case 'reject':
      lines.push(
        'สลิปไม่ผ่านการตรวจสอบ',
        head,
        `${per} ยอด ${baht(Number(pay?.amount_paid ?? inv.total_amount))}`,
        `เหตุผล: ${pay?.reject_reason || '-'}`,
        `กรุณาแนบสลิปใหม่ที่ ${url}`
      );
      break;
    case 'slip':
      lines.push(
        'มีสลิปรอตรวจสอบ',
        `${head}${tenantName ? ' · ' + tenantName : ''}`,
        `${per} ยอด ${baht(Number(pay?.amount_paid ?? inv.total_amount))}`,
        `ตรวจสอบได้ที่ ${url}`
      );
      break;
  }
  const text = lines.join('\n');

  // ---------- ผู้รับ ----------
  let users: string[] = [];
  if (kind === 'slip') {
    const { data } = await sb.from('users').select('id').eq('role', 'admin');
    users = (data || []).map((x: { id: string }) => x.id);
  } else if (inv.contracts?.tenants?.user_id) users = [inv.contracts.tenants.user_id];
  if (!users.length) return json({ skipped: 'no recipient' });
  const { data: links } = await sb
    .from('line_links')
    .select('user_id, line_user_id')
    .in('user_id', users);
  if (!links?.length) return json({ skipped: 'not linked' });

  const token = Deno.env.get('LINE_CHANNEL_ACCESS_TOKEN');
  const key = BY_PAYMENT.includes(kind)
    ? { col: 'payment_id', val: b.payment_id }
    : { col: 'invoice_id', val: inv.id };
  let sent = 0;
  const errors: string[] = [];
  for (const l of links) {
    if (kind !== 'manual') {
      const { count } = await sb
        .from('notify_log')
        .select('id', { count: 'exact', head: true })
        .eq(key.col, key.val)
        .eq('kind', kind)
        .eq('to_user', l.user_id)
        .eq('ok', true);
      if (count) continue;
    }
    let ok = false,
      error: string | null = null;
    if (!token) error = 'no token';
    else {
      const r = await fetch('https://api.line.me/v2/bot/message/push', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Line-Retry-Key': crypto.randomUUID(),
        },
        body: JSON.stringify({ to: l.line_user_id, messages: [{ type: 'text', text }] }),
      });
      ok = r.ok;
      if (!r.ok) error = (r.status + ' ' + (await r.text())).slice(0, 300);
    }
    await sb.from('notify_log').insert({
      invoice_id: inv.id,
      payment_id: b.payment_id || null,
      kind,
      to_user: l.user_id,
      ok,
      error,
    });
    if (ok) sent++;
    else if (error) errors.push(error);
  }
  return json({ sent, errors });
});
