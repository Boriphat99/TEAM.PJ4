/* 28_move_in_out.js — จดเลขมิเตอร์ตอนย้ายเข้า/ย้ายออก (ผู้ดูแล)
   - ย้ายเข้า: ทุกเส้นทาง (เพิ่มผู้เช่าใหม่ / จัดผู้เช่าเข้าห้อง / ย้ายห้อง) ต้องกรอกเลขมิเตอร์ตอนเข้าพัก
     บิลแรกของสัญญาจะคิดค่าไฟจากเลขนี้ (ไม่รวมไฟของผู้เช่าคนก่อน/ช่วงห้องว่าง)
   - ย้ายออก: กรอกเลขมิเตอร์ตอนย้ายออก → ออกบิลสุดท้าย (ค่าไฟอย่างเดียว) ให้ชำระเงินสด/QR ได้ตามปกติ
     เว้นว่างได้ = ไม่ออกบิลสุดท้าย
   ใช้ร่วมกับ pvOf() / finBill() ใน 14_admin_meter_billing.js */

// ---------- ช่องกรอกเลขมิเตอร์ตอนย้ายเข้า ----------
const smDef = n => {
  const r = D.rooms.find(x => x.n == n);
  return r ? pvOf(r) : 0;
};
const smIn = (id, n) =>
  `<label>เลขมิเตอร์ตอนย้ายเข้า *</label><input id="${id}" type="number" inputmode="numeric" min="0" step="1" value="${smDef(n)}"><small class="mu">จดจากมิเตอร์จริงในวันที่เข้าพัก · บิลแรกจะคิดค่าไฟจากเลขนี้</small>`;
// ตรวจเลขย้ายเข้า: จำนวนเต็ม และไม่น้อยกว่าเลขล่าสุดที่ระบบรู้ของห้องนั้น
function smRead(id, n) {
  const el = $('#' + id);
  if (!el || el.value === '') {
    alert('กรุณากรอกเลขมิเตอร์ตอนย้ายเข้า');
    return null;
  }
  const v = +el.value,
    p0 = smDef(n);
  if (!Number.isInteger(v) || v < 0) {
    alert('เลขมิเตอร์ต้องเป็นจำนวนเต็มไม่ติดลบ');
    return null;
  }
  if (v < p0) {
    alert('เลขมิเตอร์ตอนย้ายเข้าต้องไม่น้อยกว่าเลขล่าสุดของห้อง ' + n + ' (' + p0 + ')');
    return null;
  }
  return v;
}

// ---------- หน้าต่างย้ายออก ----------
let MVO = null;
function mvo(id, after, title) {
  const u = D.users.find(x => x.id == id);
  if (!u || !u.room) return;
  const r = D.rooms.find(x => x.n == u.room),
    p0 = pvOf(r),
    k = D.inv.filter(i => (i.uid ? i.uid == id : i.room == u.room) && i.s != 'paid').length;
  MVO = { id, after, p0 };
  mo(`<h3>${title || 'ย้ายออก'} · ห้อง ${u.room}</h3><div class="mu" style="font-size:13px;margin-bottom:4px">${e(u.name)}</div>
    <label>เลขมิเตอร์ตอนย้ายออก</label><input id="mo_m" type="number" inputmode="numeric" min="${p0}" step="1" placeholder="ไม่น้อยกว่า ${p0}" oninput="mvoCalc()">
    <div class="bd mu" style="margin-top:10px"><span>เลขก่อนหน้า 🔒</span><span>${p0}</span></div>
    <div class="bd mu"><span>หน่วยที่ใช้</span><span id="mo_u">-</span></div>
    <div class="bd"><span>ค่าไฟช่วงสุดท้าย</span><b id="mo_a">-</b></div>
    <small class="mu">ระบบจะออกบิลสุดท้าย (ค่าไฟอย่างเดียว) ให้ผู้เช่าชำระเงินสดหรือผ่าน QR · เว้นว่าง = ไม่ออกบิลสุดท้าย</small>
    ${k ? `<div class="note">มีบิลค้างชำระ ${k} รายการ จะยังอยู่ในประวัติของผู้เช่าคนนี้</div>` : ''}
    <div class="acts" style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;margin-top:14px">
      <button class="b b2" onclick="cm()">ยกเลิก</button>
      <button class="b" onclick="mvoGo()">ยืนยันย้ายออก</button>
    </div>`);
}
function mvoCalc() {
  if (!MVO) return;
  const v = $('#mo_m').value,
    n = v === '' ? null : +v - MVO.p0;
  $('#mo_u').textContent = n == null ? '-' : n < 0 ? 'ต้องไม่น้อยกว่า ' + MVO.p0 : n;
  $('#mo_a').textContent = n == null || n < 0 ? '-' : '฿' + fm(elc(n));
}
function mvoGo() {
  if (!MVO) return;
  const { id, after, p0 } = MVO,
    u = D.users.find(x => x.id == id),
    v = $('#mo_m').value;
  let end = null;
  if (v !== '') {
    end = +v;
    if (!Number.isInteger(end) || end < p0)
      return alert('เลขมิเตอร์ตอนย้ายออกต้องเป็นจำนวนเต็มและไม่น้อยกว่าเลขก่อนหน้า (' + p0 + ')');
  }
  const room = u.room,
    f = end == null ? null : finBill(u, end);
  if (end != null) u.em = end;
  u.out = Date.now();
  lg('ย้ายออก ห้อง ' + room + (f ? ' · ออกบิลสุดท้าย ' + f.id : ''));
  MVO = null;
  after(f, room);
}
const mvoMsg = (room, f) =>
  '✓ ย้ายออกแล้ว ห้อง ' + room + ' ว่าง' + (f ? ' · ออกบิลสุดท้าย ฿' + fm(f.el) : '');

// ปุ่ม "ย้ายออก" (หน้าผู้เช่า)
function mv(id) {
  mvo(id, (f, room) => {
    save();
    cm();
    R();
    tt(mvoMsg(room, f));
  });
}

// ย้ายกลับเข้าพัก: ยกเลิกบิลสุดท้ายที่ยังไม่ชำระ และคืนเลขมิเตอร์ของห้อง
function undoOut(u) {
  const fs = D.inv.filter(i => i.uid == u.id && i.fin && i.s == 'unpaid');
  fs.forEach(i => {
    const r = D.rooms.find(x => x.n == i.room);
    if (r && r.m == i.pv + i.u) r.m = i.pv;
  });
  D.inv = D.inv.filter(i => !fs.includes(i));
  delete u.em;
  delete u.out;
  return fs.length;
}
function rv(id) {
  const u = D.users.find(x => x.id == id),
    rr = D.rooms.find(x => x.n == u.room);
  if (act(u.room)) return alert('ห้อง ' + u.room + ' มีผู้เช่าอยู่แล้ว');
  if (rr.st)
    return alert('ห้อง ' + u.room + ' ไม่ว่าง/ปิดปรับปรุง กรุณาเปลี่ยนสถานะห้องเป็นว่างก่อน');
  const k = D.inv.filter(i => i.uid == u.id && i.fin && i.s == 'unpaid').length,
    run = () => {
      undoOut(u);
      lg('ย้ายกลับเข้าพัก ห้อง ' + u.room);
      save();
      R();
      tt('✓ ย้ายกลับเข้าพักแล้ว');
    };
  if (k) return cf('ย้ายกลับเข้าพัก ห้อง ' + u.room + '?\nบิลย้ายออกที่ยังไม่ชำระจะถูกยกเลิก', run);
  run();
}

// ---------- จัดผู้เช่า (ที่ยังไม่มีห้อง) เข้าห้อง ----------
function asg(uid, n) {
  const u = D.users.find(x => x.id == uid),
    r = D.rooms.find(x => x.n == n);
  if (!u || !r) return;
  if (!vac(r)) return alert('ห้องนี้ไม่ว่างแล้ว');
  const sm = smRead('as_m', n);
  if (sm == null) return;
  u.room = n;
  u.cs = Date.now();
  u.sm = sm;
  delete u.em;
  lg('จัดห้อง ' + n + ' ให้ ' + u.name);
  save();
  cm();
  R();
  tt('✓ จัดห้อง ' + n + ' ให้ ' + u.name + ' แล้ว');
}
function asr(uid, n0) {
  const u = D.users.find(x => x.id == uid),
    f = D.rooms.filter(vac);
  if (!f.length) return alert('ไม่มีห้องว่างสำหรับเพิ่มผู้เช่า');
  const n = f.some(r => r.n == n0) ? n0 : f[0].n;
  mo(
    `<h3>จัดห้องให้ ${e(u.name)}</h3><div class="mu" style="font-size:13px;margin-bottom:4px">${e(u.tel || u.email)}</div><label>เลือกห้องว่าง</label><select id="as_r" onchange="$('#as_m').value=smDef(+this.value)">${f.map(r => `<option ${r.n == n ? 'selected' : ''}>${r.n}</option>`).join('')}</select>${smIn('as_m', n)}<div style="margin-top:12px"><button class="b" onclick="asg(${uid},+$('#as_r').value)">จัดห้อง</button> <button class="b b2" onclick="cm()">ยกเลิก</button></div>`
  );
}

// ---------- ย้ายห้อง (ผู้เช่าที่มีห้องอยู่แล้ว) ----------
let MVR = null;
function mvr(id, to) {
  const u = D.users.find(x => x.id == id),
    r = D.rooms.find(x => x.n == u.room),
    p0 = pvOf(r);
  MVR = { id, to, p0 };
  mo(`<h3>ย้ายห้อง ${u.room} → ${to}</h3><div class="mu" style="font-size:13px;margin-bottom:4px">${e(u.name)}</div>
    <div class="atf-sec" style="margin-top:12px"><b>ห้องเดิม ${u.room}</b>
      <label>เลขมิเตอร์ตอนย้ายออก</label><input id="mr_o" type="number" inputmode="numeric" min="${p0}" step="1" placeholder="ไม่น้อยกว่า ${p0}">
      <small class="mu">เลขก่อนหน้า ${p0} · ระบบออกบิลสุดท้าย (ค่าไฟอย่างเดียว) ของห้องเดิม · เว้นว่าง = ไม่ออกบิล</small>
    </div>
    <div class="atf-sec" style="margin-top:12px"><b>ห้องใหม่ ${to}</b>${smIn('mr_n', to)}</div>
    <div class="acts" style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;margin-top:14px">
      <button class="b b2" onclick="cm()">ยกเลิก</button>
      <button class="b" onclick="mvrGo()">ยืนยันย้ายห้อง</button>
    </div>`);
}
function mvrGo() {
  if (!MVR) return;
  const { id, to, p0 } = MVR,
    u = D.users.find(x => x.id == id),
    v = $('#mr_o').value;
  let end = null;
  if (v !== '') {
    end = +v;
    if (!Number.isInteger(end) || end < p0)
      return alert('เลขมิเตอร์ตอนย้ายออกต้องเป็นจำนวนเต็มและไม่น้อยกว่าเลขก่อนหน้า (' + p0 + ')');
  }
  const tr = D.rooms.find(x => x.n == to);
  if (!tr || !vac(tr)) return alert('ห้อง ' + to + ' ไม่ว่างแล้ว');
  const sm = smRead('mr_n', to);
  if (sm == null) return;
  const from = u.room,
    f = end == null ? null : finBill(u, end);
  u._oldem = end;
  u.room = to;
  u.cs = Date.now();
  u.sm = sm;
  delete u.em;
  lg('ย้ายห้อง ' + from + ' → ' + to + ' ' + u.name + (f ? ' · ออกบิลสุดท้าย ' + f.id : ''));
  MVR = null;
  save();
  cm();
  R();
  tt('✓ ย้ายห้อง ' + from + ' → ' + to + ' แล้ว' + (f ? ' · ออกบิลสุดท้าย ฿' + fm(f.el) : ''));
}
