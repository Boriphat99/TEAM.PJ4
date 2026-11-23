// Supabase Edge Function: line-webhook
// รับเหตุการณ์จาก LINE Official Account (ตั้งเป็น Webhook URL ใน LINE Developers)
//
// ตรวจ X-Line-Signature = base64(HMAC-SHA256(body, LINE_CHANNEL_SECRET)) ไม่ตรง → 401
// follow   → ตอบวิธีเชื่อมบัญชี
// message  → ถ้าเป็นตัวเลข 6 หลัก จับคู่กับ line_link_codes ที่ยังไม่หมดอายุ แล้วบันทึก line_links
//            ผิดเกิน 5 ครั้งใน 1 ชั่วโมง → ให้รอก่อน (line_link_fails)
// unfollow → ลบการเชื่อมของบัญชี LINE นั้น
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { 'Content-Type': 'application/json' } });

// ข้อความวิธีเชื่อมบัญชี พร้อมลิงก์เว็บไซต์และ LINE สำหรับสอบถาม (อ่านจากหน้าตั้งค่าของระบบ)
// deno-lint-ignore no-explicit-any
const helpText = (S: any) => {
  const url = S?.system_url || 'https://boriphat99.github.io/TEAM.PJ4/';
  const dorm = S?.dorm_name || 'T&T Mansion';
  const ask = S?.line_id ? `\n\nหากมีข้อสงสัย กรุณาติดต่อผู้ดูแลหอพักทาง LINE ID ${S.line_id}` : '';
  return (
    `บัญชีนี้ใช้สำหรับส่งการแจ้งเตือนจากระบบหอพัก ${dorm} และไม่สามารถตอบข้อความได้\n\n` +
    'วิธีเชื่อมบัญชีเพื่อรับการแจ้งเตือน\n' +
    `1. เข้าสู่ระบบที่ ${url} แล้วไปที่หน้าโปรไฟล์\n` +
    '2. กด "ขอรหัส" ในหัวข้อแจ้งเตือนทาง LINE\n' +
    '3. ส่งรหัส 6 หลักที่ได้รับมาในแชทนี้ภายใน 10 นาที' +
    ask
  );
};
const MAX_FAILS = 5;

async function validSignature(body: string, sig: string, secret: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const mac = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body)));
  const expect = btoa(String.fromCharCode(...mac));
  if (expect.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < expect.length; i++) diff |= expect.charCodeAt(i) ^ sig.charCodeAt(i);
  return diff === 0;
}

async function reply(token: string | undefined, text: string) {
  const at = Deno.env.get('LINE_CHANNEL_ACCESS_TOKEN');
  if (!token || !at) return;
  try {
    await fetch('https://api.line.me/v2/bot/message/reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + at },
      body: JSON.stringify({ replyToken: token, messages: [{ type: 'text', text }] }),
    });
  } catch (_) {
    // ตอบกลับไม่ได้ก็ไม่เป็นไร ไม่ให้ webhook ล้ม
  }
}

type LineEvent = {
  type: string;
  replyToken?: string;
  source?: { type?: string; userId?: string };
  message?: { type?: string; text?: string };
};

Deno.serve(async req => {
  if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405);
  const secret = Deno.env.get('LINE_CHANNEL_SECRET') || '';
  const sig = req.headers.get('x-line-signature') || '';
  const raw = await req.text();
  if (!secret || !sig || !(await validSignature(raw, sig, secret)))
    return json({ error: 'bad signature' }, 401);

  let events: LineEvent[] = [];
  try {
    events = JSON.parse(raw).events || [];
  } catch {
    return json({ error: 'bad json' }, 400);
  }

  const sb = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } }
  );

  // deno-lint-ignore no-explicit-any
  let S: any = null;
  const help = async () => {
    if (!S)
      S =
        (
          await sb
            .from('app_settings')
            .select('system_url, line_id, dorm_name')
            .limit(1)
            .maybeSingle()
        ).data || {};
    return helpText(S);
  };

  for (const ev of events) {
    const lineUser = ev.source?.userId;
    if (!lineUser || ev.source?.type !== 'user') continue;

    if (ev.type === 'follow') {
      const h = await help();
      await reply(ev.replyToken, `ขอบคุณที่เพิ่ม ${S?.dorm_name || 'T&T Mansion'} เป็นเพื่อน\n\n` + h);
      continue;
    }
    if (ev.type === 'unfollow') {
      await sb.from('line_links').delete().eq('line_user_id', lineUser);
      continue;
    }
    if (ev.type !== 'message' || ev.message?.type !== 'text') continue;

    const text = String(ev.message.text || '').replace(/\s+/g, '');
    if (!/^\d{6}$/.test(text)) {
      await reply(ev.replyToken, await help());
      continue;
    }

    const hourAgo = new Date(Date.now() - 3600e3).toISOString();
    const { count } = await sb
      .from('line_link_fails')
      .select('*', { count: 'exact', head: true })
      .eq('line_user_id', lineUser)
      .gte('at', hourAgo);
    if ((count || 0) >= MAX_FAILS) {
      await reply(
        ev.replyToken,
        'ท่านกรอกรหัสไม่ถูกต้องเกินจำนวนครั้งที่กำหนด กรุณาลองใหม่อีกครั้งหลังจาก 1 ชั่วโมง'
      );
      continue;
    }

    const { data: code } = await sb
      .from('line_link_codes')
      .select('user_id')
      .eq('code', text)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();
    if (!code) {
      await sb.from('line_link_fails').insert({ line_user_id: lineUser });
      await reply(ev.replyToken, 'รหัสไม่ถูกต้องหรือหมดอายุแล้ว กรุณาขอรหัสใหม่จากหน้าโปรไฟล์ในระบบ');
      continue;
    }

    const uid = code.user_id as string;
    await sb.from('line_links').delete().eq('line_user_id', lineUser).neq('user_id', uid);
    const { error } = await sb
      .from('line_links')
      .upsert(
        { user_id: uid, line_user_id: lineUser, linked_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      );
    if (error) {
      await reply(ev.replyToken, 'ไม่สามารถเชื่อมบัญชีได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง');
      continue;
    }
    await sb.from('line_link_codes').delete().eq('code', text);
    await sb.from('line_link_fails').delete().eq('line_user_id', lineUser);

    const { data: u } = await sb
      .from('users')
      .select('full_name, role')
      .eq('id', uid)
      .maybeSingle();
    let room = '';
    const { data: t } = await sb
      .from('tenants')
      .select('contracts(status, rooms(room_no))')
      .eq('user_id', uid)
      .maybeSingle();
    // deno-lint-ignore no-explicit-any
    const act = ((t?.contracts as any[]) || []).find((c: any) => c.status === 'active');
    if (act?.rooms?.room_no) room = '\nห้อง ' + act.rooms.room_no;
    const who = u?.full_name ? '\nชื่อ คุณ' + u.full_name : '';
    const tail =
      u?.role === 'tenant'
        ? '\n\nท่านจะได้รับการแจ้งเตือนใบแจ้งหนี้ กำหนดชำระ และใบเสร็จรับเงินผ่านช่องทางนี้'
        : u?.role === 'admin' || u?.role === 'owner'
          ? '\n\nท่านจะได้รับการแจ้งเตือนเมื่อมีผู้เช่าแนบหลักฐานการชำระเงิน'
          : '';
    await reply(ev.replyToken, 'เชื่อมบัญชีเรียบร้อยแล้ว' + who + room + tail);
  }

  return json({ ok: true });
});
