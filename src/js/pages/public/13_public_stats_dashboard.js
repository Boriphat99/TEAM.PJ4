/* 13_public_stats_dashboard.js — ข้อมูลสรุปแดชบอร์ดตัวอย่างหน้าต้อนรับ (public_stats)
   (แยกมาจาก script.js บรรทัด 1071-1082; โหลดเรียงตามเลขหน้าชื่อไฟล์ใน index.html) */
// ---- ข้อมูลสรุปแบบสาธารณะ (ไม่มีชื่อผู้เช่า) สำหรับแดชบอร์ดตัวอย่างหน้าต้อนรับ: โหลดใหม่ทุก 1 ชั่วโมง ----
var PUBD = null,
  PUBT = 0;
function withPub(f) {
  const o = { rooms: D.rooms, users: D.users, inv: D.inv, set: D.set };
  D.rooms = PUBD.rooms;
  D.users = PUBD.users;
  D.inv = PUBD.inv;
  D.set = Object.assign({}, o.set);
  Object.keys(PUBD.set).forEach(k => {
    if (PUBD.set[k] !== undefined) D.set[k] = PUBD.set[k];
  });
  try {
    return f();
  } finally {
    D.rooms = o.rooms;
    D.users = o.users;
    D.inv = o.inv;
    D.set = o.set;
  }
}
function pubBuild(d) {
  const rr = d.rooms || [],
    occ = new Set(rr.filter(r => r.st == 'occ').map(r => +r.n)),
    s = d.set || {};
  return {
    rooms: rr.map(r => ({
      n: +r.n,
      m: 0,
      st: r.st == 'busy' || r.st == 'maint' ? r.st : undefined,
    })),
    users: [...occ].map(n => ({ id: 'p' + n, name: 'ห้อง ' + n, role: 'tenant', room: n })),
    inv: (d.inv || [])
      .filter(v => v && typeof v == 'object' && /^\d{4}-\d{2}$/.test(v.per || '') && +v.room > 0)
      .map(v => ({
        id: v.code,
        room: +v.room,
        uid: 'p' + v.room,
        per: v.per,
        pv: 0,
        u: 0,
        el: +v.el || 0,
        x: +v.x || 0,
        xn: '',
        rent: +v.rent || 0,
        fine: +v.fine || 0,
        s: v.s == 'overdue' ? 'unpaid' : v.s,
        iss: v.iss ? Date.parse(v.iss) : 0,
        paid: v.paid ? Date.parse(v.paid) : undefined,
      })),
    set: {
      rent: +s.rent || undefined,
      rate: +s.rate || undefined,
      dep: +s.dep || undefined,
      due: +s.due || undefined,
      max: +s.max || undefined,
      fpd: +s.fpd || undefined,
      name: s.name || undefined,
    },
  };
}
const PUB_STATS = false; /* ปิดแดชบอร์ดสาธารณะ: หน้าต้อนรับใช้ข้อมูลตัวอย่าง ไม่ดึงข้อมูลจริง (เปิดได้โดยรันไฟล์ 06 แล้วเปลี่ยนเป็น true) */
async function pubLoad(force) {
  if (!PUB_STATS || !SBON || !SBX.cl || U) return;
  if (!force && PUBD && Date.now() - PUBT < 36e5) return;
  try {
    const { data, error } = await SBX.cl.rpc('public_stats');
    if (error || !data) return;
    PUBD = pubBuild(data);
    PUBT = Date.now();
    if (!U && P == 'home') R();
  } catch (x) {}
}
setInterval(() => pubLoad(true), 36e5);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) pubLoad();
});
