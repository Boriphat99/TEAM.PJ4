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
    // เปิดหน้านี้ค้างไว้จนขึ้นรอบใหม่: ถ้ายังดูเดือนที่ระบบเลือกให้ ให้เลื่อนไปเดือนปัจจุบัน
    if (PER == PERA) PER = PERA = pcur();
    R();
  } else MK = k;
}
setInterval(mtick, 30000);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) mtick();
});
// เลขก่อนหน้า (ล็อก ไม่ให้พิมพ์แก้)
// - บิลแรกของสัญญา: เลขมิเตอร์ตอนย้ายเข้า (ไม่รวมไฟของผู้เช่าคนก่อน/ช่วงห้องว่าง)
// - ต่อจากนั้น: เลขล่าสุดของบิลล่าสุดของห้อง (รวมบิลย้ายออก)
const cBills = (t, n) =>
  D.inv.filter(i => i.uid == t.id && i.room == n && !i.fin && (i.iss || 0) >= (t.cs || 0) - 864e5);
function pvOf(r) {
  const t = act(r.n);
  if (t && t.sm != null && !cBills(t, r.n).length) return t.sm;
  const l = D.inv
    .filter(i => i.room == r.n)
    .sort((a, b) => (a.per < b.per ? 1 : a.per > b.per ? -1 : (b.iss || 0) - (a.iss || 0)))[0];
  return l ? l.pv + l.u : r.m;
}
// บิลสุดท้ายตอนย้ายออก: ค่าไฟจากเลขก่อนหน้าถึงเลขตอนย้ายออก (ไม่มีค่าเช่า)
// เรียกก่อนตั้งสถานะย้ายออก (ผู้เช่ายังเป็นผู้เช่าปัจจุบันของห้อง)
function finBill(u, end) {
  const r = D.rooms.find(x => x.n == u.room);
  if (!r || end == null) return null;
  const p0 = pvOf(r),
    units = end - p0;
  r.m = end;
  if (units <= 0) return null;
  const d = bk(),
    per = d.getFullYear() + '-' + pad(d.getMonth() + 1);
  let id = 'INV' + per.replace('-', '') + '-' + r.n + '-F' + pad(d.getDate());
  if (D.inv.some(i => i.id == id)) id += '-' + Date.now().toString(36).slice(-3);
  const inv = {
    id,
    room: r.n,
    uid: u.id,
    per,
    pv: p0,
    u: units,
    el: elc(units),
    x: 0,
    xn: '',
    rent: 0,
    fine: 0,
    s: 'unpaid',
    iss: Date.now(),
    fin: 1,
  };
  if (u._cid) inv._cid = u._cid;
  D.inv.push(inv);
  return inv;
}
function lv(n) {
  const r = D.rooms.find(x => x.n == n),
    v = $('#m' + n).value,
    u = v === '' ? null : +v - pvOf(r),
    x = +$('#x' + n).value || 0,
    el = u == null || u < 0 ? null : elc(u);
  $('#u' + n).textContent = u == null ? '-' : u;
  $('#a' + n).textContent = el == null ? '-' : '฿' + fm(el);
  $('#t' + n).textContent = el == null ? '-' : '฿' + fm(el + x + D.set.rent);
}
function iss() {
  if (plock(PER)) return alert(LKM(PER));
  const [y, m] = PER.split('-').map(Number);
  if (bk() < new Date(y, m - 1, 27))
    return cf('ยังไม่ถึงวันจดมิเตอร์ (27) ต้องการออกบิลต่อหรือไม่?', iss2);
  iss2();
}
function iss2() {
  let c = 0;
  if (plock(PER)) return alert(LKM(PER));
  // ตรวจทุกห้องให้ผ่านก่อน แล้วค่อยออกบิล (เดิมออกบิลห้องแรก ๆ ไปแล้วค่อยเจอห้องที่ผิด ข้อมูลค้างครึ่งทาง)
  const todo = [];
  for (const r of D.rooms.filter(r => tn(r.n))) {
    const el = $('#m' + r.n);
    if (!el || el.value.trim() === '') continue;
    // ห้องที่มีบิลรอบนี้แล้ว ข้าม (กันออกบิลซ้ำ)
    if (D.inv.some(i => i.room == r.n && i.per == PER && !i.fin)) continue;
    const raw = el.value.trim().replace(/,/g, ''),
      v = Number(raw),
      p0 = pvOf(r),
      xe = $('#x' + r.n),
      xr = xe ? xe.value.trim().replace(/,/g, '') : '',
      x = xr === '' ? 0 : Number(xr);
    if (D.inv.some(i => i.room == r.n && i.per > PER && !i.fin))
      return alert('ห้อง ' + r.n + ': มีบิลของเดือนถัดไปออกแล้ว ไม่สามารถออกบิลย้อนหลังได้');
    if (!/^\d+$/.test(raw)) return alert('ห้อง ' + r.n + ': เลขมิเตอร์ต้องเป็นจำนวนเต็ม');
    if (v < p0) return alert('ห้อง ' + r.n + ': เลขมิเตอร์ต้องไม่น้อยกว่าเดิม (' + p0 + ')');
    if (!(x >= 0)) return alert('ห้อง ' + r.n + ': ค่าใช้จ่ายเพิ่มเติมต้องเป็นตัวเลขและไม่ติดลบ');
    todo.push({ r, v, p0, x });
  }
  for (const { r, v, p0, x } of todo) {
    D.inv.push({
      id: 'INV' + PER.replace('-', '') + '-' + r.n,
      room: r.n,
      uid: act(r.n).id,
      per: PER,
      dd: (() => {
        const [y, m] = PER.split('-').map(Number),
          d = new Date(y, m, D.set.due);
        return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
      })(),
      pv: p0,
      u: v - p0,
      el: elc(v - p0),
      x,
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
    tt('✓ ออกใบแจ้งหนี้ ' + c + ' ห้อง');
    R();
  } else alert('ยังไม่ได้กรอกเลขมิเตอร์ใหม่');
}
