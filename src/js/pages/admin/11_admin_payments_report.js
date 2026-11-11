/* 11_admin_payments_report.js — ผู้ดูแล: ตารางบิล อนุมัติ/ปฏิเสธสลิป รับเงินสด รายงาน
   (แยกมาจาก script.js บรรทัด 952-987; โหลดเรียงตามเลขหน้าชื่อไฟล์ใน index.html) */
// ---- admin pages ----
const FL = [
  ['all', 'ทั้งหมด'],
  ['paid', 'ชำระแล้ว'],
  ['pending', 'รอตรวจสอบ'],
  ['unpaid', 'ยังไม่ชำระ'],
  ['over', 'ผิดนัดชำระ'],
];
const flt = () =>
  `<div class="fl">${FL.map(f => `<button class="b ${F == f[0] ? '' : 'b2'}" onclick="F='${f[0]}';R()">${f[1]}</button>`).join('')}</div>`;
function tbl() {
  const ro = U && U.role == 'owner',
    q = Q.toLowerCase(),
    l = D.inv
      .filter(
        i =>
          (F == 'all' || st(i) == F) &&
          (!q || (i.id + i.room + ((tu(i) || {}).name || '')).toLowerCase().includes(q))
      )
      .sort((a, b) => b.per.localeCompare(a.per) || a.room - b.room);
  return `<div class="sc"><table><tr><th>เลขที่</th><th>ห้อง</th><th>ผู้เช่า</th><th>รอบบิล</th><th>ยอดสุทธิ</th><th>ครบกำหนด</th><th>วิธีชำระ</th><th>สถานะ</th><th></th></tr>${
    l
      .map(i => {
        const s = st(i);
        return `<tr><td>${i.id}</td><td>${i.room}</td><td>${e((tu(i) || {}).name)}</td><td>${mon(i.per)}</td><td>฿${fm(tot(i))}</td><td>${dt(due(i))}</td><td>${i.mt == 'qr' ? 'QR' : i.mt == 'cash' ? 'เงินสด' : '-'}</td><td>${pill(i)}</td><td>${s == 'pending' ? `${i.slip ? `<button class="b b2 sm" onclick="vs('${i.id}')">สลิป</button> ` : ''}${ro ? '' : `<button class="b sm" onclick="ap('${i.id}',1)">อนุมัติ</button> <button class="b b2 sm" onclick="ap('${i.id}',0)">ปฏิเสธ</button>`}` : s == 'paid' ? `${ro && i.slip ? `<button class="b b2 sm" onclick="vs('${i.id}')">สลิป</button> ` : ''}<button class="b b2 sm" onclick="rc('${i.id}')">ใบเสร็จ</button>` : `<button class="b b2 sm" onclick="vi('${i.id}')">ใบแจ้งหนี้</button>${ro ? '' : ` <button class="b b2 sm" onclick="cs('${i.id}')">รับเงินสด (เคาน์เตอร์)</button>`}`}</td></tr>`;
      })
      .join('') || '<tr><td colspan=9 class=mu>ยังไม่มีรายการ</td></tr>'
  }</table></div>`;
}
function ap(id, y) {
  const i = gi(id);
  if (y) {
    i.s = 'paid';
    i.paid = Date.now();
    i.rc = nrc();
    lg('อนุมัติ ' + id);
    mail('rcp', i);
    save();
    R();
    return;
  }
  mo(
    `<h3>ปฏิเสธสลิป ${id}</h3><small class="mu">ผู้เช่าจะเห็นเหตุผลนี้ในหน้าใบแจ้งหนี้ แล้วส่งสลิปใหม่ได้</small><label>เหตุผล</label><select id="rj_s"><option value="">— เลือกเหตุผล —</option><option>ยอดเงินไม่ตรงกับใบแจ้งหนี้</option><option>สลิปไม่ชัดเจน อ่านข้อมูลไม่ได้</option><option>สลิปไม่ใช่ของรายการนี้หรือเป็นสลิปซ้ำ</option><option>ไม่พบยอดเงินเข้าบัญชี</option><option>อื่นๆ</option></select><label>รายละเอียดเพิ่มเติม (ไม่บังคับ)</label><input id="rj_t" maxlength="120"><div style="display:flex;gap:8px;margin-top:12px"><button class="b" onclick="apr('${id}')">ยืนยันปฏิเสธ</button><button class="b b2" onclick="cm()">ยกเลิก</button></div>`
  );
}
function apr(id) {
  const i = gi(id),
    a = $('#rj_s').value,
    t = $('#rj_t').value.trim();
  if (!a) return alert('เลือกเหตุผลที่ปฏิเสธ');
  const rs = a + (t ? ' · ' + t : '');
  i._rjr = rs;
  i.rj = rs;
  i.s = 'unpaid';
  i.fine = 0;
  delete i.slip;
  delete i.mt;
  lg('ปฏิเสธ ' + id + ' (' + rs + ')');
  save();
  cm();
  R();
}
function cs(id) {
  const i = gi(id);
  cf('ยืนยันรับเงินสดห้อง ' + i.room + ' ยอด ฿' + fm(tot(i)) + '?', () => {
    i.fine = fine(i);
    i.mt = 'cash';
    i.sub = Date.now();
    i.s = 'paid';
    i.paid = Date.now();
    i.rc = nrc();
    lg('รับเงินสด ' + id);
    save();
    mail('rcp', i);
    R();
  });
}
const bar = (l, t, w, c) =>
    `<div class="bd"><small class="mu">${l}</small><b style="color:${c}">${t}</b></div><div class="pb"><i style="width:${w}%;background:${c}"></i></div>`,
  dn = p =>
    `<svg viewBox="0 0 100 100" style="width:110px;height:110px"><circle cx="50" cy="50" r="40" fill="none" stroke="#fee2e2" stroke-width="10"/><circle cx="50" cy="50" r="40" fill="none" stroke="#dc2626" stroke-width="10" stroke-linecap="${p ? 'round' : 'butt'}" stroke-dasharray="${p * 2.513} 251.3" transform="rotate(-90 50 50)"/><text x="50" y="56" text-anchor="middle" font-size="20" font-weight="700" fill="#1f2937">${p}%</text></svg>`,
  ms = p => {
    const [y, m] = p.split('-');
    return new Date(y, m - 1).toLocaleDateString(LOCF(), { month: 'short', year: 'numeric' });
  },
  lc = (v, l, c, big, nm) => {
    const W = 600,
      H = big ? 200 : 70,
      pl = big ? 70 : 4,
      pb = big ? 26 : 4,
      pt = 8,
      mx = Math.max(...v, 1),
      n = v.length,
      x = i => pl + (W - pl - 10) * (n > 1 ? i / (n - 1) : 0.5),
      y = a => pt + (H - pt - pb) * (1 - a / mx),
      pts = v.map((a, i) => x(i) + ',' + y(a)),
      id = 'g' + c.slice(1),
      area =
        'M' +
        x(0) +
        ',' +
        (H - pb) +
        ' L' +
        pts.join(' L') +
        ' L' +
        x(n - 1) +
        ',' +
        (H - pb) +
        'Z';
    return `${big ? `<div class="cw" data-v='${JSON.stringify(v)}' data-l='${JSON.stringify(l)}' data-c="${c}" data-n="${nm}">` : ''}<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;display:block"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c}" stop-opacity=".25"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></linearGradient></defs>${big ? [0, 0.5, 1].map(t => `<line x1="${pl}" x2="${W - 10}" y1="${y(mx * t)}" y2="${y(mx * t)}" stroke="#f3dcdc"/><text x="${pl - 8}" y="${y(mx * t) + 4}" text-anchor="end" font-size="11" fill="#9ca3af">฿${fm(Math.round(mx * t))}</text>`).join('') : ''}${big ? v.map((a, i) => `<line x1="${x(i)}" x2="${x(i)}" y1="${pt}" y2="${H - pb}" stroke="#f3dcdc" stroke-dasharray="3 4"/>`).join('') : ''}<path d="${area}" fill="url(#${id})"/><polyline points="${pts.join(' ')}" fill="none" stroke="${c}" stroke-width="2.5" stroke-linejoin="round"/>${big ? v.map((a, i) => `<circle cx="${x(i)}" cy="${y(a)}" r="4" fill="#fff" stroke="${c}" stroke-width="2"/><text x="${x(i)}" y="${H - 6}" text-anchor="${i == n - 1 && n > 1 ? 'end' : 'middle'}" font-size="11" fill="#6b7280">${l[i]}</text>`).join('') : ''}${big ? `<line class="hv" x1="0" x2="0" y1="${pt}" y2="${H - pb}" stroke="${c}" stroke-dasharray="4 4" opacity="0"/><circle class="hd" r="6" fill="${c}" stroke="#fff" stroke-width="2" opacity="0"/>` : ''}</svg>${big ? '<div class="tp"></div></div>' : ''}`;
  };
let RQ = '',
  RV = 0,
  TT = 'in',
  TQ = '',
  TS = '',
  RP = 'all';
const PN = () => e(D.set.name || 'T&T Mansion'),
  hdr = (ic, t, sub, act) =>
    `<div class="hd2">${ic == '▦' ? BLD(48) : `<i class="ci" style="width:44px;height:44px;font-size:20px">${ic}</i>`}<div style="flex:1"><h2>${t}</h2><p class="mu" style="margin:2px 0 6px">${sub}</p><span class="pchip">▦ ${PN()}</span></div>${act || ''}</div>`,
  dn3 = (parts, c) => {
    const t = parts.reduce((a, x) => a + x[0], 0) || 1;
    let off = 0;
    return `<svg viewBox="0 0 100 100" style="width:150px;height:150px"><circle cx="50" cy="50" r="40" fill="none" stroke="#fee2e2" stroke-width="14"/>${parts
      .map(x => {
        const l = (x[0] / t) * 251.3,
          z = `<circle cx="50" cy="50" r="40" fill="none" stroke="${x[1]}" stroke-width="14" stroke-dasharray="${l} 251.3" stroke-dashoffset="${-off}" transform="rotate(-90 50 50)"/>`;
        off += l;
        return z;
      })
      .join(
        ''
      )}<text x="50" y="55" text-anchor="middle" font-size="11" font-weight="700" fill="#1f2937">฿${fm(c)}</text></svg>`;
  };
function mnu(ev, el) {
  const m = el._m || el.querySelector('.mdd'),
    o = m.classList.contains('open');
  el._m = m;
  document.querySelectorAll('.mdd.open').forEach(x => x.classList.remove('open'));
  if (!o) {
    document.body.appendChild(m);
    const b = el.getBoundingClientRect();
    m.style.top = Math.min(b.bottom + 4, innerHeight - 170) + 'px';
    m.style.left = Math.max(8, b.right - 165) + 'px';
    m.classList.add('open');
  }
}
document.addEventListener('click', ev => {
  if (!ev.target.closest('.mm'))
    document.querySelectorAll('.mdd.open').forEach(x => x.classList.remove('open'));
});
function repTop() {
  const cur = dper(),
    I = D.inv,
    y = cur.slice(0, 4),
    d3 = new Date(+y, +cur.slice(5) - 3, 1),
    m3 = d3.getFullYear() + '-' + pad(d3.getMonth() + 1),
    ok = i =>
      RP == 'all' || (RP == 'cur' ? i.per == cur : RP == 'yr' ? i.per.startsWith(y) : i.per >= m3),
    P = I.filter(i => i.s == 'paid' && ok(i)).sort((a, b) => (b.paid || 0) - (a.paid || 0)),
    sm = (a, f) => a.reduce((t, i) => t + f(i), 0),
    T = sm(P, tot),
    rt = sm(P, i => i.rent),
    el = sm(P, i => i.el),
    ot = T - rt - el,
    A = D.users.filter(u => u.role == 'tenant' && !u.out && u.room),
    am = A.length
      ? A.reduce((t, u) => t + (Date.now() - (u.cs || u.id)) / (30.4 * 864e5), 0) / A.length
      : 0,
    dy = P.filter(i => i.paid).map(i => ({
      i,
      d: Math.round((sd(new Date(i.paid)) - due(i)) / 864e5),
    })),
    lt = dy.filter(x => x.d > 0),
    on = dy.length ? Math.round(((dy.length - lt.length) / dy.length) * 100) : 0,
    al = lt.length ? lt.reduce((t, x) => t + x.d, 0) / lt.length : 0,
    bR = {};
  P.forEach(i => (bR[i.room] = (bR[i.room] || 0) + tot(i)));
  const tp = Object.entries(bR)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5),
    tx = tp[0] ? tp[0][1] : 1,
    lr = {};
  lt.forEach(x => (lr[x.i.room] = lr[x.i.room] || []).push(x.d));
  const ls = Object.entries(lr)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 5),
    pc = v => (T ? Math.round((v / T) * 100) : 0),
    sel = [
      ['all', 'ทั้งหมด'],
      ['cur', 'รอบบิลปัจจุบัน'],
      ['3m', 'ย้อนหลัง 3 เดือน'],
      ['yr', 'ปีนี้'],
    ];
  return (
    hdr(
      '☰',
      'รายงานรายรับ',
      'สรุปรายรับที่ชำระแล้วในช่วงเวลาที่เลือก พิมพ์เป็น PDF หรือส่งออก CSV'
    ) +
    `<div class="cd" style="display:flex;gap:14px;align-items:flex-end;flex-wrap:wrap"><div><label>ช่วงเวลา</label><select onchange="RP=this.value;R()" style="margin-bottom:0;min-width:200px">${sel.map(x => `<option value="${x[0]}" ${RP == x[0] ? 'selected' : ''}>${x[1]}</option>`).join('')}</select></div><span style="flex:1"></span><button class="b b2 np" onclick="xc()">ส่งออก CSV</button><button class="b np" onclick="document.body.classList.add('pr');print();setTimeout(()=>document.body.classList.remove('pr'),600)">พิมพ์ / PDF</button></div>
<div class="s4c"><div class="cd" style="background:#fff1f1"><small class="mu">รายรับรวม</small><div class="k ac">฿${fm(T)}</div></div><div class="cd"><small class="mu">ใบที่ชำระแล้ว</small><div class="k">${P.length}</div></div><div class="cd"><small class="mu">จำนวนรอบบิล</small><div class="k">${new Set(P.map(i => i.per)).size}</div></div><div class="cd"><small class="mu">ระยะเช่าเฉลี่ย</small><div class="k">${am.toFixed(1)} <small class="mu">เดือน</small></div></div></div>
<div class="cd"><h3>รายรับตามประเภท</h3><div style="display:flex;gap:24px;align-items:center;flex-wrap:wrap;margin-top:12px"><div>${dn3(
      [
        [rt, '#dc2626'],
        [el, '#f59e0b'],
        [ot, '#9ca3af'],
      ],
      T
    )}</div><div style="flex:1;min-width:240px">${bar('ค่าเช่า ' + pc(rt) + '%', '฿' + fm(rt), pc(rt), '#dc2626')}${bar('ค่าไฟ ' + pc(el) + '%', '฿' + fm(el), pc(el), '#f59e0b')}${bar('อื่นๆ / ค่าปรับ ' + pc(ot) + '%', '฿' + fm(ot), pc(ot), '#9ca3af')}</div></div></div>
<div class="s4c"><div class="cd"><small class="mu">เฉลี่ยต่อบิล</small><div class="k">฿${fm(P.length ? Math.round(T / P.length) : 0)}</div></div><div class="cd tl2"><small class="mu">จ่ายตรงเวลา</small><div class="k" style="color:#15803d">${on}%</div><small class="mu">ช้าเฉลี่ย ${al.toFixed(1)} วัน</small></div><div class="cd tl3"><small class="mu">หน่วยไฟที่เรียกเก็บ</small><div class="k" style="color:#a16207">${fm(sm(P, i => i.u))} <small>หน่วย</small></div></div><div class="cd tl4"><small class="mu">ค่าปรับที่เก็บได้</small><div class="k" style="color:#b91c1c">฿${fm(sm(P, i => i.fine || 0))}</div></div></div>
<div class="dg2"><div class="cd"><h3 style="margin-bottom:12px">ห้องรายรับสูงสุด</h3>${tp.map((x, k) => bar(k + 1 + '  ห้อง ' + x[0], '฿' + fm(x[1]), Math.round((x[1] / tx) * 100), '#dc2626')).join('') || '<small class="mu">ยังไม่มีข้อมูล</small>'}</div><div class="cd"><h3 style="margin-bottom:12px">ห้องที่จ่ายช้า</h3>${ls.map(x => `<div class="bd"><span><b>ห้อง ${x[0]}</b><br><small class="mu">${e(tn(+x[0]) || '-')}</small></span><span style="text-align:right"><b style="color:#dc2626">${x[1].length} ครั้ง</b><br><small class="mu">ช้าเฉลี่ย ${(x[1].reduce((a, b) => a + b, 0) / x[1].length).toFixed(0)} วัน</small></span></div>`).join('') || '<small class="mu">ไม่มีห้องที่จ่ายช้า</small>'}</div></div>
<div class="cd sc" style="margin-top:14px"><h3 style="margin-bottom:10px">ใบเรียกเก็บเงินที่ชำระแล้ว</h3><table><tr><th>ชำระเมื่อ</th><th>ห้อง</th><th>ผู้เช่า</th><th>รอบบิล</th><th>จำนวนเงิน</th><th></th></tr>${P.map(i => `<tr><td>${i.paid ? dt(i.paid) : '-'}</td><td>ห้อง ${i.room}</td><td>${e((tu(i) || {}).name)}</td><td>${mon(i.per)}</td><td><b>฿${fm(tot(i))}</b></td><td><button class="b b2 sm" onclick="rc('${i.id}')">ใบเสร็จ</button></td></tr>`).join('') || '<tr><td colspan=6 class=mu>ยังไม่มีรายการ</td></tr>'}</table></div>`
  );
}
