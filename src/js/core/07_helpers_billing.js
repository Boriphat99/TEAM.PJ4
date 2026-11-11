/* 07_helpers_billing.js — ตัวช่วยคำนวณ: ค่าปรับ วันครบกำหนด สถานะบิล ยอดรวม รูปแบบตัวเลข
   (แยกมาจาก script.js บรรทัด 778-827; โหลดเรียงตามเลขหน้าชื่อไฟล์ใน index.html) */
const e = s => String(s || '').replace(/[&<>"']/g, c => '&#' + c.charCodeAt(0) + ';'),
  fm = n => Number(n).toLocaleString(LOCF()),
  sd = d => {
    const p = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Bangkok',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
      .format(d)
      .split('-')
      .map(Number);
    return new Date(p[0], p[1] - 1, p[2]);
  },
  due = i => {
    const [y, m] = i.per.split('-').map(Number);
    return new Date(y, m, D.set.due);
  },
  late = (i, d = new Date()) => Math.round((sd(d) - due(i)) / 864e5),
  fine = (i, d) => {
    const n = late(i, d);
    return n > 0 ? Math.min(D.set.max, n * (D.set.fpd || 50)) : 0;
  },
  st = i => (i.s == 'unpaid' && late(i) > 5 ? 'over' : i.s),
  SL = {
    unpaid: ['ยังไม่ชำระ', 'r'],
    pending: ['รอตรวจสอบ', 'y'],
    paid: ['ชำระแล้ว', 'g'],
    over: ['ผิดนัดชำระ', 'p'],
  },
  pill = i => `<span class="pl ${SL[st(i)][1]}">${SL[st(i)][0]}</span>`,
  base = i => i.rent + i.el + (i.x || 0),
  tot = i => base(i) + (i.s == 'unpaid' ? fine(i) : i.fine || 0),
  vac = r => !tn(r.n) && !r.st,
  act = r => D.users.find(u => u.room == r && u.role == 'tenant' && !u.out),
  tn = r => (act(r) || {}).name,
  tu = i => D.users.find(u => u.id == i.uid) || act(i.room),
  mine = i => (i.uid ? i.uid == U.id : i.room == U.room),
  dt = d =>
    new Date(d).toLocaleDateString(LOCF(), {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
  mon = p => {
    const [y, m] = p.split('-');
    return new Date(y, m - 1).toLocaleDateString(LOCF(), {
      month: 'long',
      year: 'numeric',
    });
  },
  gi = id => D.inv.find(i => i.id == id),
  lg = a => {
    D.log.unshift({
      t: Date.now(),
      by: U.name,
      a,
    });
    D.log = D.log.slice(0, 50);
    if (SBON) sbAudit(a);
  },
  pad = n => String(n).padStart(2, '0');
