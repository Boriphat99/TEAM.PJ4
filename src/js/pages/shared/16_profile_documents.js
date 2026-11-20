/* 16_profile_documents.js — โปรไฟล์/รูป, เอกสารใบแจ้งหนี้-ใบเสร็จ, สัญญา, ส่งออก CSV
   (แยกมาจาก script.js บรรทัด 1153-1210; โหลดเรียงตามเลขหน้าชื่อไฟล์ใน index.html) */
pg.prof = () => {
  const ad = U.role != 'tenant';
  return `<h2>โปรไฟล์ของฉัน</h2><p class="mu">ดูและแก้ไขข้อมูลส่วนตัว</p><div class="pf" style="margin-top:14px"><div class="cd" style="text-align:center;display:grid;gap:10px;justify-items:center;align-content:start">${av(U, 120)}<h3>${e(U.name)}</h3><span class="pl ${ad ? 'p' : 'g'}">${U.role == 'owner' ? 'เจ้าของกิจการ' : ad ? 'ผู้ดูแลระบบ' : 'ผู้เช่า'}</span>${ad ? '' : `<p class="mu" style="margin:0">${U.room ? 'ห้อง ' + U.room : 'รอผู้ดูแลจัดห้อง'}<br>เงินแรกเข้า ฿${fm(D.set.dep)}</p>`}<input type="file" id="pf" accept="image/jpeg,image/png,image/webp" hidden onchange="pa(this)"><div><button class="b" onclick="$('#pf').click()">เปลี่ยนรูปโปรไฟล์</button>${U.av ? ` <button class="b b2" onclick="pr()">ลบรูป</button>` : ''}</div><small class="mu">JPG / PNG / WebP · ไม่เกิน 5MB · ครอปรูปได้ก่อนบันทึก</small></div>
<div style="display:grid;gap:14px"><div class="cd"><h3>การแสดงผล</h3><br><div class="bd" style="margin-bottom:16px"><b>ภาษา</b><span class="seg"><span class="${LANG == 'th' ? 'on' : ''}" onclick="setPf('lang','th')">TH</span><span class="${LANG == 'en' ? 'on' : ''}" onclick="setPf('lang','en')">EN</span></span></div><div class="bd"><b>${document.documentElement.dataset.theme == 'dark' ? 'โหมดกลางคืน' : 'โหมดกลางวัน'}</b><div class="tsw ${document.documentElement.dataset.theme == 'dark' ? 'on' : ''}" role="switch" onclick="setPf('theme','${document.documentElement.dataset.theme == 'dark' ? 'light' : 'dark'}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg><svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg><i></i></div></div></div><div class="cd"><h3>ข้อมูลส่วนตัว</h3><br><label>ชื่อ - นามสกุล</label><input id="p_n" value="${e(U.name)}"><div class="row"><div><label>เบอร์โทร</label><input id="p_t" value="${e(U.tel || '')}" placeholder="08x-xxx-xxxx"></div><div><label>อีเมล</label><input id="p_e" value="${e(U.email)}"></div></div><label>เพศ</label><select id="p_g">${['', 'ชาย', 'หญิง', 'อื่นๆ'].map(v => `<option value="${v}" ${U.g == v ? 'selected' : ''}>${v || 'ไม่ระบุ'}</option>`).join('')}</select>${ad ? '' : `<label>ห้องพัก (แก้ไขได้โดยผู้ดูแล)</label><input value="${U.room || 'รอผู้ดูแลจัดห้อง'}" disabled>`}<button class="b" onclick="ps()">บันทึกข้อมูล</button></div>
<div class="cd"><h3>เปลี่ยนรหัสผ่าน</h3><br><label>รหัสผ่านปัจจุบัน</label><input id="p_o" type="password"><div class="row"><div><label>รหัสผ่านใหม่ (อย่างน้อย 8 ตัว)</label><input id="p_w" type="password"></div><div><label>ยืนยันรหัสผ่านใหม่</label><input id="p_c" type="password"></div></div><button class="b b2" onclick="pc()">เปลี่ยนรหัสผ่าน</button></div></div></div>`;
};
let CR = null;
function pa(el) {
  const f = el.files[0];
  el.value = '';
  if (!f) return;
  if (!/^image\/(jpeg|png|webp)$/.test(f.type)) return alert('รองรับเฉพาะไฟล์ JPG / PNG / WebP');
  if (f.size > 5 * 1024 * 1024) return alert('ไฟล์ใหญ่เกิน 5MB กรุณาเลือกรูปที่เล็กกว่านี้');
  const rd = new FileReader();
  rd.onload = () => {
    const m = new Image();
    m.onload = () => {
      const z = Math.max(280 / m.width, 280 / m.height);
      CR = { m, s: z, min: z, x: (280 - m.width * z) / 2, y: (280 - m.height * z) / 2 };
      mo(
        `<h3>ครอปรูปโปรไฟล์</h3><small class="mu">ลากเพื่อจัดตำแหน่ง · เลื่อนแถบเพื่อซูม</small><canvas id="cvx" width="280" height="280" style="width:100%;max-width:280px;display:block;margin:12px auto;border-radius:12px;touch-action:none;cursor:grab"></canvas><label>ซูม</label><input id="czs" type="range" min="1" max="4" step="0.01" value="1" oninput="crz(this.value)"><button class="b" onclick="crs()">ใช้รูปนี้</button> <button class="b b2" onclick="CR=null;cm()">ยกเลิก</button>`
      );
      const c = $('#cvx');
      c.onpointerdown = e => {
        c.setPointerCapture(e.pointerId);
        CR.d = [e.clientX, e.clientY];
      };
      c.onpointermove = e => {
        if (!CR || !CR.d) return;
        const k = 280 / c.getBoundingClientRect().width;
        CR.x += (e.clientX - CR.d[0]) * k;
        CR.y += (e.clientY - CR.d[1]) * k;
        CR.d = [e.clientX, e.clientY];
        crd();
      };
      c.onpointerup = c.onpointercancel = () => {
        if (CR) CR.d = null;
      };
      crd();
    };
    m.src = rd.result;
  };
  rd.readAsDataURL(f);
}
function crd() {
  const c = $('#cvx');
  if (!c || !CR) return;
  const x = c.getContext('2d'),
    m = CR.m;
  CR.x = Math.min(0, Math.max(280 - m.width * CR.s, CR.x));
  CR.y = Math.min(0, Math.max(280 - m.height * CR.s, CR.y));
  x.clearRect(0, 0, 280, 280);
  x.drawImage(m, CR.x, CR.y, m.width * CR.s, m.height * CR.s);
  x.fillStyle = 'rgba(0,0,0,.58)';
  x.beginPath();
  x.rect(0, 0, 280, 280);
  x.moveTo(270, 140);
  x.arc(140, 140, 130, 0, Math.PI * 2, true);
  x.closePath();
  x.fill('evenodd');
  x.strokeStyle = '#fff';
  x.lineWidth = 2;
  x.beginPath();
  x.arc(140, 140, 130, 0, Math.PI * 2);
  x.stroke();
}
function crz(v) {
  const o = CR.s;
  CR.s = CR.min * v;
  const k = CR.s / o;
  CR.x = 140 - (140 - CR.x) * k;
  CR.y = 140 - (140 - CR.y) * k;
  crd();
}
function crs() {
  const o = document.createElement('canvas');
  o.width = o.height = 256;
  o.getContext('2d').drawImage(
    CR.m,
    (10 - CR.x) / CR.s,
    (10 - CR.y) / CR.s,
    260 / CR.s,
    260 / CR.s,
    0,
    0,
    256,
    256
  );
  U.av = o.toDataURL('image/jpeg', 0.85);
  CR = null;
  lg('เปลี่ยนรูปโปรไฟล์');
  save();
  cm();
  R();
  tt('✓ เปลี่ยนรูปโปรไฟล์แล้ว');
}
function pr() {
  cf('ลบรูปโปรไฟล์?', () => {
    delete U.av;
    lg('ลบรูปโปรไฟล์');
    save();
    R();
    tt('✓ ลบรูปแล้ว');
  });
}
function ps() {
  const n = $('#p_n').value.trim(),
    m = $('#p_e').value.trim().toLowerCase(),
    t = $('#p_t').value.trim();
  if (!n || !m) return alert('กรอกชื่อและอีเมล');
  if (!/^\S+@\S+$/.test(m)) return alert('รูปแบบอีเมลไม่ถูกต้อง');
  if (D.users.some(x => x.id != U.id && x.email == m)) return alert('อีเมลนี้ถูกใช้แล้ว');
  if (t && !/^[0-9\-+ ]{9,15}$/.test(t)) return alert('เบอร์โทรไม่ถูกต้อง');
  Object.assign(U, { name: n, email: m, tel: t, g: $('#p_g').value });
  lg('แก้ไขโปรไฟล์');
  save();
  R();
  tt('✓ บันทึกข้อมูลแล้ว');
}
function pc() {
  const o = $('#p_o').value,
    w = $('#p_w').value;
  if (o != U.pw) return alert('รหัสผ่านปัจจุบันไม่ถูกต้อง');
  if (pwBad(w, U.email)) return alert(pwBad(w, U.email));
  if (w != $('#p_c').value) return alert('ยืนยันรหัสผ่านไม่ตรงกัน');
  U.pw = w;
  lg('เปลี่ยนรหัสผ่าน');
  save();
  R();
  alert('เปลี่ยนรหัสผ่านสำเร็จ\nครั้งต่อไปให้เข้าสู่ระบบด้วยรหัสผ่านใหม่');
}

const B = n =>
  '฿' + Number(n).toLocaleString(LOCF(), { minimumFractionDigits: 2, maximumFractionDigits: 2 });
// หัวกระดาษของเอกสาร (ใบแจ้งหนี้/ใบเสร็จ): โลโก้ ชื่อ ที่อยู่ เลขผู้เสียภาษี + ชื่อเอกสารด้านขวา
// ใช้ inline style ทั้งหมด เพื่อให้บันทึกเป็นรูป (html2canvas) และพิมพ์ได้เหมือนบนจอ
const DOC_C = '#8e2436';
function docHead(th, en) {
  const S = D.set,
    nm = S.name || 'T&T Mansion';
  return `<table style="width:100%;border-collapse:collapse"><tr><td style="vertical-align:top"><table style="border-collapse:collapse"><tr><td style="vertical-align:top;padding-right:10px"><img src="${LG}" alt="" width="46" height="46" style="display:block;border-radius:10px"></td><td style="vertical-align:top"><div style="font-size:17px;font-weight:700;color:${DOC_C};letter-spacing:.02em">${e(nm)}</div><div style="font-size:11px;color:#57534e;line-height:1.6">${S.addr ? e(S.addr) + '<br>' : ''}${S.tel ? 'โทร ' + e(S.tel) : ''}${S.tax ? (S.tel ? ' · ' : '') + 'เลขประจำตัวผู้เสียภาษี ' + e(S.tax) : ''}</div></td></tr></table></td><td style="vertical-align:top;text-align:right;white-space:nowrap"><div style="font-size:22px;font-weight:700;color:${DOC_C}">${th}</div><div style="font-size:11px;color:#78716c;letter-spacing:.12em;text-transform:uppercase">${en}</div></td></tr></table><div style="height:3px;background:linear-gradient(90deg,${DOC_C},#c08a3e);border-radius:2px;margin:12px 0 14px"></div>`;
}
const DOC_BOX = (h, b, pd) =>
  `<td style="width:50%;vertical-align:top;${pd}"><div style="border:1px solid #e7e0dc;border-radius:10px;padding:10px 12px;font-size:12px;color:#57534e;line-height:1.6;min-height:70px"><div style="color:#78716c">${h}</div>${b}</div></td>`;
const DOC_SIGN = (n, r) =>
  `<td style="width:50%;text-align:center;font-size:11px;color:#57534e;padding:0 14px"><div style="border-top:1px solid #a8a29e;margin:36px 0 6px"></div>( ${e(n)} )<br>${r}</td>`;
function docHTML(i, k, nl) {
  if (k == 'rcp') return rcpHTML(i);
  const S = D.set,
    u = tu(i) || {},
    nm = S.name || 'T&T Mansion',
    T = base(i),
    nf = v => Number(v).toLocaleString(LOCF(), { minimumFractionDigits: 2 }),
    rows = [
      ...(i.fin ? [] : [['ค่าเช่าห้อง (' + mon(i.per) + ')', i.rent, '']]),
      [
        'ค่าไฟฟ้า',
        i.el,
        'เลขมิเตอร์ ' +
          i.pv +
          ' ถึง ' +
          (i.pv + i.u) +
          ' ใช้ ' +
          i.u +
          ' หน่วย × ' +
          B(S.rate) +
          '/หน่วย',
      ],
    ],
    td = 'padding:8px 4px;border-bottom:1px solid #eee7e3',
    th = 'padding:6px 4px;border-bottom:2px solid #a8a29e';
  if (i.x) rows.push([i.xn || 'ค่าใช้จ่ายเพิ่มเติม', i.x, '']);
  return `<div class="doc" style="font-family:Anuphan,Tahoma,Arial,sans-serif;max-width:520px;margin:0 auto;background:#fff;color:#1c1917;padding:22px;border-radius:14px;border:1px solid #e7e0dc;text-align:left;font-size:13px">
${docHead('ใบแจ้งหนี้', 'Invoice')}
<table style="width:100%;border-collapse:collapse;font-size:12px;border:1px solid #e7e0dc;border-radius:10px"><tr style="color:#78716c"><td style="padding:8px 12px 0">เลขที่</td><td style="padding:8px 12px 0;text-align:center">รอบบิล</td><td style="padding:8px 12px 0;text-align:right">ครบกำหนดชำระ</td></tr><tr style="font-weight:700"><td style="padding:2px 12px 8px">${e(i.id)}</td><td style="padding:2px 12px 8px;text-align:center">${mlab(i)}</td><td style="padding:2px 12px 8px;text-align:right;color:${DOC_C}">${dt(due(i))}</td></tr></table>
<table style="width:100%;border-collapse:collapse;margin-top:10px"><tr>${DOC_BOX('เรียน (ผู้เช่า)', '<b style="color:#1c1917;font-size:14px">คุณ' + e(u.name || '-') + '</b><br>ห้อง ' + i.room + (u.tel ? ' · โทร ' + e(u.tel) : ''), 'padding-right:5px')}${DOC_BOX('ช่องทางชำระเงิน', 'สแกน PromptPay QR ในระบบ แล้วแนบสลิป' + (S.pp ? '<br>พร้อมเพย์ <b style="color:#1c1917">' + e(S.pp) + '</b>' : '') + '<br>หรือชำระเงินสดที่เคาน์เตอร์', 'padding-left:5px')}</tr></table>
<table style="width:100%;border-collapse:collapse;margin-top:14px;font-size:12px"><tr style="color:#78716c"><td style="${th};width:42px">ลำดับ</td><td style="${th}">รายการ</td><td style="${th};text-align:right">จำนวนเงิน (บาท)</td></tr>${rows.map((r, n) => `<tr><td style="${td};vertical-align:top">${n + 1}</td><td style="${td}">${e(r[0])}${r[2] ? '<div style="font-size:11px;color:#78716c">' + e(r[2]) + '</div>' : ''}</td><td style="${td};text-align:right;font-weight:700;vertical-align:top;font-variant-numeric:tabular-nums">${nf(r[1])}</td></tr>`).join('')}</table>
<table style="width:100%;border-collapse:collapse;margin-top:12px"><tr><td style="vertical-align:middle"><div style="font-size:15px;font-weight:700">ยอดที่ต้องชำระ</div><div style="font-size:11px;color:#78716c">(${bahtText(T)})</div></td><td style="text-align:right;vertical-align:middle;white-space:nowrap"><span style="font-size:20px;font-weight:700;color:${DOC_C};font-variant-numeric:tabular-nums">${nf(T)} บาท</span></td></tr></table>
<div style="background:#fbf3ea;border:1px solid #f0dfc8;border-radius:10px;padding:10px 12px;margin-top:14px;font-size:12px;color:#7c5a1e;line-height:1.6">กรุณาชำระภายในวันที่ ${dt(due(i))} · หากชำระหลังวันครบกำหนด คิดค่าปรับวันละ ${fm(S.fpd || 50)} บาท สูงสุดไม่เกิน ${fm(S.max)} บาท${i.fin ? '' : ' · หากพ้นวันที่ 10 ถือว่าผิดนัดชำระตามสัญญาเช่า'}</div>
<table style="width:100%;border-collapse:collapse"><tr>${DOC_SIGN(u.name || '-', 'ผู้เช่า')}${DOC_SIGN(S.payee || nm, 'ผู้ออกใบแจ้งหนี้')}</tr></table>
<div style="text-align:center;font-size:11px;color:#a8a29e;margin-top:14px">เอกสารนี้ออกโดยระบบ ${e(nm)}</div></div>`;
}
const vi = id => {
  const i = gi(id),
    can = U && U.role == 'tenant' && i.s == 'unpaid' && mine(i),
    can2 = U && U.role == 'tenant' && i.s == 'pending' && i.mt != 'cash' && mine(i);
  mo(
    docHTML(i, 'inv', 1) +
      '<br><div class="np" style="display:flex;gap:8px;flex-wrap:wrap">' +
      (can ? `<button class="b" onclick="pm('${id}')">ชำระเงิน</button>` : '') +
      (can2 ? `<button class="b" onclick="pm('${id}')">แก้ไข/ส่งสลิปใหม่</button>` : '') +
      '<button class="b b2" onclick="cm()">ปิด</button></div>'
  );
};
pg.con = () => {
  const ad = U.role == 'admin',
    t = D.users
      .filter(u => u.role == 'tenant' && u.room && (U.role != 'tenant' || u.id == U.id))
      .sort((a, b) => !!a.out - !!b.out || a.room - b.room);
  return `<h2>สัญญาเช่า</h2><input type="file" id="cpi" accept="application/pdf" hidden onchange="cpf(this)"><p class="mu">เงินแรกเข้า ฿${fm(D.set.dep)} (มัดจำ + ค่าเช่าล่วงหน้า) บันทึกครั้งเดียว ณ วันเริ่มสัญญา</p><div class="cd sc" style="margin-top:14px"><table><tr><th>ห้อง</th><th>ผู้เช่า</th><th>เริ่มสัญญา</th><th>สิ้นสุด</th><th>เงินแรกเข้า</th><th>สถานะ</th><th>ไฟล์สัญญา (PDF)</th>${ad ? '<th></th>' : ''}</tr>${t.map(u => `<tr><td>${u.room}</td><td>${e(u.name)}</td><td>${dt(u.cs || u.id)}</td><td>${u.ce ? dt(u.ce) : 'ไม่กำหนด'}</td><td>฿${fm(D.set.dep)}</td><td>${u.out ? '<span class="pl r">สิ้นสุดสัญญา</span>' : '<span class="pl g">มีผลบังคับใช้</span>'}</td><td>${pdfc(u, ad)}</td>${ad ? `<td><button class="b b2 sm" onclick="ec(${u.id})">แก้ไขวันที่</button></td>` : ''}</tr>`).join('') || '<tr><td colspan=8 class=mu>ไม่มีข้อมูล</td></tr>'}</table></div>`;
};
const iv = ts =>
  ts ? new Date(ts - new Date(ts).getTimezoneOffset() * 6e4).toISOString().slice(0, 10) : '';
function ec(id) {
  const u = D.users.find(x => x.id == id);
  mo(
    `<h3>สัญญาเช่า ห้อง ${u.room}</h3><label>วันเริ่มสัญญา</label><input id="c_s" type="date" value="${iv(u.cs || u.id)}"><label>วันสิ้นสุดสัญญา (เว้นว่างได้)</label><input id="c_e" type="date" value="${iv(u.ce)}"><button class="b" onclick="sc2(${id})">บันทึก</button> <button class="b b2" onclick="cm()">ยกเลิก</button>`
  );
}
function sc2(id) {
  const u = D.users.find(x => x.id == id),
    a = $('#c_s').value,
    b = $('#c_e').value;
  if (!a) return alert('ระบุวันเริ่มสัญญา');
  if (b && b < a) return alert('วันสิ้นสุดต้องไม่ก่อนวันเริ่มสัญญา');
  u.cs = new Date(a).getTime();
  if (b) u.ce = new Date(b).getTime();
  else delete u.ce;
  lg('แก้ไขสัญญา ห้อง ' + u.room);
  save();
  cm();
  R();
  tt('✓ บันทึกสัญญาแล้ว');
}
function th(id) {
  const u = D.users.find(x => x.id == id),
    l = D.inv
      .filter(i => (i.uid ? i.uid == id : i.room == u.room))
      .sort((a, b) => b.per.localeCompare(a.per));
  mo(
    `<h3>ประวัติชำระ ${e(u.name)}</h3><small class="mu">ห้อง ${u.room}</small><div class="sc"><table><tr><th>รอบบิล</th><th>ยอด</th><th>สถานะ</th><th>วันที่ชำระ</th></tr>${l.map(i => `<tr><td>${mlab(i)}</td><td>฿${fm(tot(i))}</td><td>${pill(i)}</td><td>${i.paid ? dt(i.paid) : '-'}</td></tr>`).join('') || '<tr><td colspan=4 class=mu>ยังไม่มีบิล</td></tr>'}</table></div><br><button class="b b2" onclick="cm()">ปิด</button>`
  );
}
async function xc() {
  const h = [
      'เลขที่บิล',
      'ห้อง',
      'ผู้เช่า',
      'รอบบิล',
      'ค่าเช่า',
      'ค่าไฟ',
      'อื่นๆ',
      'ค่าปรับ',
      'ยอดสุทธิ',
      'สถานะ',
      'วิธีชำระ',
    ],
    q = v => '"' + String(v ?? '').replace(/"/g, '""') + '"',
    rows = D.inv.map(i => [
      i.id,
      i.room,
      (tu(i) || {}).name,
      i.per,
      i.rent,
      i.el,
      i.x || 0,
      tot(i) - base(i),
      tot(i),
      SL[st(i)][0],
      i.mt || '',
    ]),
    txt = '\ufeff' + [h, ...rows].map(x => x.map(q).join(',')).join('\n'),
    blob = new Blob([txt], { type: 'text/csv;charset=utf-8' });
  let dl = null;
  try {
    dl = window.claude && (await claude.use('downloads'));
  } catch (x) {}
  if (dl) {
    try {
      await dl.save({ filename: 'ttm-report.csv', data: blob });
      tt('✓ ส่งออกแล้ว');
      return;
    } catch (x) {
      if (x && x.code == 'declined') return;
    }
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'ttm-report.csv';
  a.click();
}
function cwh(ev) {
  const w = ev.target.closest && ev.target.closest('.cw');
  document.querySelectorAll('.cw.on').forEach(x => {
    if (x !== w) {
      x.classList.remove('on');
      x.querySelector('.tp').style.display = 'none';
      x.querySelectorAll('.hv,.hd').forEach(n => n.setAttribute('opacity', 0));
    }
  });
  if (!w) return;
  const sv = w.querySelector('svg'),
    r = sv.getBoundingClientRect(),
    v = JSON.parse(w.dataset.v),
    l = JSON.parse(w.dataset.l),
    n = v.length,
    mx = Math.max(...v, 1),
    px = ((ev.clientX - r.left) / r.width) * 600,
    X = i => 70 + 520 * (n > 1 ? i / (n - 1) : 0.5);
  let k = 0,
    bd = 1e9;
  for (let i = 0; i < n; i++) {
    const d = Math.abs(X(i) - px);
    if (d < bd) {
      bd = d;
      k = i;
    }
  }
  const cx = X(k),
    cy = 8 + 166 * (1 - v[k] / mx),
    hv = w.querySelector('.hv'),
    hd = w.querySelector('.hd'),
    tp = w.querySelector('.tp');
  hv.setAttribute('x1', cx);
  hv.setAttribute('x2', cx);
  hv.setAttribute('opacity', 1);
  hd.setAttribute('cx', cx);
  hd.setAttribute('cy', cy);
  hd.setAttribute('opacity', 1);
  tp.innerHTML = `<b>${l[k]}</b><div><i style="background:${w.dataset.c}"></i>${w.dataset.n} <b>฿${fm(v[k])}</b></div>`;
  tp.style.display = 'block';
  w.classList.add('on');
  const tw = tp.offsetWidth,
    lx = (cx / 600) * r.width;
  tp.style.left = Math.max(0, Math.min(r.width - tw, lx - tw / 2)) + 'px';
  tp.style.top = Math.max(0, (cy / 200) * r.height - tp.offsetHeight - 14) + 'px';
}
['pointermove', 'pointerdown'].forEach(t => document.addEventListener(t, cwh));
document.addEventListener('mouseout', ev => {
  if (!ev.relatedTarget) cwh({ target: document.body });
});
