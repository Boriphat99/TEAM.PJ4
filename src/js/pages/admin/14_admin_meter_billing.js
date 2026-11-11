/* 14_admin_meter_billing.js — ผู้ดูแล: จดมิเตอร์ ล็อกรอบบิล ออกบิล
   (แยกมาจาก script.js บรรทัด 1083-1095; โหลดเรียงตามเลขหน้าชื่อไฟล์ใน index.html) */
function pall() {
  const c = pcur(),
    pv = padd(c, -1),
    ks = D.inv
      .map(i => i.per)
      .filter(Boolean)
      .sort(),
    e0 = ks.length && ks[0] < pv ? ks[0] : pv,
    o = [];
  let p = c,
    n = 0;
  while (p >= e0 && n < 60) {
    o.push(p);
    p = padd(p, -1);
    n++;
  }
  return o;
}
function mbl() {
  document.querySelectorAll('.mn table').forEach(t => {
    const hr = [...t.rows].find(r => r.querySelector('th'));
    if (!hr) return;
    const hs = [...hr.cells].map(c => c.textContent.trim());
    t.classList.add('rt');
    [...t.rows].forEach(r => {
      if (r === hr) {
        r.classList.add('rh');
        return;
      }
      let i = 0;
      [...r.cells].forEach(c => {
        if (c.colSpan > 1) {
          i += c.colSpan;
          return;
        }
        if (hs[i]) c.setAttribute('data-l', hs[i]);
        i++;
      });
    });
  });
}
const LKM = p =>
  'รอบบิล ' +
  mon(p) +
  ' ปิดแล้ว (เกินวันที่ 10 ของเดือนถัดไป) ไม่สามารถออกบิลย้อนหลังหรือแก้ไขเลขมิเตอร์/ค่าใช้จ่ายได้';
let MV = {},
  MK = '';
function mtick() {
  if (!U || P != 'met') return;
  const k = pall()
    .map(p => p + (plock(p) ? 'L' : 'O'))
    .join();
  if (MK && k != MK) {
    const busy =
      getComputedStyle($('#mo')).display != 'none' ||
      /INPUT|SELECT|TEXTAREA/.test((document.activeElement || {}).tagName || '');
    if (busy) return;
    MK = k;
    R();
  } else MK = k;
}
setInterval(mtick, 30000);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) mtick();
});
function pvOf(r) {
  const l = D.inv.filter(i => i.room == r.n).sort((a, b) => (a.per < b.per ? 1 : -1))[0];
  return l ? l.pv + l.u : r.m;
} // เลขก่อนหน้า = เลขล่าสุดของบิลล่าสุด (ล็อก ไม่ให้พิมพ์แก้)
function lv(n) {
  const r = D.rooms.find(x => x.n == n),
    v = $('#m' + n).value,
    u = v === '' ? null : +v - pvOf(r),
    x = +$('#x' + n).value || 0,
    el = u == null || u < 0 ? null : u * D.set.rate;
  $('#u' + n).textContent = u == null ? '-' : u;
  $('#a' + n).textContent = el == null ? '-' : '฿' + fm(el);
  $('#t' + n).textContent = el == null ? '-' : '฿' + fm(el + x + D.set.rent);
}
function iss() {
  if (plock(PER)) return alert(LKM(PER));
  const [y, m] = PER.split('-').map(Number);
  if (new Date() < new Date(y, m - 1, 27))
    return cf('ยังไม่ถึงวันจดมิเตอร์ (27) ต้องการออกบิลต่อหรือไม่?', iss2);
  iss2();
}
function iss2() {
  let c = 0;
  if (plock(PER)) return alert(LKM(PER));
  for (const r of D.rooms.filter(r => tn(r.n))) {
    const el = $('#m' + r.n);
    if (!el || el.value === '') continue;
    const v = +el.value,
      p0 = pvOf(r);
    if (D.inv.some(i => i.room == r.n && i.per > PER))
      return alert('ห้อง ' + r.n + ': มีบิลของเดือนถัดไปออกแล้ว ไม่สามารถออกบิลย้อนหลังได้');
    if (v < p0) return alert('ห้อง ' + r.n + ': เลขมิเตอร์ต้องไม่น้อยกว่าเดิม (' + p0 + ')');
    D.inv.push({
      id: 'INV' + PER.replace('-', '') + '-' + r.n,
      room: r.n,
      uid: act(r.n).id,
      per: PER,
      pv: p0,
      u: v - p0,
      el: (v - p0) * D.set.rate,
      x: +$('#x' + r.n).value || 0,
      xn: $('#xn' + r.n).value.trim(),
      rent: D.set.rent,
      fine: 0,
      s: 'unpaid',
      iss: Date.now(),
    });
    r.m = v;
    c++;
  }
  if (c) {
    lg('ออกบิล ' + c + ' ห้อง รอบ ' + PER);
    save();
    D.inv.slice(-c).forEach(i => mail('inv', i));
    tt('✓ ออกใบแจ้งหนี้ ' + c + ' ห้อง · เพิ่มคิวส่งอีเมลแล้ว');
    R();
  } else alert('ยังไม่ได้กรอกเลขมิเตอร์ใหม่');
}
