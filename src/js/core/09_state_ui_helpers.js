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
let PER = pcur();
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
const cf = (m, cb) => dg(m, cb);
const go = p => {
    if (p == 'met' && P != 'met') PER = pcur(); // กดเข้าเมนู → เดือนล่าสุด
    P = p;
    R();
  },
  mo = h => {
    $('#mc').style.maxWidth = '';
    $('#mc').innerHTML = h;
    $('#mo').style.display = 'flex';
  },
  cm = () => {
    $('#mo').style.display = 'none';
  };
