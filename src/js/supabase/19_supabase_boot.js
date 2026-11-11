/* 19_supabase_boot.js — Supabase: เริ่มต้น เข้าสู่ระบบ รีเซ็ต
   (แยกมาจาก script.js บรรทัด 1293-1320; โหลดเรียงตามเลขหน้าชื่อไฟล์ใน index.html) */
// ===================== Supabase mode (ใช้เมื่อกรอก URL + anon key ที่ด้านบนไฟล์) =====================
const SBX = {
    cl: null,
    snap: {},
    q: Promise.resolve(),
    t: null,
    rt: null,
    ch: null,
    uid: null,
    recov: false,
  },
  NEWID = () =>
    window.crypto && crypto.randomUUID
      ? crypto.randomUUID()
      : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
          const r = (Math.random() * 16) | 0;
          return (c == 'x' ? r : (r & 3) | 8).toString(16);
        }),
  ISO = t => (t ? new Date(t).toISOString() : null),
  tsv = v => (v ? new Date(v).getTime() : undefined),
  DD = t =>
    t ? new Date(t - new Date(t).getTimezoneOffset() * 6e4).toISOString().slice(0, 10) : null,
  D2T = s => (s ? new Date(s + 'T00:00:00').getTime() : undefined),
  pubUrl = (b, p) => (p ? SBX.cl.storage.from(b).getPublicUrl(p).data.publicUrl : undefined),
  d2b = u => {
    const [h, b] = u.split(','),
      m = h.match(/:(.*?);/)[1],
      s = atob(b),
      a = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) a[i] = s.charCodeAt(i);
    return new Blob([a], { type: m });
  },
  SB_ORD = [
    'app_settings',
    'rooms',
    'users',
    'tenants',
    'contracts',
    'meter_readings',
    'invoices',
    'invoice_items',
    'payments',
    'support_tickets',
    'news',
  ];
const forgotSB = () =>
    auth(
      'ลืมรหัสผ่าน',
      'กรอกอีเมลที่ลงทะเบียนไว้ ระบบจะส่งลิงก์ตั้งรหัสผ่านใหม่ให้ทางอีเมล',
      `<div class="ah"><span class="ib">${IC.key}</span><div><h2>ลืมรหัสผ่าน</h2><small class="mu">ส่งลิงก์รีเซ็ตทางอีเมล</small></div><b class="ac bk" onclick="go('login')">‹ กลับ</b></div>${fld('em', 'อีเมล', '✉', 'email')}<button class="b go" style="width:100%" onclick="fp()">ส่งลิงก์ตั้งรหัสผ่านใหม่ →</button>`,
      'จำรหัสผ่านได้แล้ว?',
      'เข้าสู่ระบบ',
      'login'
    ),
  recover = () =>
    auth(
      'ตั้งรหัสผ่านใหม่',
      'กรอกรหัสผ่านใหม่ของคุณ',
      `<div class="ah"><span class="ib">${IC.key}</span><div><h2>ตั้งรหัสผ่านใหม่</h2><small class="mu">จากลิงก์ในอีเมล</small></div></div>${fld('pw', 'รหัสผ่านใหม่ (อย่างน้อย 6 ตัว)', '🔑', 'password')}${fld('pw2', 'ยืนยันรหัสผ่านใหม่', '🔑', 'password')}<button class="b go" style="width:100%" onclick="rp()">บันทึกรหัสผ่านใหม่ →</button>`,
      'ยกเลิก?',
      'เข้าสู่ระบบ',
      'login'
    );

async function sbInit() {
  await new Promise((ok, no) => {
    if (window.supabase) return ok();
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js';
    s.onload = ok;
    s.onerror = () => no(new Error('โหลดไลบรารี supabase-js ไม่สำเร็จ'));
    document.head.appendChild(s);
  });
  SBX.cl = supabase.createClient(SB_CFG.url, SB_CFG.key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
  SBX.cl.auth.onAuthStateChange(ev => {
    if (ev == 'PASSWORD_RECOVERY') {
      SBX.recov = true;
      P = 'recover';
      R();
    }
  });
}
async function sbBoot() {
  await sbInit();
  pubLoad(true);
  const {
    data: { session },
  } = await SBX.cl.auth.getSession();
  if (session && !SBX.recov) {
    skel();
    try {
      await sbEnter();
    } catch (x) {
      alert(x.message || x);
    }
    if (!U) R();
  }
}
async function sbEnter(fresh) {
  await sbLoad();
  U = D.users.find(u => u._uid == SBX.uid) || null;
  if (!U) {
    await SBX.cl.auth.signOut();
    return alert('ไม่พบข้อมูลบัญชีในระบบ');
  }
  if (U.out) {
    await SBX.cl.auth.signOut();
    U = null;
    sbReset();
    return alert('บัญชีนี้ย้ายออกแล้ว กรุณาติดต่อผู้ดูแล');
  }
  sbRT();
  enter(U, 0, fresh);
}
function sbReset() {
  const d = seed();
  Object.assign(D, d, { users: [], log: [], inv: [], mail: [], tk: [], news: [], contacts: [] });
  SBX.snap = {};
  SBX.uid = null;
  if (SBX.ch && SBX.cl) {
    SBX.cl.removeChannel(SBX.ch);
  }
  SBX.ch = null;
}
