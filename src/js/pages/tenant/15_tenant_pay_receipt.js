/* 15_tenant_pay_receipt.js — ผู้เช่า: บิลของฉัน แจ้งชำระ/สลิป ใบเสร็จ
   (แยกมาจาก script.js บรรทัด 1096-1152; โหลดเรียงตามเลขหน้าชื่อไฟล์ใน index.html) */
// ---- tenant pages ----
pg.my = () => {
  const l = D.inv.filter(i => mine(i) && i.s != 'paid');
  return `<h2>ใบแจ้งหนี้ของฉัน</h2><p class="mu">${U.room ? 'ห้อง ' + U.room : U.out ? 'ย้ายออกแล้ว' : 'ยังไม่ได้จัดห้อง'} · ${e(U.name)}</p>${U.room || U.out ? '' : `<div class="note">${NI('info')}ลงทะเบียนสำเร็จแล้ว รอผู้ดูแลจัดห้องพักให้ จึงจะมีใบแจ้งหนี้</div>`}${U.out ? '<div class="note">คุณย้ายออกแล้ว · ชำระบิลที่ค้างอยู่ได้ที่หน้านี้ หลังชำระครบบัญชีจะเข้าใช้งานไม่ได้อีก</div>' : ''}<div class="note">${NI('cash')}ชำระผ่าน PromptPay QR · หากต้องการชำระเงินสด สามารถชำระได้ที่หน้าเคาน์เตอร์</div><div style="margin-top:14px;display:grid;gap:14px">${
    l
      .map(i => {
        const s = st(i);
        return `<div class="cd"><div style="display:flex;justify-content:space-between"><b>${mlab(i)}</b>${pill(i)}</div><div class="big">฿${fm(tot(i))}</div>${i.fin ? '' : `<div class="bd mu"><span>ค่าเช่า</span><span>฿${fm(i.rent)}</span></div>`}<div class="bd mu"><span>ค่าไฟ ${i.u} หน่วย × ${D.set.rate}</span><span>฿${fm(i.el)}</span></div>${i.x ? `<div class="bd mu"><span>${e(i.xn || 'ค่าใช้จ่ายเพิ่มเติม')}</span><span>฿${fm(i.x)}</span></div>` : ''}${tot(i) > base(i) ? `<div class="bd" style="color:#fb7185"><span>ค่าปรับ</span><span>฿${fm(tot(i) - base(i))}</span></div>` : ''}<p class="mu">ครบกำหนด ${dt(due(i))}</p>${i.s == 'unpaid' && i.rj ? `<div class="note" style="background:#fee2e2;color:#b91c1c;border-color:#fecaca">${NI('warn')}สลิปถูกปฏิเสธ: ${e(i.rj)}<br>กรุณาตรวจสอบแล้วส่งสลิปใหม่</div>` : ''}${i.s == 'pending' ? '<span class="mu">รอผู้ดูแลตรวจสอบ · ส่งสลิปผิดแก้ไขได้ก่อนผู้ดูแลยืนยัน</span> ' : ''}<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px"><button class="b" onclick="vi('${i.id}')">ดูใบแจ้งหนี้</button>${i.s == 'pending' && i.mt != 'cash' ? `<button class="b b2" onclick="pm('${i.id}')">แก้ไข/ส่งสลิปใหม่</button>` : ''}</div></div>`;
      })
      .join('') || `<div class="cd mu empty-ok">${NI('ok')}ไม่มีบิลค้างชำระ</div>`
  }</div>`;
};
pg.hist = () => {
  const l = D.inv.filter(i => mine(i) && i.s == 'paid');
  return `<h2>ประวัติ & ใบเสร็จ</h2><div class="cd sc" style="margin-top:14px"><table><tr><th>รอบบิล</th><th>ยอด</th><th>วันที่ชำระ</th><th></th></tr>${l.map(i => `<tr><td>${mlab(i)}</td><td>฿${fm(tot(i))}</td><td>${dt(i.paid)}</td><td><button class="b b2 sm rok" onclick="rc('${i.id}')">ใบเสร็จ</button></td></tr>`).join('') || '<tr><td colspan=4 class=mu>ยังไม่มีประวัติ</td></tr>'}</table></div>`;
};
const fz = i => (i.s == 'pending' ? i.fine || 0 : fine(i)); // ส่งสลิปใหม่: ค่าปรับคงตามวันที่แจ้งชำระครั้งแรก
function pm(id) {
  const i = gi(id),
    pd = i.s == 'pending',
    f = fz(i),
    t = base(i) + f;
  SLIP = null;
  SLIPQ = null;
  mo(`<div class="mh"><h3>${pd ? 'แก้ไขสลิป · ส่งสลิปใหม่' : 'ชำระเงินผ่าน PromptPay'}</h3><span class="mu">${i.id}</span></div>
 <div class="amt"><small>ยอดที่ต้องชำระ</small><div class="big">฿${fm(t)}</div><small>ครบกำหนด ${dt(due(i))}${late(i) > 0 ? ` · <b style="color:#fb7185">เลยกำหนด ${late(i)} วัน</b>` : ''}</small></div>
 <div class="bk">${i.fin ? '' : `<div class="bd"><span>ค่าเช่า</span><span>฿${fm(i.rent)}</span></div>`}<div class="bd"><span>ค่าไฟ ${i.u} หน่วย</span><span>฿${fm(i.el)}</span></div>${i.x ? `<div class="bd"><span>${e(i.xn || 'ค่าใช้จ่ายเพิ่มเติม')}</span><span>฿${fm(i.x)}</span></div>` : ''}${f ? `<div class="bd" style="color:#fb7185"><span>ค่าปรับ (นับถึงวันที่แจ้งชำระ)</span><span>฿${f}</span></div>` : ''}</div>
 ${pd ? '<div class="note">ผู้ดูแลยังไม่ได้ยืนยัน จึงส่งสลิปใหม่ได้ · เมื่อผู้ดูแลยืนยันแล้วจะแก้ไขไม่ได้</div>' : ''}${!pd && i.rj ? `<div class="note" style="background:#fee2e2;color:#b91c1c;border-color:#fecaca">${NI('warn')}สลิปครั้งก่อนถูกปฏิเสธ: ${e(i.rj)}</div>` : ''}<div class="st"><b>1</b> สแกน QR ด้วยแอปธนาคาร</div><div class="qrc"><div class="qr" id="qr"></div><small class="mu">ยอดเงินจะขึ้นอัตโนมัติ ไม่ต้องกรอกเอง</small></div>
 <div class="st"><b>2</b> อัปโหลดสลิปโอนเงิน (JPG/PNG)</div><label class="drop" id="sfz" ondragover="event.preventDefault();this.classList.add('on')" ondragleave="this.classList.remove('on')" ondrop="slDrop(event)"><input type="file" id="sf" accept="image/jpeg,image/png" onchange="sl(this)"><img class="dz-pv" id="sfp" alt="ตัวอย่างสลิป" hidden><span class="dz-ic">${IC.up}</span><span class="dz-t"><b id="sfn">เลือกรูปสลิป</b><span class="dz-or"> หรือลากไฟล์มาวางที่นี่</span></span><small class="mu" id="sfh">JPG หรือ PNG ไม่เกิน 8 MB</small></label><div id="sfq" class="sq" hidden></div>
 <button class="b" style="width:100%" onclick="sub('${id}')">${pd ? 'ส่งสลิปใหม่' : 'แจ้งชำระเงิน'}</button>
 <div class="note">${NI('cash')}หากต้องการชำระเงินสด สามารถชำระได้ที่หน้าเคาน์เตอร์</div>
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
// ---------- ตรวจสลิปเบื้องต้นจาก QR มุมสลิป (mini QR ตามมาตรฐานธนาคารไทย) ----------
// ในQR มีรหัสธนาคารที่โอน + เลขอ้างอิงรายการ (ไม่มียอดเงิน) ใช้กันสลิปซ้ำ และให้ผู้ดูแลเห็นเลขอ้างอิง
// อ่านด้วย BarcodeDetector ของเบราว์เซอร์ถ้ามี ไม่มีจึงโหลด jsQR (ครั้งแรกที่ใช้)
let SLIPQ = null; // { ref, bank } | { none: 1 } | null (ยังอ่านไม่เสร็จ)
const BANKS = {
  '002': 'กรุงเทพ',
  '004': 'กสิกรไทย',
  '006': 'กรุงไทย',
  '011': 'ทหารไทยธนชาต',
  '014': 'ไทยพาณิชย์',
  '022': 'ซีไอเอ็มบี ไทย',
  '024': 'ยูโอบี',
  '025': 'กรุงศรีอยุธยา',
  '030': 'ออมสิน',
  '033': 'อาคารสงเคราะห์',
  '034': 'ธ.ก.ส.',
  '066': 'อิสลามแห่งประเทศไทย',
  '067': 'ทิสโก้',
  '069': 'เกียรตินาคินภัทร',
  '073': 'แลนด์ แอนด์ เฮ้าส์',
};
const bankName = c => (c ? 'ธนาคาร' + (BANKS[c] || ' รหัส ' + c) : '');
// อ่าน TLV (รหัส 2 หลัก + ความยาว 2 หลัก + ค่า)
function tlvRead(s) {
  const o = {};
  let i = 0;
  while (i + 4 <= s.length) {
    const t = s.slice(i, i + 2),
      n = +s.slice(i + 2, i + 4);
    if (!/^\d{2}$/.test(t) || isNaN(n) || i + 4 + n > s.length) return null;
    o[t] = s.slice(i + 4, i + 4 + n);
    i += 4 + n;
  }
  return i == s.length ? o : null;
}
function crc16(s) {
  let c = 0xffff;
  for (let i = 0; i < s.length; i++) {
    c ^= s.charCodeAt(i) << 8;
    for (let k = 0; k < 8; k++) c = c & 0x8000 ? ((c << 1) ^ 0x1021) & 0xffff : (c << 1) & 0xffff;
  }
  return c.toString(16).toUpperCase().padStart(4, '0');
}
// คืน { ref, bank } ถ้าเป็น QR สลิปที่ถูกต้อง (มีเลขอ้างอิง + ค่าตรวจสอบ CRC ตรง) ไม่ใช่คืน null
function miniQR(txt) {
  const s = String(txt || '').trim(),
    top = tlvRead(s);
  if (!top || !top['00']) return null;
  if (top['91'] && crc16(s.slice(0, -4)).toUpperCase() != top['91'].toUpperCase()) return null;
  const sub = tlvRead(top['00']);
  if (!sub || !sub['02'] || !/^\d{3}$/.test(sub['01'] || '')) return null;
  return { ref: sub['02'].replace(/[^A-Za-z0-9]/g, ''), bank: sub['01'] };
}
let JSQR = null;
const loadJsQR = () =>
  JSQR ||
  (JSQR = new Promise((ok, no) => {
    if (window.jsQR) return ok(window.jsQR);
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js';
    s.onload = () => (window.jsQR ? ok(window.jsQR) : no());
    s.onerror = no;
    document.head.appendChild(s);
  }));
// หา QR ทั้งภาพก่อน ไม่เจอจึงลองขยายครึ่งล่างของภาพ (QR สลิปส่วนใหญ่อยู่มุมล่าง)
async function readSlipQR(img) {
  const tries = [
    [0, 0, 1, 1],
    [0, 0.45, 1, 0.55],
    [0.4, 0.5, 0.6, 0.5],
  ];
  if ('BarcodeDetector' in window) {
    try {
      const d = new BarcodeDetector({ formats: ['qr_code'] }),
        r = await d.detect(img);
      for (const x of r) {
        const q = miniQR(x.rawValue);
        if (q) return q;
      }
    } catch (x) {}
  }
  let J;
  try {
    J = await loadJsQR();
  } catch (x) {
    return null;
  }
  for (const [fx, fy, fw, fh] of tries) {
    const sw = img.width * fw,
      sh = img.height * fh,
      k = Math.min(1, 1400 / Math.max(sw, sh)) * (fw < 1 ? 1.6 : 1),
      c = document.createElement('canvas');
    c.width = Math.round(sw * Math.min(k, 2));
    c.height = Math.round(sh * Math.min(k, 2));
    const g = c.getContext('2d', { willReadFrequently: true });
    g.drawImage(img, img.width * fx, img.height * fy, sw, sh, 0, 0, c.width, c.height);
    const r = J(g.getImageData(0, 0, c.width, c.height).data, c.width, c.height, {
      inversionAttempts: 'attemptBoth',
    });
    const q = r && miniQR(r.data);
    if (q) return q;
  }
  return null;
}
// แสดงผลการอ่าน QR ใต้กรอบสลิป
function slQRShow() {
  const z = document.getElementById('sfq');
  if (!z) return;
  z.hidden = false;
  if (!SLIPQ) {
    z.className = 'sq sq-ld';
    z.innerHTML = NI('info') + '<span>กำลังตรวจ QR บนสลิป…</span>';
  } else if (SLIPQ.ref) {
    z.className = 'sq sq-ok';
    z.innerHTML =
      NI('ok') +
      `<span>พบ QR ของสลิป · ${e(bankName(SLIPQ.bank))}<br><small>เลขอ้างอิง ${e(SLIPQ.ref)}</small></span>`;
  } else {
    z.className = 'sq sq-wa';
    z.innerHTML = NI('warn') + '<span>ไม่พบ QR บนสลิป · ควรใช้รูปสลิปจากแอปธนาคารแบบเต็มใบ ไม่ตัดมุม</span>';
  }
}
// แสดงภาพตัวอย่างสลิปในกรอบ หลังย่อรูปเสร็จ
function slShow(name) {
  const z = document.getElementById('sfz'),
    p = document.getElementById('sfp');
  if (!z || !p) return;
  p.src = SLIP;
  p.hidden = false;
  z.classList.add('has');
  z.classList.remove('on');
  $('#sfn').textContent = name.length > 28 ? name.slice(0, 26) + '…' : name;
  $('#sfh').textContent = 'กดที่กรอบเพื่อเปลี่ยนรูป';
}
// ลากไฟล์มาวางในกรอบ
function slDrop(ev) {
  ev.preventDefault();
  const z = ev.currentTarget,
    inp = document.getElementById('sf'),
    fs = ev.dataTransfer && ev.dataTransfer.files;
  z.classList.remove('on');
  if (!fs || !fs[0] || !inp) return;
  try {
    inp.files = fs;
  } catch (x) {}
  sl(inp.files && inp.files[0] ? inp : { files: fs, value: '' });
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
      const k = Math.min(1, 1600 / Math.max(m.width, m.height)),
        c = document.createElement('canvas');
      c.width = m.width * k;
      c.height = m.height * k;
      c.getContext('2d').drawImage(m, 0, 0, c.width, c.height);
      SLIP = c.toDataURL('image/jpeg', 0.85);
      slShow(f.name);
      SLIPQ = null;
      slQRShow();
      const tok = (sl.tok = (sl.tok || 0) + 1);
      readSlipQR(m)
        .then(
          q => q,
          () => null
        )
        .then(q => {
          if (tok != sl.tok) return;
          SLIPQ = q || { none: 1 };
          slQRShow();
        });
    };
    m.src = r.result;
  };
  r.readAsDataURL(f);
}
// ก่อนส่ง: รอผลอ่าน QR · ไม่พบ QR ให้ยืนยันก่อน · คืน false ถ้าไม่ส่ง
async function slipGate() {
  for (let t = 0; !SLIPQ && t < 40; t++) await new Promise(r => setTimeout(r, 150));
  if (SLIPQ && SLIPQ.ref) return true;
  return confirm('ระบบไม่พบ QR บนรูปสลิปนี้\nผู้ดูแลอาจต้องใช้เวลาตรวจสอบนานขึ้น\n\nต้องการส่งสลิปนี้ต่อหรือไม่?');
}
async function sub(id) {
  const i = gi(id);
  if (!SLIP) return alert('กรุณาอัปโหลดสลิปโอนเงิน');
  if (!(await slipGate())) return;
  const ref = SLIPQ && SLIPQ.ref;
  if (ref && D.inv.some(x => x.id != id && x.sref == ref && x.s != 'unpaid'))
    return alert('สลิปนี้ถูกใช้ซ้ำ ใช้แจ้งชำระไม่ได้ กรุณาแนบสลิปของรายการโอนครั้งนี้');
  i.sref = ref || undefined;
  i.sbank = (SLIPQ && SLIPQ.bank) || undefined;
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
  const d = bk();
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
// QR ตรวจสอบใบเสร็จ: ลิงก์ไปหน้า verify.html พร้อมเลขใบเสร็จและรหัสตรวจสอบ (12 ตัวแรกของรหัสการชำระเงินที่สุ่มไว้)
// มีเฉพาะใบเสร็จที่บันทึกในฐานข้อมูลแล้ว (โหมดทดลองที่ไม่มีฐานข้อมูลจะไม่แสดง QR)
function rcQR(i) {
  if (!i.rc || !i._pid || !window.qrcode) return '';
  try {
    let b = /^https?:\/\//.test(D.set.url || '')
      ? D.set.url
      : location.origin + location.pathname.replace(/[^/]*$/, '');
    if (!b.endsWith('/')) b += '/';
    const u =
        b +
        'verify.html?r=' +
        encodeURIComponent(i.rc) +
        '&k=' +
        String(i._pid).replace(/-/g, '').slice(0, 12),
      k = qrcode(0, 'M');
    k.addData(u);
    k.make();
    return `<img src="${k.createDataURL(3, 0)}" alt="QR ตรวจสอบใบเสร็จ" width="76" height="76" style="display:inline-block;image-rendering:pixelated">`;
  } catch (x) {
    return '';
  }
}
function rcpHTML(i) {
  const S = D.set,
    u = tu(i) || {},
    nm = S.name || 'T&T Mansion',
    pe = S.payee || nm,
    T = tot(i),
    g = '#1d7a4c',
    rows = [
      ...(i.fin ? [] : [['ค่าเช่าห้อง (' + mon(i.per) + ')', i.rent, '']]),
      [
        'ค่าไฟฟ้า',
        i.el,
        '(' + i.pv + ' - ' + (i.pv + i.u) + ') ใช้ ' + i.u + ' หน่วย × ' + B(S.rate) + '/หน่วย',
      ],
    ];
  if (i.x) rows.push([i.xn || 'ค่าใช้จ่ายเพิ่มเติม', i.x, '']);
  if (i.fine) rows.push(['ค่าปรับล่าช้า', i.fine, '']);
  const vq = rcQR(i),
    nf = v => Number(v).toLocaleString(LOCF(), { minimumFractionDigits: 2 }),
    td = 'padding:8px 4px;border-bottom:1px solid #eee7e3',
    th = 'padding:6px 4px;border-bottom:2px solid #a8a29e';
  return `<div class="doc" style="font-family:Anuphan,Tahoma,Arial,sans-serif;max-width:520px;margin:0 auto;background:#fff;color:#1c1917;padding:22px;border-radius:14px;border:1px solid #e7e0dc;text-align:left;font-size:13px;position:relative;overflow:hidden">
${docHead('ใบเสร็จรับเงิน', 'Receipt')}
<table style="width:100%;border-collapse:collapse;font-size:12px;border:1px solid #e7e0dc;border-radius:10px"><tr style="color:#78716c"><td style="padding:8px 12px 0">เลขที่ใบเสร็จ</td><td style="padding:8px 12px 0;text-align:center">อ้างอิงใบแจ้งหนี้</td><td style="padding:8px 12px 0;text-align:right">วันที่รับเงิน</td></tr><tr style="font-weight:700"><td style="padding:2px 12px 8px">${e(i.rc || '-')}</td><td style="padding:2px 12px 8px;text-align:center">${e(i.id)}</td><td style="padding:2px 12px 8px;text-align:right">${dt(i.paid)}</td></tr></table>
<table style="width:100%;border-collapse:collapse;margin-top:10px"><tr>${DOC_BOX('ผู้รับเงิน', '<b style="color:#1c1917;font-size:14px">' + e(pe) + '</b>' + (S.tax ? '<br>เลขประจำตัวผู้เสียภาษี ' + e(S.tax) : ''), 'padding-right:5px')}${DOC_BOX('ผู้จ่ายเงิน', '<b style="color:#1c1917;font-size:14px">คุณ' + e(u.name || '-') + '</b><br>ห้อง ' + i.room + (u.tel ? ' · โทร ' + e(u.tel) : ''), 'padding-left:5px')}</tr></table>
<table style="width:100%;border-collapse:collapse;margin-top:14px;font-size:12px"><tr style="color:#78716c"><td style="${th};width:42px">ลำดับ</td><td style="${th}">รายการ</td><td style="${th};text-align:right">จำนวนเงิน (บาท)</td></tr>${rows.map((r, k) => `<tr><td style="${td};vertical-align:top">${k + 1}</td><td style="${td}">${e(r[0])}${r[2] ? '<div style="font-size:11px;color:#78716c">' + e(r[2]) + '</div>' : ''}</td><td style="${td};text-align:right;font-weight:700;vertical-align:top;font-variant-numeric:tabular-nums">${nf(r[1])}</td></tr>`).join('')}</table>
<table style="width:100%;border-collapse:collapse;margin-top:12px"><tr><td style="vertical-align:middle"><div style="font-size:15px;font-weight:700">ยอดเงินที่ได้รับ</div><div style="font-size:11px;color:#78716c">(${bahtText(T)})</div></td><td style="text-align:right;vertical-align:middle;white-space:nowrap"><span style="display:inline-block;vertical-align:middle;border:3px double ${g};color:${g};border-radius:8px;padding:3px 10px;font-weight:700;font-size:14px;letter-spacing:.06em;transform:rotate(-8deg);margin-right:14px;text-align:center;line-height:1.15">ชำระแล้ว<span style="display:block;font-size:9px;letter-spacing:.04em;font-weight:600">${dt(i.paid)}</span></span><span style="font-size:20px;font-weight:700;color:${DOC_C};font-variant-numeric:tabular-nums;vertical-align:middle">${nf(T)} บาท</span></td></tr></table>
<div style="background:#f3f7f4;border:1px solid #d7e8dc;border-radius:10px;padding:10px 12px;margin-top:14px;font-size:12px;color:#365a44">ได้รับชำระเงินเรียบร้อยแล้ว · ช่องทาง ${i.mt == 'qr' ? 'โอนเงินผ่านพร้อมเพย์' : 'เงินสด'}</div>
<table style="width:100%;border-collapse:collapse"><tr>${DOC_SIGN(u.name || '-', 'ผู้จ่ายเงิน')}${DOC_SIGN(pe, 'ผู้รับเงิน')}</tr></table>
${
  vq
    ? `<table style="width:100%;border-collapse:collapse;margin-top:14px;border-top:1px dashed #e7e0dc"><tr><td style="vertical-align:middle;font-size:11px;color:#78716c;line-height:1.6;padding-top:10px"><b style="color:#1c1917;font-size:12px">ตรวจสอบใบเสร็จ</b><br>สแกน QR เพื่อตรวจว่าใบเสร็จนี้ออกโดยระบบจริง<br>และจำนวนเงินตรงกับข้อมูลของหอพัก</td><td style="width:84px;text-align:right;vertical-align:middle;padding-top:10px">${vq}</td></tr></table>`
    : ''
}
<div style="text-align:center;font-size:11px;color:#a8a29e;margin-top:14px">ขอบคุณที่ใช้บริการ ${e(nm)} · เอกสารนี้ออกโดยระบบ</div></div>`;
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
      return `<tr><td>${e(i.room)}</td><td>${e(u.name || '-')}</td><td>${mlab(i)}</td><td>฿${fm(tot(i))}</td><td>${i.mt == 'qr' ? 'QR' : i.mt == 'cash' ? 'เงินสด' : '-'}</td><td>${i.sub ? dt(i.sub) : '-'}</td><td>${pill(i)}</td><td>${i.slip ? `<img class="slt" loading="lazy" decoding="async" width="48" height="64" data-sid="${i.id}" alt="สลิปห้อง ${e(i.room)}" onclick="vsl('${i.id}')">` : `<small class="mu">${i.mt == 'cash' ? 'เงินสด' : '-'}</small>`}</td><td style="white-space:nowrap">${i.slip ? `<button class="b b2 sm rok" onclick="vsl('${i.id}')">ดูสลิป</button> ` : ''}${i.s == 'paid' ? `<button class="b b2 sm rok" onclick="rc('${i.id}')">ใบเสร็จ</button>` : ''}</td></tr>`;
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
