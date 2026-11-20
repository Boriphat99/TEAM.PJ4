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

// จำนวนเงินแบบเอกสาร เช่น 4,648.00 บาท
const baht = (n: number) =>
  Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) +
  ' บาท';
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
    month: 'long',
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
  // บิลใหม่: รายการในบิลถูกบันทึกตามหลังแถวบิล (เน็ตช้าอาจหลายวินาที) รออ่านใหม่สูงสุด 4 ครั้ง
  for (let t = 0; kind === 'bill' && !(inv.invoice_items || []).length && t < 4; t++) {
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
  // บิลที่ชำระแล้วตั้งแต่ตอนบันทึก (เช่น ลงข้อมูลย้อนหลัง) ไม่ต้องแจ้งว่าบิลออก
  if (kind === 'bill' && inv.status === 'paid') return json({ skipped: 'already paid' });

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
  const dorm = S?.dorm_name || 'T&T Mansion';
  const fineDay = Number(S?.fine_per_day ?? 50);
  const fineMax = Number(S?.max_fine ?? 250);
  const n0 = (n: number) => n.toLocaleString('en-US') + ' บาท';
  const finePolicy = `คิดค่าปรับวันละ ${n0(fineDay)} สูงสุดไม่เกิน ${n0(fineMax)}`;
  const month =
    inv.kind === 'final'
      ? 'งวดสุดท้าย (ย้ายออก) เดือน' + monthTh(inv.billing_month)
      : 'ประจำเดือน' + monthTh(inv.billing_month);
  // ส่วนหัวของข้อความถึงผู้เช่า: หัวเรื่อง / หอพัก ห้อง / เรียน ชื่อผู้เช่า
  const top = (title: string) => {
    lines.push(title, `${dorm} ห้อง ${room}`);
    if (tenantName) lines.push(`เรียน คุณ${tenantName}`);
    lines.push('');
  };
  const ignore = 'หากท่านชำระเงินแล้ว โปรดละเว้นข้อความนี้';

  // หน่วยไฟ (บิลปกติจากเลขมิเตอร์ของบิล · บิลย้ายออกจาก meter_from/meter_to)
  let units = '';
  if (inv.kind === 'final')
    units = `${Number(inv.meter_to) - Number(inv.meter_from)} หน่วย เลขมิเตอร์ ${inv.meter_from} ถึง ${inv.meter_to}`;
  else {
    const mid = items.find(x => x.item_type === 'electricity')?.meter_reading_id;
    if (mid) {
      const { data: m } = await sb
        .from('meter_readings')
        .select('previous_reading, current_reading, units_used')
        .eq('id', mid)
        .maybeSingle();
      if (m) units = `${m.units_used} หน่วย เลขมิเตอร์ ${m.previous_reading} ถึง ${m.current_reading}`;
    }
  }

  const lines: string[] = [];
  const paid = baht(Number(pay?.amount_paid ?? inv.total_amount));
  switch (kind) {
    case 'bill':
      top(inv.kind === 'final' ? 'แจ้งใบแจ้งหนี้ค่าไฟฟ้างวดสุดท้าย (ย้ายออก)' : 'แจ้งใบแจ้งหนี้' + month);
      if (amt('rent')) lines.push(`ค่าเช่าห้อง ${baht(amt('rent'))}`);
      lines.push(`ค่าไฟฟ้า ${baht(amt('electricity'))}${units ? ` (${units})` : ''}`);
      for (const x of items.filter(x => x.item_type === 'other'))
        lines.push(`${x.description || 'ค่าใช้จ่ายเพิ่มเติม'} ${baht(Number(x.amount))}`);
      lines.push(
        `รวมเป็นเงินทั้งสิ้น ${baht(base)}`,
        `กำหนดชำระภายในวันที่ ${dateTh(inv.due_date)}`,
        '',
        'ท่านสามารถดูใบแจ้งหนี้และชำระเงินผ่านพร้อมเพย์ได้ที่',
        url
      );
      break;
    case 'due_soon':
      top('แจ้งเตือนกำหนดชำระค่าบริการ');
      lines.push(
        `ใบแจ้งหนี้${month} จำนวน ${baht(base)}`,
        `ครบกำหนดชำระในวันที่ ${dateTh(inv.due_date)}`,
        `หากชำระหลังวันครบกำหนด ${finePolicy}`,
        '',
        'ท่านสามารถชำระเงินได้ที่',
        url,
        ignore
      );
      break;
    case 'overdue':
      top('แจ้งเตือนค่าบริการเกินกำหนดชำระ');
      lines.push(
        `ใบแจ้งหนี้${month} จำนวน ${baht(base)}`,
        `ครบกำหนดชำระเมื่อวันที่ ${dateTh(inv.due_date)}`,
        'ขณะนี้ยังไม่ได้รับการชำระ',
        `ค่าปรับ ${baht(fineNow)} (คิดวันละ ${n0(fineDay)} สูงสุดไม่เกิน ${n0(fineMax)})`,
        `ยอดที่ต้องชำระ ณ วันนี้ ${baht(base + fineNow)}`,
        '',
        'กรุณาชำระเงินโดยเร็วได้ที่',
        url,
        ignore
      );
      break;
    case 'last_day':
      top('แจ้งเตือนวันสุดท้ายของการชำระค่าบริการ');
      lines.push(
        `ใบแจ้งหนี้${month} ยังไม่ได้รับการชำระ`,
        `ค่าบริการ ${baht(base)} ค่าปรับ ${baht(fineNow)}`,
        `รวมยอดที่ต้องชำระ ${baht(base + fineNow)}`,
        'วันนี้เป็นวันสุดท้ายของการชำระเงิน หากพ้นวันนี้จะถือว่าผิดนัดชำระตามสัญญาเช่า',
        '',
        'กรุณาชำระเงินภายในวันนี้ได้ที่',
        url,
        ignore
      );
      break;
    case 'manual':
      top('แจ้งเตือนค่าบริการค้างชำระ');
      lines.push(`ใบแจ้งหนี้${month} จำนวน ${baht(base)}`);
      if (late > 0)
        lines.push(
          `ค้างชำระมาแล้ว ${late} วัน ค่าปรับ ${baht(fineNow)}`,
          `รวมยอดที่ต้องชำระ ${baht(base + fineNow)}`
        );
      else lines.push(`ครบกำหนดชำระในวันที่ ${dateTh(inv.due_date)}`);
      lines.push('', 'กรุณาชำระเงินได้ที่', url, 'หากมีข้อสงสัย กรุณาติดต่อผู้ดูแลหอพัก', ignore);
      break;
    case 'receipt':
      top('ยืนยันการรับชำระเงิน');
      lines.push(
        `หอพักได้รับชำระค่าบริการ${month} เรียบร้อยแล้ว`,
        `จำนวนเงิน ${paid}`,
        `ช่องทางการชำระ ${pay?.payment_method === 'cash' ? 'เงินสด' : 'โอนผ่านพร้อมเพย์'}`,
        `ใบเสร็จรับเงินเลขที่ ${pay?.receipt_no || '-'}`,
        '',
        'ท่านสามารถดูและดาวน์โหลดใบเสร็จรับเงินได้ที่',
        url,
        'ขอขอบคุณที่ใช้บริการ'
      );
      break;
    case 'reject':
      top('แจ้งผลการตรวจสอบหลักฐานการชำระเงิน');
      lines.push(
        `หลักฐานการชำระค่าบริการ${month} จำนวน ${paid} ไม่ผ่านการตรวจสอบ`,
        `เหตุผล ${pay?.reject_reason || '-'}`,
        '',
        'กรุณาแนบหลักฐานการชำระเงินใหม่อีกครั้งได้ที่',
        url
      );
      break;
    case 'slip':
      lines.push(
        'แจ้งหลักฐานการชำระเงินรอตรวจสอบ',
        `${dorm} ห้อง ${room}${tenantName ? ' คุณ' + tenantName : ''}`,
        '',
        `ใบแจ้งหนี้${month} จำนวน ${paid}`,
        'ผู้เช่าแนบหลักฐานการชำระเงินเข้าระบบแล้ว',
        '',
        'กรุณาตรวจสอบและอนุมัติได้ที่',
        url
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
