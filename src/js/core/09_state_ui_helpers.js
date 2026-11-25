/* 09_state_ui_helpers.js — ตัวแปรสถานะหน้าเว็บ, บทบาท, รอบบิล, toast/dialog/modal
   (แยกมาจาก script.js บรรทัด 846-899; โหลดเรียงตามเลขหน้าชื่อไฟล์ใน index.html) */
// ---- ตรวจความปลอดภัยของรหัสผ่านใหม่ (คืนข้อความเตือน หรือ '' ถ้าใช้ได้) ----
// อย่างน้อย 8 ตัว · มีทั้งตัวอักษรและตัวเลข · ไม่ใช่รหัสที่คาดเดาง่าย · ไม่มีชื่ออีเมลอยู่ในรหัส
const PW_WEAK = [
  'password',
  'password1',
  'passw0rd',
  'qwerty123',
  'qwertyui',
  'abc12345',
  'abcd1234',
  'a1234567',
  '1234abcd',
  'iloveyou1',
  'admin123',
  'admin1234',
  'welcome1',
  'tenant123',
  'test1234',
  'p@ssw0rd',
];
function pwBad(w, email) {
  w = String(w || '');
  if (w.length < 8) return 'รหัสผ่านต้องมีอย่างน้อย 8 ตัว';
  if (!/[A-Za-z\u0E00-\u0E7F]/.test(w) || !/[0-9]/.test(w)) return 'รหัสผ่านต้องมีทั้งตัวอักษรและตัวเลข';
  const lw = w.toLowerCase(),
    me = String(email || '')
      .toLowerCase()
      .split('@')[0];
  if (PW_WEAK.includes(lw) || /^(.)\1+$/.test(w) || (me.length >= 4 && lw.includes(me)))
    return 'รหัสผ่านนี้คาดเดาง่ายเกินไป กรุณาตั้งใหม่';
  return '';
}
// ---- state ----
let U = null,
  P = 'home',
  F = 'all',
  Q = '',
  SLIP = null;
const APP_V = 'v2026.10.16-A',
  RL = { admin: 'ผู้ดูแลระบบ', owner: 'เจ้าของกิจการ', tenant: 'ผู้เช่า' },
  bk = () => {
    try {
      const o = {};
      new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Bangkok',
        hourCycle: 'h23',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      })
        .formatToParts(new Date())
        .forEach(p => (o[p.type] = +p.value));
      return new Date(o.year, o.month - 1, o.day, o.hour % 24, o.minute, o.second);
    } catch (x) {
      return new Date(Date.now() + (new Date().getTimezoneOffset() + 420) * 6e4);
    }
  },
  padd = (p, k) => {
    const [y, m] = p.split('-').map(Number),
      d = new Date(y, m - 1 + k, 1);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
  },
  pcur = () => {
    const n = bk();
    return n.getFullYear() + '-' + String(n.getMonth() + 1).padStart(2, '0');
  },
  // รอบบิลล็อกเมื่อถึงวันที่ 11 ของเดือนถัดไป (เวลาไทย) = เกินวันที่ 10 แล้ว
  plock = p => {
    const [y, m] = p.split('-').map(Number);
    return bk() >= new Date(y, m, 11);
  },
  MAILOK = m => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(m || '').trim()),
  MAILMSG = 'รูปแบบอีเมลไม่ถูกต้อง',
  // เบอร์โทรไทย: ขึ้นต้นด้วย 0 ยาว 9–10 หลัก (เว้นวรรค/ขีดได้) ใช้ตรวจแบบเดียวกันทุกฟอร์ม
  TELOK = t => /^0\d{8,9}$/.test(String(t || '').replace(/[\s-]/g, ''));
const dper = () => {
  const n = bk(),
    d = n.getDate() >= 27 ? n : new Date(n.getFullYear(), n.getMonth() - 1, 1);
  return d.getFullYear() + '-' + pad(d.getMonth() + 1);
};
// หน้ามิเตอร์ & ออกบิล เปิดที่เดือนล่าสุด (เดือนปัจจุบัน) เสมอ
let PER = pcur(),
  PERA = PER; // เดือนที่ระบบเลือกให้อัตโนมัติ (ถ้าผู้ใช้ไม่ได้เลือกเอง จะเลื่อนตามเดือนปัจจุบัน)
try {
  const s = +STO.getItem('ttm_s');
  U = D.users.find(u => u.id == s && !u.out) || null;
  if (U) P = 'x';
} catch (x) {}
const tt = m => {
  const d = document.createElement('div');
  d.className = 'ts';
  d.textContent = m;
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 3000);
};
const av = (u, z = 36) =>
  `<span class="av" style="width:${z}px;height:${z}px;font-size:${z * 0.42}px">${u.av ? `<img src="${u.av}" alt="">` : e((u.name || '?').trim().charAt(0).toUpperCase())}</span>`;
function dg(m, cb) {
  const d = $('#dg');
  d.innerHTML = `<div class="cd"><p style="white-space:pre-line;margin:0 0 16px">${e(m)}</p><div style="display:flex;gap:10px;justify-content:flex-end">${cb ? '<button class="b b2" id="dn">ยกเลิก</button>' : ''}<button class="b" id="dy">${cb ? 'ยืนยัน' : 'ตกลง'}</button></div></div>`;
  d.style.display = 'flex';
  $('#dy').onclick = () => {
    d.style.display = 'none';
    cb && cb();
  };
  if (cb)
    $('#dn').onclick = () => {
      d.style.display = 'none';
    };
}
window.alert = m => dg(String(m));
// แปลงข้อความ error ภาษาอังกฤษจาก Supabase / เบราว์เซอร์ เป็นภาษาไทยที่ผู้ใช้อ่านเข้าใจ
// (ข้อความไทยจากฐานข้อมูลส่งผ่านไปตามเดิม)
function thErr(x) {
  const m = String((x && (x.message || x.error_description || x.error)) || x || '').trim();
  if (/[\u0E00-\u0E7F]/.test(m)) return m;
  const L = [
    [/failed to fetch|networkerror|load failed|network request failed|timeout|timed out/i, 'เชื่อมต่ออินเทอร์เน็ตไม่ได้ กรุณาตรวจสอบสัญญาณแล้วลองใหม่'],
    [/jwt expired|invalid jwt|auth session missing|refresh token|not authenticated|session.*(expired|not found)/i, 'การเข้าสู่ระบบหมดอายุ กรุณาออกจากระบบแล้วเข้าสู่ระบบใหม่'],
    [/only request this after (\d+) seconds?/i, s => 'ขอบ่อยเกินไป กรุณารอ ' + s.match(/(\d+) seconds?/i)[1] + ' วินาทีแล้วลองใหม่'],
    [/rate limit|too many requests/i, 'ทำรายการบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่'],
    [/should be different from the old password/i, 'รหัสผ่านใหม่ต้องไม่ซ้ำกับรหัสผ่านเดิม'],
    [/password should be at least/i, 'รหัสผ่านสั้นเกินไป'],
    [/weak password|pwned|leaked/i, 'รหัสผ่านนี้คาดเดาง่ายหรือเคยรั่วไหล กรุณาตั้งรหัสใหม่'],
    [/user not found|invalid login credentials/i, 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'],
    [/row-level security|permission denied|not allowed|forbidden/i, 'ไม่มีสิทธิ์ทำรายการนี้'],
    [/invoice not found/i, 'ไม่พบบิลนี้ กรุณารีเฟรชหน้าแล้วลองใหม่'],
    [/invoice is not payable/i, 'บิลนี้ชำระแล้วหรือรอตรวจสอบอยู่ กรุณารีเฟรชหน้า'],
    [/payment cannot be edited/i, 'แก้ไขรายการชำระนี้ไม่ได้แล้ว กรุณารีเฟรชหน้า'],
    [/exceeded the maximum allowed size|payload too large|entity too large/i, 'ไฟล์ใหญ่เกินกำหนด กรุณาเลือกไฟล์ที่เล็กลง'],
    [/mime type|not supported/i, 'ชนิดไฟล์นี้ใช้ไม่ได้ กรุณาเลือกรูปภาพ'],
    [/already exists|duplicate key/i, 'ข้อมูลนี้มีอยู่แล้ว กรุณารีเฟรชหน้าแล้วลองใหม่'],
  ];
  for (const [re, t] of L) if (re.test(m)) return typeof t == 'function' ? t(m) : t;
  return m ? 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง (' + m + ')' : 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง';
}
const cf = (m, cb) => dg(m, cb);
// ปุ่มย้อนกลับของมือถือ/เบราว์เซอร์: ปิดหน้าต่างที่เปิดอยู่ หรือกลับไปหน้าก่อนหน้าในระบบ
// (เดิมกดย้อนกลับแล้วหลุดออกจากเว็บทันที) · เก็บประวัติเฉพาะตอนล็อกอินแล้ว
const HS = { skip: 0 },
  // หน้าแรกที่เปิดยังไม่มีป้าย → ติดป้ายหน้าปัจจุบันก่อน กดย้อนกลับมาจะได้รู้ว่าเป็นหน้าไหน
  hsTag = () => {
    try {
      if (!(history.state && history.state.ttm)) history.replaceState({ ttm: 1, p: P }, '');
    } catch (_) {}
  },
  hsPush = st => {
    try {
      hsTag();
      history.pushState(Object.assign({ ttm: 1 }, st), '');
    } catch (_) {}
  };
const go = (p, nh) => {
    if (p == 'met' && P != 'met') PER = PERA = pcur(); // กดเข้าเมนู → เดือนล่าสุด
    const from = P;
    if (!nh && U) hsTag();
    P = p;
    R();
    // บันทึกหน้าที่ไปถึงจริง (ถ้าเมนูนั้นไม่มีสิทธิ์ ระบบจะพาไปหน้าอื่นเอง)
    if (!nh && U && P != from) hsPush({ p: P });
  },
  mo = h => {
    $('#mc').style.maxWidth = '';
    $('#mc').innerHTML = h;
    if (HS.pend) {
      // เพิ่งปิดหน้าต่างแล้วเปิดใหม่ทันที → ใช้ประวัติเดิม ไม่ต้องถอยแล้วเพิ่มใหม่
      clearTimeout(HS.pend);
      HS.pend = 0;
    } else if (U && $('#mo').style.display != 'flex') hsPush({ p: P, m: 1 });
    $('#mo').style.display = 'flex';
  },
  cm = () => {
    $('#mo').style.display = 'none';
    if (history.state && history.state.ttm && history.state.m && !HS.pend)
      HS.pend = setTimeout(() => {
        HS.pend = 0;
        if ($('#mo').style.display == 'flex') return;
        HS.skip = 1;
        history.back();
      }, 0);
  };
window.addEventListener('popstate', ev => {
  if (HS.skip) {
    HS.skip = 0;
    return;
  }
  const dgEl = $('#dg');
  if (dgEl && dgEl.style.display == 'flex') {
    dgEl.style.display = 'none'; // กล่องยืนยัน: ถือว่ากดยกเลิก
    if (U) hsPush({ p: P });
    return;
  }
  if ($('#mo').style.display == 'flex') {
    $('#mo').style.display = 'none';
    return;
  }
  const st = ev.state;
  if (U && st && st.ttm && st.p && st.p != P) go(st.p, 1);
});
