/* 15_tenant_pay_receipt.js — ผู้เช่า: บิลของฉัน แจ้งชำระ/สลิป ใบเสร็จ
   (แยกมาจาก script.js บรรทัด 1096-1152; โหลดเรียงตามเลขหน้าชื่อไฟล์ใน index.html) */
// ---- tenant pages ----
pg.my = () => {
  const l = D.inv.filter(i => mine(i) && i.s != 'paid');
  return `<h2>ใบแจ้งหนี้ของฉัน</h2><p class="mu">${U.room ? 'ห้อง ' + U.room : 'ยังไม่ได้จัดห้อง'} · ${e(U.name)}</p>${U.room ? '' : '<div class="note">⏳ ลงทะเบียนสำเร็จแล้ว รอผู้ดูแลจัดห้องพักให้ จึงจะมีใบแจ้งหนี้</div>'}<div class="note">💵 ชำระผ่าน PromptPay QR · หากต้องการชำระเงินสด สามารถชำระได้ที่หน้าเคาน์เตอร์</div><div style="margin-top:14px;display:grid;gap:14px">${
    l
      .map(i => {
        const s = st(i);
        return `<div class="cd"><div style="display:flex;justify-content:space-between"><b>${mon(i.per)}</b>${pill(i)}</div><div class="big">฿${fm(tot(i))}</div><div class="bd mu"><span>ค่าเช่า</span><span>฿${fm(i.rent)}</span></div><div class="bd mu"><span>ค่าไฟ ${i.u} หน่วย × ${D.set.rate}</span><span>฿${fm(i.el)}</span></div>${i.x ? `<div class="bd mu"><span>${e(i.xn || 'ค่าใช้จ่ายเพิ่มเติม')}</span><span>฿${fm(i.x)}</span></div>` : ''}${tot(i) > base(i) ? `<div class="bd" style="color:#fb7185"><span>ค่าปรับ</span><span>฿${fm(tot(i) - base(i))}</span></div>` : ''}<p class="mu">ครบกำหนด ${dt(due(i))}</p>${i.s == 'unpaid' && i.rj ? `<div class="note" style="background:#fee2e2;color:#b91c1c;border-color:#fecaca">⚠ สลิปถูกปฏิเสธ: ${e(i.rj)}<br>กรุณาตรวจสอบแล้วส่งสลิปใหม่</div>` : ''}${i.s == 'pending' ? '<span class="mu">รอผู้ดูแลตรวจสอบ · ส่งสลิปผิดแก้ไขได้ก่อนผู้ดูแลยืนยัน</span> ' : ''}<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px"><button class="b" onclick="vi('${i.id}')">ดูใบแจ้งหนี้</button>${i.s == 'pending' && i.mt != 'cash' ? `<button class="b b2" onclick="pm('${i.id}')">แก้ไข/ส่งสลิปใหม่</button>` : ''}</div></div>`;
      })
      .join('') || '<div class="cd mu">ไม่มีบิลค้างชำระ 🎉</div>'
  }</div>`;
};
pg.hist = () => {
  const l = D.inv.filter(i => mine(i) && i.s == 'paid');
  return `<h2>ประวัติ & ใบเสร็จ</h2><div class="cd sc" style="margin-top:14px"><table><tr><th>รอบบิล</th><th>ยอด</th><th>วันที่ชำระ</th><th></th></tr>${l.map(i => `<tr><td>${mon(i.per)}</td><td>฿${fm(tot(i))}</td><td>${dt(i.paid)}</td><td><button class="b b2 sm rok" onclick="rc('${i.id}')">ใบเสร็จ</button></td></tr>`).join('') || '<tr><td colspan=4 class=mu>ยังไม่มีประวัติ</td></tr>'}</table></div>`;
};
const fz = i => (i.s == 'pending' ? i.fine || 0 : fine(i)); // ส่งสลิปใหม่: ค่าปรับคงตามวันที่แจ้งชำระครั้งแรก
function pm(id) {
  const i = gi(id),
    pd = i.s == 'pending',
    f = fz(i),
    t = base(i) + f;
  SLIP = null;
  mo(`<div class="mh"><h3>${pd ? 'แก้ไขสลิป · ส่งสลิปใหม่' : 'ชำระเงินผ่าน PromptPay'}</h3><span class="mu">${i.id}</span></div>
 <div class="amt"><small>ยอดที่ต้องชำระ</small><div class="big">฿${fm(t)}</div><small>ครบกำหนด ${dt(due(i))}${late(i) > 0 ? ` · <b style="color:#fb7185">เลยกำหนด ${late(i)} วัน</b>` : ''}</small></div>
 <div class="bk"><div class="bd"><span>ค่าเช่า</span><span>฿${fm(i.rent)}</span></div><div class="bd"><span>ค่าไฟ ${i.u} หน่วย</span><span>฿${fm(i.el)}</span></div>${i.x ? `<div class="bd"><span>${e(i.xn || 'ค่าใช้จ่ายเพิ่มเติม')}</span><span>฿${fm(i.x)}</span></div>` : ''}${f ? `<div class="bd" style="color:#fb7185"><span>ค่าปรับ (นับถึงวันที่แจ้งชำระ)</span><span>฿${f}</span></div>` : ''}</div>
 ${pd ? '<div class="note">ผู้ดูแลยังไม่ได้ยืนยัน จึงส่งสลิปใหม่ได้ · เมื่อผู้ดูแลยืนยันแล้วจะแก้ไขไม่ได้</div>' : ''}${!pd && i.rj ? `<div class="note" style="background:#fee2e2;color:#b91c1c;border-color:#fecaca">⚠ สลิปครั้งก่อนถูกปฏิเสธ: ${e(i.rj)}</div>` : ''}<div class="st"><b>1</b> สแกน QR ด้วยแอปธนาคาร</div><div class="qrc"><div class="qr" id="qr"></div><small class="mu">ยอดเงินจะขึ้นอัตโนมัติ ไม่ต้องกรอกเอง</small></div>
 <div class="st"><b>2</b> อัปโหลดสลิปโอนเงิน (JPG/PNG)</div><input type="file" id="sf" accept="image/jpeg,image/png" onchange="sl(this)">
 <button class="b" style="width:100%" onclick="sub('${id}')">${pd ? 'ส่งสลิปใหม่' : 'แจ้งชำระเงิน'}</button>
 <div class="note">💵 หากต้องการชำระเงินสด สามารถชำระได้ที่หน้าเคาน์เตอร์</div>
 <button class="b b2 sm" style="margin-top:8px" onclick="vi('${id}')">‹ กลับไปดูใบแจ้งหนี้</button>`);
  tm(id);
}
function tm(id) {
  const i = gi(id);
  try {
    const k = qrcode(0, 'M');
    k.addData(ppay(D.set.pp, base(i) + fz(i)));
    k.make();
    $('#qr').innerHTML = k.createSvgTag(5, 2);
  } catch (x) {
    $('#qr').textContent = 'สร้าง QR ไม่สำเร็จ';
  }
}
function sl(el) {
  const f = el.files[0];
  if (!f) return;
  if (!/^image\/(jpeg|png)$/.test(f.type) || f.size > 8e6) {
    el.value = '';
    return alert('รองรับเฉพาะ JPG/PNG ไม่เกิน 8MB');
  }
  const r = new FileReader();
  r.onload = () => {
    const m = new Image();
    m.onload = () => {
      const k = Math.min(1, 800 / Math.max(m.width, m.height)),
        c = document.createElement('canvas');
      c.width = m.width * k;
      c.height = m.height * k;
      c.getContext('2d').drawImage(m, 0, 0, c.width, c.height);
      SLIP = c.toDataURL('image/jpeg', 0.7);
    };
    m.src = r.result;
  };
  r.readAsDataURL(f);
}
function sub(id) {
  const i = gi(id);
  if (!SLIP) return alert('กรุณาอัปโหลดสลิปโอนเงิน');
  if (i.s != 'pending') i.fine = fine(i);
  delete i.rj;
  i.mt = 'qr';
  i.sub = Date.now();
  i.slip = SLIP;
  i.s = 'pending';
  lg('แจ้งชำระ ' + id);
  save();
  cm();
  R();
  tt('✓ แจ้งชำระเงินแล้ว รอผู้ดูแลตรวจสอบ');
}
const ch = g => {
  const k = Object.keys(g).sort().slice(-6),
    m = Math.max(1, ...k.map(x => g[x].t));
  return k.length
    ? `<div class="cd" style="margin-top:14px"><h3>รายได้ 6 เดือนล่าสุด</h3><br>${k.map(x => `<div class="bd"><small class="mu" style="width:110px">${mon(x)}</small><div class="pb" style="flex:1;margin:8px 10px"><i style="width:${Math.round((g[x].p / m) * 100)}%"></i></div><small>฿${fm(g[x].p)}</small></div>`).join('')}<small class="mu">แถบ = ยอดที่ชำระแล้วเทียบกับยอดรวมสูงสุดของเดือน</small></div>`
    : '';
};
const nrc = () => {
  if (SBON) return '(กำลังออกเลขที่)';
  const d = new Date();
  return (
    'RC' +
    d.getFullYear() +
    pad(d.getMonth() + 1) +
    '-' +
    String(D.inv.filter(x => x.rc).length + 1).padStart(4, '0')
  );
};
function bahtEn(n) {
  n = Math.round(n * 100) / 100;
  const o = [
      '',
      'one',
      'two',
      'three',
      'four',
      'five',
      'six',
      'seven',
      'eight',
      'nine',
      'ten',
      'eleven',
      'twelve',
      'thirteen',
      'fourteen',
      'fifteen',
      'sixteen',
      'seventeen',
      'eighteen',
      'nineteen',
    ],
    t = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'],
    w = x => (x < 20 ? o[x] : t[Math.floor(x / 10)] + (x % 10 ? '-' + o[x % 10] : '')),
    h = x =>
      x < 100 ? w(x) : o[Math.floor(x / 100)] + ' hundred' + (x % 100 ? ' ' + w(x % 100) : ''),
    m = x =>
      x < 1000
        ? h(x)
        : x < 1e6
          ? h(Math.floor(x / 1000)) + ' thousand' + (x % 1000 ? ' ' + h(x % 1000) : '')
          : m(Math.floor(x / 1e6)) + ' million' + (x % 1e6 ? ' ' + m(x % 1e6) : ''),
    b = Math.floor(n),
    s = Math.round((n - b) * 100);
  if (!b && !s) return 'Zero baht only';
  const r = (b ? m(b) + ' baht' : '') + (b && s ? ' and ' : '') + (s ? w(s) + ' satang' : ' only');
  return r.charAt(0).toUpperCase() + r.slice(1);
}
function bahtText(n) {
  if (LANG == 'en') return bahtEn(n);
  n = Math.round(n * 100) / 100;
  const N0 = ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'],
    PL = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน'];
  const rd = x => {
      let r = '';
      const t = String(x);
      for (let k = 0; k < t.length; k++) {
        const d = +t[k],
          p = t.length - k - 1;
        if (!d) continue;
        if (p == 1) r += (d == 1 ? '' : d == 2 ? 'ยี่' : N0[d]) + 'สิบ';
        else if (p == 0) r += d == 1 && t.length > 1 ? 'เอ็ด' : N0[d];
        else r += N0[d] + PL[p];
      }
      return r;
    },
    mm = x => (x < 1e6 ? rd(x) : mm(Math.floor(x / 1e6)) + 'ล้าน' + (x % 1e6 ? rd(x % 1e6) : '')),
    b = Math.floor(n),
    sa = Math.round((n - b) * 100);
  return b || sa ? (b ? mm(b) + 'บาท' : '') + (sa ? rd(sa) + 'สตางค์' : 'ถ้วน') : 'ศูนย์บาทถ้วน';
}
function rcpHTML(i) {
  const S = D.set,
    u = tu(i) || {},
    nm = S.name || 'T&T Mansion',
    pe = S.payee || nm,
    T = tot(i),
    g = '#15803d',
    rows = [
      ['ค่าเช่าห้อง (' + mon(i.per) + ')', i.rent, ''],
      [
        'ค่าไฟฟ้า',
        i.el,
        '(' + i.pv + ' - ' + (i.pv + i.u) + ') ใช้ ' + i.u + ' หน่วย × ' + B(S.rate) + '/หน่วย',
      ],
    ];
  if (i.x) rows.push([i.xn || 'ค่าใช้จ่ายเพิ่มเติม', i.x, '']);
  if (i.fine) rows.push(['ค่าปรับล่าช้า', i.fine, '']);
  const bx = (h, b, pd) =>
      `<td style="width:50%;vertical-align:top;${pd}"><div style="border:1px solid #cbd5e1;border-radius:10px;padding:10px 12px;font-size:12px;color:#475569;line-height:1.6;min-height:78px"><div style="color:#64748b">${h}</div>${b}</div></td>`,
    sg = (n, r) =>
      `<td style="width:50%;text-align:center;font-size:11px;color:#475569;padding:0 14px"><div style="border-top:1px solid #94a3b8;margin:36px 0 6px"></div>( ${e(n)} )<br>${r}</td>`;
  return `<div class="doc" style="font-family:Anuphan,Tahoma,Arial,sans-serif;max-width:520px;margin:0 auto;background:#fff;color:#0f172a;padding:22px;border-radius:14px;border:1px solid #e2e8f0;text-align:left;font-size:13px">
<table style="width:100%;border-collapse:collapse"><tr><td style="vertical-align:top"><div style="font-size:18px;font-weight:700;color:${g}">${e(nm)}</div><div style="font-size:11px;color:#475569;line-height:1.6">${S.addr ? e(S.addr) + '<br>' : ''}${S.tel ? 'เบอร์ติดต่อ: ' + e(S.tel) + '<br>' : ''}${S.tax ? 'เลขประจำตัวผู้เสียภาษี: ' + e(S.tax) : ''}</div></td><td style="vertical-align:top;text-align:right;white-space:nowrap"><div style="font-size:22px;font-weight:700;color:${g}">ใบเสร็จรับเงิน</div><div style="font-size:11px;color:#64748b">Receipt</div></td></tr></table>
<table style="width:100%;border-collapse:collapse;margin:14px 0"><tr><td style="border:1px solid #cbd5e1;border-radius:10px;padding:10px 12px;font-size:12px"><table style="width:100%;border-collapse:collapse"><tr><td style="color:#64748b">เลขที่ใบเสร็จ</td><td style="color:#64748b;text-align:center">อ้างอิงใบแจ้งหนี้</td><td style="color:#64748b;text-align:right">วันที่รับเงิน</td></tr><tr><td style="font-weight:700">${e(i.rc || '-')}</td><td style="font-weight:700;text-align:center">${e(i.id)}</td><td style="font-weight:700;text-align:right">${dt(i.paid)}</td></tr></table></td></tr></table>
<table style="width:100%;border-collapse:collapse"><tr>${bx('ผู้รับเงิน', '<b style="color:#0f172a;font-size:14px">' + e(pe) + '</b><br>' + (S.tax ? 'เลขประจำตัวผู้เสียภาษี: ' + e(S.tax) + '<br>' : '') + (S.addr ? e(S.addr) : ''), 'padding-right:5px')}${bx('ผู้จ่ายเงิน', '<b style="color:#0f172a;font-size:14px">' + e(u.name || '-') + '</b><br>ห้อง: ' + i.room + (u.tel ? ' | โทร: ' + e(u.tel) : ''), 'padding-left:5px')}</tr></table>
<table style="width:100%;border-collapse:collapse;margin-top:16px;font-size:12px"><tr style="color:#64748b"><td style="padding:6px 4px;border-bottom:2px solid #94a3b8;width:42px">ลำดับ</td><td style="padding:6px 4px;border-bottom:2px solid #94a3b8">รายการ</td><td style="padding:6px 4px;border-bottom:2px solid #94a3b8;text-align:right">จำนวนเงิน</td></tr>${rows.map((r, k) => `<tr><td style="padding:8px 4px;border-bottom:1px solid #e2e8f0;vertical-align:top">${k + 1}</td><td style="padding:8px 4px;border-bottom:1px solid #e2e8f0">${e(r[0])}${r[2] ? '<div style="font-size:11px;color:#64748b">' + e(r[2]) + '</div>' : ''}</td><td style="padding:8px 4px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:700;vertical-align:top">${Number(r[1]).toLocaleString(LOCF(), { minimumFractionDigits: 2 })}</td></tr>`).join('')}</table>
<table style="width:100%;border-collapse:collapse;margin-top:14px"><tr><td style="vertical-align:middle"><div style="font-size:15px;font-weight:700;white-space:nowrap">ยอดเงินที่ได้รับ</div><div style="font-size:11px;color:#64748b">(${bahtText(T)})</div></td><td style="text-align:right;vertical-align:middle;white-space:nowrap"><span style="font-size:18px;font-weight:700">${Number(T).toLocaleString(LOCF(), { minimumFractionDigits: 2 })} บาท</span> <span style="display:inline-block;border:2px solid #16a34a;color:#16a34a;border-radius:6px;padding:2px 8px;font-weight:700;font-size:12px;margin-left:6px;transform:rotate(-6deg)">ชำระเงินแล้ว</span></td></tr></table>
<div style="background:#f1f5f9;border-radius:10px;padding:12px;margin:16px 0 0"><span style="display:inline-block;width:18px;height:18px;border-radius:50%;background:#16a34a;color:#fff;text-align:center;line-height:18px;font-size:11px;margin-right:8px">✓</span>ได้รับชำระเงินเรียบร้อยแล้ว<div style="color:#475569;margin:4px 0 0 26px;font-size:12px">วิธีชำระ: ${i.mt == 'qr' ? 'โอนเงิน (PromptPay)' : 'เงินสด'}</div></div>
<table style="width:100%;border-collapse:collapse"><tr>${sg(u.name || '-', 'ผู้จ่ายเงิน')}${sg(pe, 'ผู้รับเงิน')}</tr></table>
<div style="text-align:center;font-size:11px;color:#94a3b8;margin-top:14px">ขอบคุณที่ใช้บริการ ${e(nm)}</div></div>`;
}
let RCA = 0,
  RCF = 'all';
function goSlips(f) {
  RCF = f;
  RCA = 0;
  go('rep');
  setTimeout(() => {
    const t = document.getElementById('slips');
    if (t && t.scrollIntoView) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 80);
}
function rcTable() {
  const all = D.inv.filter(i => i.slip || i.s == 'paid'),
    L = all
      .filter(i => RCF == 'all' || st(i) == RCF)
      .sort((a, b) => (b.sub || b.paid || 0) - (a.sub || a.paid || 0)),
    V = RCA ? L : L.slice(0, 20),
    fb = (k, t) =>
      `<button class="b ${RCF == k ? '' : 'b2'} sm" onclick="RCF='${k}';RCA=0;R()">${t}</button>`;
  return `<div id="slips" class="cd sc" style="margin-top:14px"><h3 style="margin-bottom:6px">สลิปโอนเงินและใบเสร็จของผู้เช่า</h3><small class="mu">สลิปที่ผู้เช่าส่งมาทุกห้อง และใบเสร็จเมื่อผู้ดูแลยืนยันการชำระแล้ว</small><div class="fl" style="display:flex;gap:8px;flex-wrap:wrap;margin:10px 0">${fb('all', 'ทั้งหมด')}${fb('pending', 'รอตรวจสอบ')}${fb('paid', 'ชำระแล้ว')}</div><table><tr><th>ห้อง</th><th>ผู้เช่า</th><th>รอบบิล</th><th>ยอด</th><th>ช่องทาง</th><th>วันที่แจ้งชำระ</th><th>สถานะ</th><th>สลิปที่ผู้เช่าส่ง</th><th></th></tr>${
    V.map(i => {
      const u = tu(i) || {};
      return `<tr><td>${e(i.room)}</td><td>${e(u.name || '-')}</td><td>${mon(i.per)}</td><td>฿${fm(tot(i))}</td><td>${i.mt == 'qr' ? 'QR' : i.mt == 'cash' ? 'เงินสด' : '-'}</td><td>${i.sub ? dt(i.sub) : '-'}</td><td>${pill(i)}</td><td>${i.slip ? `<img class="slt" loading="lazy" decoding="async" width="48" height="64" data-sid="${i.id}" alt="สลิปห้อง ${e(i.room)}" onclick="vsl('${i.id}')">` : `<small class="mu">${i.mt == 'cash' ? 'เงินสด' : '-'}</small>`}</td><td style="white-space:nowrap">${i.slip ? `<button class="b b2 sm rok" onclick="vsl('${i.id}')">ดูสลิป</button> ` : ''}${i.s == 'paid' ? `<button class="b b2 sm rok" onclick="rc('${i.id}')">ใบเสร็จ</button>` : ''}</td></tr>`;
    }).join('') || '<tr><td colspan=9 class=mu>ยังไม่มีรายการ</td></tr>'
  }</table>${!RCA && L.length > 20 ? `<div style="margin-top:10px"><button class="b b2 sm" onclick="RCA=1;R()">ดูทั้งหมด (${L.length} รายการ)</button></div>` : ''}</div>`;
}
function rc(id) {
  const i = gi(id);
  if (i.s == 'paid' && !i.rc && U.role != 'owner') {
    i.rc = nrc();
    save();
  }
  mo(
    `<div id="rcimg" style="background:#fff;padding:2px;border-radius:14px">${rcpHTML(i)}</div><br><div class="np" style="display:flex;gap:8px;flex-wrap:wrap"><button class="b gr" onclick="si('${id}')">⬇ บันทึกรูปใบเสร็จ</button>${innerWidth > 800 ? '<button class="b b2" onclick="try{window.print()}catch(x){}">พิมพ์</button>' : ''}<button class="b b2" onclick="cm()">ปิด</button></div>`
  );
  if (innerWidth > 800) $('#mc').style.maxWidth = '560px';
}
async function si(id) {
  const i = gi(id),
    el = $('#rcimg');
  if (!window.html2canvas) return alert('โหลดตัวสร้างรูปไม่สำเร็จ กรุณารีเฟรชหน้าแล้วลองใหม่');
  tt('กำลังสร้างรูปใบเสร็จ...');
  try {
    const c = await html2canvas(el, { scale: 2, backgroundColor: '#ffffff' }),
      blob = await new Promise(r => c.toBlob(r, 'image/png')),
      fn = 'receipt-' + (i.rc || id) + '.png';
    let dl = null;
    try {
      dl = window.claude && (await claude.use('downloads'));
    } catch (x) {}
    if (dl) {
      try {
        await dl.save({ filename: fn, data: blob });
        tt('✓ บันทึกรูปใบเสร็จแล้ว');
        return;
      } catch (x) {
        if (x && x.code == 'declined') return;
      }
    }
    try {
      const u = URL.createObjectURL(blob),
        a = document.createElement('a');
      a.href = u;
      a.download = fn;
      a.rel = 'noopener';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        a.remove();
        URL.revokeObjectURL(u);
      }, 10000);
      tt('✓ บันทึกรูปใบเสร็จลงเครื่องแล้ว');
      return;
    } catch (x) {}
    mo(
      `<img src="${c.toDataURL('image/png')}" style="width:100%;border-radius:10px" alt="ใบเสร็จรับเงิน"><p class="mu" style="font-size:13px">กดค้างที่รูป (มือถือ) หรือคลิกขวา (คอมพิวเตอร์) แล้วเลือกบันทึกรูปภาพ</p><button class="b b2" onclick="cm()">ปิด</button>`
    );
  } catch (x) {
    alert('สร้างรูปไม่สำเร็จ: ' + ((x && x.message) || x));
  }
}
