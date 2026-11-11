/* 06_data_storage_seed.js — ข้อมูลตั้งต้น/โหมดทดลอง และการบันทึกในเบราว์เซอร์
   (แยกมาจาก script.js บรรทัด 690-777; โหลดเรียงตามเลขหน้าชื่อไฟล์ใน index.html) */
const K = 'ttm2',
  $ = s => document.querySelector(s),
  ROOMS = [];
for (let f = 1; f <= 3; f++) for (let i = 1; i <= 9; i++) ROOMS.push(f * 100 + i);
const seed = () => ({
  set: {
    rent: 3600,
    rate: 8,
    dep: 7600,
    due: 5,
    max: 250,
    pp: '0812345678',
  },
  rooms: ROOMS.map((n, i) => ({
    n,
    m: 1000 + i * 37,
  })),
  users: [
    {
      id: 1,
      name: 'ผู้ดูแลระบบ',
      email: 'admin@ttmansion.local',
      pw: 'admin123',
      role: 'admin',
    },
    ...[
      [101, 'Nattapol Sriwong', 'nattapol'],
      [102, 'Pimchanok Saelim', 'pimchanok'],
      [201, 'Kittisak Chaiya', 'kittisak'],
      [202, 'Waranya Khamla', 'waranya'],
      [301, 'Somchai Boonmee', 'somchai'],
    ].map((x, i) => ({
      id: i + 2,
      name: x[1],
      email: x[2] + '@ttmansion.local',
      pw: '1234',
      role: 'tenant',
      room: x[0],
    })),
  ],
  inv: [],
  log: [],
});
let D;
if (SBON) {
  D = seed();
  Object.assign(D, {
    users: [],
    log: [],
    inv: [],
    mail: [],
    tk: [],
    news: [],
    contacts: [],
  });
} else {
  try {
    D = JSON.parse(localStorage.getItem(K));
  } catch (x) {}
  if (!D) D = seed();
}
D.inv.forEach(i => {
  if (!i.uid) {
    const u = D.users.find(x => x.room == i.room && x.role == 'tenant');
    if (u) i.uid = u.id;
  }
});
if (!SBON && !D.users.some(u => u.role == 'owner'))
  D.users.push({
    id: 99,
    name: 'เจ้าของหอพัก',
    email: 'owner@ttmansion.local',
    pw: 'owner123',
    role: 'owner',
  });
D.users.forEach(u => {
  if (u.role == 'tenant' && !u.cs) u.cs = u.id > 1e12 ? u.id : Date.now();
});
D.tk = D.tk || [];
D.news = D.news || [];
const save = () => {
  if (SBON) return sbSync();
  try {
    localStorage.setItem(K, JSON.stringify(D));
  } catch (x) {
    alert('พื้นที่จัดเก็บเต็ม');
  }
};
