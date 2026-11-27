/* 17_help_news_contacts.js — ช่วยเหลือ/ข่าวสาร/ติดต่อ, LINE, มอบหมายห้อง (ส่วนเสริม)
   (แยกมาจาก script.js บรรทัด 1211-1248; โหลดเรียงตามเลขหน้าชื่อไฟล์ใน index.html) */
let LQ = '',
  TKI = [];
const okImg = f => /^image\/(jpeg|png|webp)$/.test(f.type) && f.size <= 5 * 1024 * 1024,
  rz = (f, max, type, q, cb) => {
    const rd = new FileReader();
    rd.onload = () => {
      const m = new Image();
      m.onload = () => {
        const k = Math.min(1, max / Math.max(m.width, m.height)),
          c = document.createElement('canvas');
        c.width = m.width * k;
        c.height = m.height * k;
        c.getContext('2d').drawImage(m, 0, 0, c.width, c.height);
        cb(c.toDataURL(type, q));
      };
      m.src = rd.result;
    };
    rd.readAsDataURL(f);
  },
  TKS = { open: ['รอดำเนินการ', 'y'], prog: ['กำลังดำเนินการ', 'p'], done: ['เสร็จสิ้น', 'g'] };
// ลิงก์เพิ่มเพื่อน: บัญชี OA (@xxxx) ใช้ /R/ti/p/%40xxxx · LINE ส่วนตัวใช้ /ti/p/~id
const lnUrl = id => {
    id = String(id || '').trim();
    return id.startsWith('@')
      ? 'https://line.me/R/ti/p/' + encodeURIComponent(id)
      : 'https://line.me/ti/p/~' + encodeURIComponent(id);
  },
  lnBotId = v => {
    v = String(v || '')
      .trim()
      .replace(/\s+/g, '');
    return v && !v.startsWith('@') ? '@' + v : v;
  },
  lnBotRow = ad => {
    const b = (D.set.lineBot || '').trim();
    if (!b && !ad) return '';
    return `<div class="lnbt"><div><b>LINE แจ้งเตือน (บอท)</b> ${b ? `<span class="rch">${e(b)}</span>` : '<small class="mu">ยังไม่ได้ตั้งค่า</small>'}<br><small class="mu">ส่งแจ้งเตือนบิล วันครบกำหนด และใบเสร็จให้อัตโนมัติ · ตอบคำถามไม่ได้ · เพิ่มเพื่อนแล้วเชื่อมบัญชีได้ที่หน้าโปรไฟล์</small></div>${b ? `<a class="b b2 sm" target="_blank" rel="noopener" href="${lnUrl(b)}">เพิ่มเพื่อนบอท</a>` : ''}</div>`;
  };
pg.help = () => {
  TKI = [];
  const S = D.set,
    ad = U.role == 'admin',
    tk = (D.tk = D.tk || []).filter(t => ad || t.uid == U.id).sort((a, b) => b.t - a.t),
    id = (S.line || '').trim();
  return `<div class="hd2"><div><h2>ศูนย์ช่วยเหลือ</h2><p class="mu" style="margin:2px 0">แจ้งปัญหาหรือสอบถามผู้ดูแลได้ที่นี่ ผู้ดูแลจะตอบกลับในหน้านี้</p></div></div>
<div class="hlp" style="max-width:780px"><h3 style="margin:18px 0 4px">ช่องทางการติดต่อ</h3><p class="mu" style="margin:0 0 12px">ติดต่อหอพักได้ทางโทรศัพท์หรือ LINE</p>
<div class="ln2"><div class="lnh"><i class="lni"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3C6.5 3 2 6.6 2 11c0 2.5 1.4 4.7 3.7 6.2-.2.8-.7 2.7-.8 3.1 0 0-.1.3.2.4.2.1.4 0 .4 0 .5-.1 3-2 4.1-2.8.8.1 1.6.2 2.4.2 5.5 0 10-3.6 10-8S17.5 3 12 3z"/></svg></i><b>LINE ติดต่อสอบถาม</b></div><div class="lnb"><div class="lq">${S.lineqr ? `<img src="${S.lineqr}" alt="QR LINE">` : 'พื้นที่ใส่ QR LINE<br>' + (ad ? '(กดแก้ไขเพื่อเพิ่ม)' : '(ผู้ดูแลยังไม่ได้เพิ่ม)')}</div><div class="lnx"><h3 class="lid">${id ? e(id) : 'ยังไม่ได้ตั้งค่า LINE ID'}</h3><small class="mu lns">ติดต่อสอบถาม · ${PN()}</small><p class="mu lnt">สแกน QR หรือค้นหา LINE ID เพื่อพูดคุยกับผู้ดูแลหอพัก</p><div class="lna">${id ? `<a class="b lgb" target="_blank" rel="noopener" href="${lnUrl(id)}">เพิ่มเพื่อนใน LINE</a>` : ''}${ad ? '<button class="b b2 sm" onclick="le()">แก้ไข LINE</button>' : ''}</div></div></div>${lnBotRow(ad)}</div>
${ad ? '' : contactCard()}${ad ? '' : `<h3 style="margin:28px 0 12px">ส่งคำขอใหม่</h3><div class="cd"><label>หมวดหมู่</label><select id="tkc"><option value="">เลือกหมวดหมู่</option>${['ปัญหาการชำระเงิน', 'ใบแจ้งหนี้ / ค่าไฟ', 'ซ่อมบำรุง', 'บัญชีผู้ใช้', 'อื่นๆ'].map(x => `<option>${x}</option>`).join('')}</select><label>หัวข้อ</label><input id="tkt" placeholder="อธิบายปัญหาโดยย่อ" maxlength="100"><label>รายละเอียด</label><textarea id="tkb" rows="4" maxlength="2000" placeholder="กรุณาอธิบายปัญหาอย่างละเอียด..."></textarea><label>แนบรูปภาพ (ไม่บังคับ)</label><div style="margin:6px 0"><input type="file" id="tkf" accept="image/jpeg,image/png,image/webp" multiple hidden onchange="tki(this)"><button class="b b2 sm" onclick="$('#tkf').click()">แนบรูปภาพ</button> <small class="mu">สูงสุด 5 รูป (JPEG, PNG, WebP) · ไม่เกิน 5MB ต่อรูป</small></div><div id="tkp" class="fl"></div><div style="text-align:right"><button class="b" onclick="tks()">ส่งคำขอ</button></div></div>`}
<h3 style="margin:28px 0 12px">${ad ? 'คำขอความช่วยเหลือจากผู้ใช้' : 'คำขอของฉัน'}</h3>${
    tk
      .map(
        t =>
          `<div class="cd" style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><div><b>${e(t.title)}</b> <span class="rch">${e(t.cat)}</span><br><small class="mu">${e(t.name)}${t.room ? ' · ห้อง ' + t.room : ''} · ${dt(t.t)}</small></div>${
            ad
              ? `<select style="width:auto;margin:0" onchange="tkst('${t.id}',this.value)">${Object.entries(
                  TKS
                )
                  .map(
                    ([k, v]) =>
                      `<option value="${k}" ${t.s == k ? 'selected' : ''}>${v[0]}</option>`
                  )
                  .join('')}</select>`
              : `<span class="pl ${TKS[t.s][1]}">${TKS[t.s][0]}</span>`
          }</div><p style="white-space:pre-line;margin:10px 0">${e(t.body)}</p>${(t.imgs || []).map((x, i) => `<img class="tmb" src="${x}" onclick="tkv('${t.id}',${i})"> `).join('')}${t.reply ? `<div class="note" style="margin-top:10px">ตอบกลับจากผู้ดูแลระบบ${t.rby ? ' (' + e(t.rby) + ')' : ''}<br>${e(t.reply)}</div>` : ''}${ad ? `<textarea maxlength="2000" id="rp_${t.id}" rows="2" placeholder="พิมพ์ข้อความตอบกลับ…" style="margin-top:10px">${e(t.reply || '')}</textarea><div style="text-align:right"><button class="b sm" onclick="tkrp('${t.id}')">ส่งคำตอบ</button></div>` : ''}</div>`
      )
      .join('') || '<div class="cd mu" style="text-align:center">ยังไม่มีคำขอ</div>'
  }</div>`;
};
function tkr() {
  $('#tkp').innerHTML = TKI.map(
    (x, i) =>
      `<span style="position:relative"><img class="tmb" src="${x}"><b onclick="TKI.splice(${i},1);tkr()" style="position:absolute;top:-6px;right:-6px;background:#dc2626;color:#fff;border-radius:50%;width:18px;height:18px;text-align:center;font-size:12px;cursor:pointer;line-height:18px">×</b></span>`
  ).join('');
}
function tki(el) {
  [...el.files].forEach(f => {
    if (TKI.length >= 5) return alert('แนบได้สูงสุด 5 รูป');
    if (!okImg(f)) return alert('รองรับ JPEG / PNG / WebP ไม่เกิน 5MB ต่อรูป');
    rz(f, 640, 'image/jpeg', 0.6, u => {
      if (TKI.length < 5) {
        TKI.push(u);
        tkr();
      }
    });
  });
  el.value = '';
}
function tks() {
  const c = $('#tkc').value,
    t = $('#tkt').value.trim(),
    b = $('#tkb').value.trim();
  if (!c || !t || !b) return alert('กรอกหมวดหมู่ หัวข้อ และรายละเอียดให้ครบ');
  D.tk.unshift({
    id: 'TK' + Date.now(),
    uid: U.id,
    name: U.name,
    room: U.room || null,
    cat: c,
    title: t,
    body: b,
    imgs: TKI.slice(),
    t: Date.now(),
    s: 'open',
  });
  lg('ส่งคำขอช่วยเหลือ: ' + t);
  save();
  R();
  tt('✓ ส่งคำขอแล้ว');
}
function tkst(id, v) {
  const t = D.tk.find(x => x.id == id);
  t.s = v;
  lg('เปลี่ยนสถานะคำขอ ' + t.title);
  save();
  R();
  tt('✓ อัปเดตสถานะแล้ว');
}
function tkv(id, i) {
  mo(
    `<img src="${D.tk.find(x => x.id == id).imgs[i]}" style="width:100%;border-radius:12px"><br><br><button class="b b2" onclick="cm()">ปิด</button>`
  );
}
function le() {
  const S = D.set;
  LQ = S.lineqr || '';
  mo(
    `<h3>LINE ติดต่อสอบถาม</h3><label>LINE ID สำหรับพูดคุย (LINE ส่วนตัว หรือ OA ที่มีคนตอบ)</label><input id="l_id" maxlength="60" value="${e(S.line || '')}" placeholder="เช่น myline หรือ @ttmansion"><label>รูป QR Code LINE</label><div class="lq" style="margin:6px 0 10px" id="l_pv">${S.lineqr ? `<img src="${S.lineqr}">` : 'ยังไม่มีรูป'}</div><input type="file" id="l_f" accept="image/jpeg,image/png,image/webp" hidden onchange="lqf(this)"><button class="b b2 sm" onclick="$('#l_f').click()">เลือกรูป QR</button> <button class="b b2 sm" onclick="LQ='';$('#l_pv').textContent='ลบรูปแล้ว'">ลบรูป</button><h3 style="margin-top:22px">LINE แจ้งเตือน (บอท)</h3><label>Bot basic ID ของบอทแจ้งเตือน (ดูได้ใน LINE Developers แท็บ Messaging API)</label><input id="l_bot" value="${e(S.lineBot || '')}" placeholder="เช่น @130kmbel"><br><br><button class="b" onclick="ls()">บันทึก</button> <button class="b b2" onclick="cm()">ยกเลิก</button>`
  );
}
function lqf(el) {
  const f = el.files[0];
  el.value = '';
  if (!f) return;
  if (!okImg(f)) return alert('รองรับ JPEG / PNG / WebP ไม่เกิน 5MB');
  rz(f, 480, 'image/png', 1, u => {
    LQ = u;
    $('#l_pv').innerHTML = `<img src="${u}">`;
  });
}
function ls() {
  D.set.line = $('#l_id').value.trim();
  D.set.lineBot = lnBotId($('#l_bot').value);
  if (LQ) D.set.lineqr = LQ;
  else delete D.set.lineqr;
  lg('แก้ไขช่องทาง LINE');
  save();
  cm();
  R();
  tt('✓ บันทึกแล้ว');
}
pg.news = () => {
  const ad = U.role == 'admin',
    n = (D.news = D.news || []).slice().sort((a, b) => b.t - a.t);
  return `<div class="hd2"><i class="ci" style="width:44px;height:44px;font-size:20px">▣</i><div style="flex:1"><h2>ข่าวสาร</h2><p class="mu" style="margin:2px 0">ประกาศและข่าวสารจาก ${PN()}</p></div>${ad ? '<button class="b" onclick="nw()">+ ประกาศข่าว</button>' : ''}<button class="b b2 sm np" onclick="R()" title="รีเฟรช">⟳</button></div><div style="max-width:780px">${n.map(x => `<div class="cd" style="margin-bottom:12px"><div class="ch"><b style="font-size:17px">${e(x.title)}</b>${ad ? `<button class="b b2 sm" onclick="nd('${x.id}')">ลบ</button>` : ''}</div><small class="mu">${dt(x.t)} · ${e(x.by || '')}</small><p style="white-space:pre-line;margin:10px 0 0">${e(x.body)}</p></div>`).join('') || `<div class="mu" style="text-align:center;padding:70px 0"><div class="ci" style="width:56px;height:56px;margin:0 auto 12px;font-size:24px;border-radius:50%">▣</div>ยังไม่มีข่าวสาร</div>`}</div>`;
};
function nw() {
  mo(
    `<h3>ประกาศข่าว</h3><label>หัวข้อ</label><input id="n_t" maxlength="100"><label>รายละเอียด</label><textarea id="n_b" rows="5" maxlength="3000"></textarea><button class="b" onclick="ns()">ประกาศ</button> <button class="b b2" onclick="cm()">ยกเลิก</button>`
  );
}
function ns() {
  const t = $('#n_t').value.trim(),
    b = $('#n_b').value.trim();
  if (!t || !b) return alert('กรอกหัวข้อและรายละเอียด');
  D.news.unshift({ id: 'N' + Date.now(), t: Date.now(), title: t, body: b, by: U.name });
  lg('ประกาศข่าว: ' + t);
  save();
  cm();
  R();
  tt('✓ ประกาศข่าวแล้ว');
}
function nd(id) {
  cf('ลบข่าวนี้?', () => {
    D.news = D.news.filter(x => x.id != id);
    lg('ลบข่าว');
    save();
    R();
  });
}
const NVA = [
  ['dash', 'แดชบอร์ด', '▦'],
  ['rooms', 'ห้องพัก', '⌂'],
  ['ten', 'ผู้เช่า', PI],
  ['con', 'สัญญาเช่า', '▥'],
  ['met', 'มิเตอร์ & ออกบิล', '◔'],
  ['pay', 'รับชำระเงิน', '▤'],
  ['rep', 'รายงาน', '☰'],
  ['set', 'ตั้งค่า', '⚙'],
  ['help', 'ช่วยเหลือ', '◍'],
  ['news', 'ข่าวสาร', '▣'],
  ['prof', 'โปรไฟล์', '◉'],
];
// ไฟล์สัญญาเช่า PDF: เก็บแยกต่อสัญญา (ผู้เช่าแต่ละคน) ไม่เขียนทับสัญญาของผู้เช่าคนก่อน
let CPU = 0;
const pdfc = (u, ad) => {
  const f = u && u.cpdf,
    id = u && u.id;
  return f
    ? `<button class="b b2 sm" style="border:1px solid var(--ac);color:var(--ac);max-width:100%;text-align:left" title="${e(f.name)}" onclick="cpv(${id})">${NI('doc')}${e(f.name.length > 24 ? f.name.slice(0, 22) + '…' : f.name)}</button><br><small class="mu">${Math.round(f.size / 1024)} KB</small>${ad ? ` <button class="b b2 sm" onclick="CPU=${id};$('#cpi').click()">เปลี่ยน</button> <button class="b b2 sm" onclick="cpd(${id})">ลบ</button>` : ''}`
    : ad
      ? `<button class="b b2 sm" onclick="CPU=${id};$('#cpi').click()">อัปโหลด PDF</button>`
      : '<small class="mu">ยังไม่มีไฟล์</small>';
};
function cpf(el) {
  const f = el.files[0];
  el.value = '';
  if (!f) return;
  if (f.type != 'application/pdf' && !/\.pdf$/i.test(f.name)) return alert('รองรับเฉพาะไฟล์ PDF');
  if (f.size > 2 * 1024 * 1024)
    return alert('ไฟล์ใหญ่เกิน 2MB (พื้นที่จัดเก็บของเบราว์เซอร์จำกัด)');
  const rd = new FileReader();
  rd.onload = () => {
    const u = D.users.find(x => x.id == CPU);
    if (!u) return;
    const old = u.cpdf;
    u.cpdf = { name: f.name, size: f.size, data: rd.result, t: Date.now() };
    try {
      localStorage.setItem(K, JSON.stringify(D));
    } catch (x) {
      if (old) u.cpdf = old;
      else delete u.cpdf;
      return alert('พื้นที่จัดเก็บเต็ม ไม่สามารถเก็บไฟล์นี้ได้');
    }
    lg('อัปโหลดไฟล์สัญญา ห้อง ' + u.room + ' (' + u.name + ')');
    R();
    tt('✓ อัปโหลดไฟล์สัญญา ห้อง ' + u.room + ' แล้ว');
  };
  rd.readAsDataURL(f);
}
function cpd(id) {
  const u = D.users.find(x => x.id == id);
  if (!u) return;
  cf('ลบไฟล์สัญญาของ ' + u.name + ' (ห้อง ' + u.room + ')?', () => {
    delete u.cpdf;
    lg('ลบไฟล์สัญญา ห้อง ' + u.room + ' (' + u.name + ')');
    save();
    R();
  });
}
function cpv(id) {
  const u = D.users.find(x => x.id == id);
  if (!u || !u.cpdf) return;
  const b = atob(u.cpdf.data.split(',')[1]),
    a = new Uint8Array(b.length);
  for (let i = 0; i < b.length; i++) a[i] = b.charCodeAt(i);
  const url = URL.createObjectURL(new Blob([a], { type: 'application/pdf' }));
  mo(
    `<h3>สัญญาเช่า ห้อง ${u.room}</h3><small class="mu">${e(u.name)} · ${e(u.cpdf.name)}</small><iframe src="${url}" style="width:100%;height:62vh;border:1px solid var(--ln);border-radius:12px;margin:10px 0"></iframe><a class="b b2" target="_blank" rel="noopener" href="${url}">เปิดในแท็บใหม่</a> <button class="b b2" onclick="cm()">ปิด</button>`
  );
  $('#mc').style.maxWidth = '860px';
}
const UN = () => D.users.filter(u => u.role == 'tenant' && !u.room && !u.out);
const contactsOf = () => {
  const L =
    D.contacts && D.contacts.length
      ? D.contacts
      : D.users
          .filter(u => u.role == 'admin' || u.role == 'owner')
          .map(u => ({ role: u.role, name: u.name, phone: u.tel }));
  const f = x => L.find(y => y.role == x) || {};
  return { owner: f('owner'), admin: f('admin') };
};
function contactCard() {
  const C = contactsOf(),
    rows =
      U.role == 'tenant'
        ? [
            ['เจ้าของกิจการ', C.owner],
            ['ผู้ดูแลระบบ', C.admin],
          ]
        : [['ผู้ดูแลระบบ', C.admin]];
  return `<h3 style="margin:28px 0 12px">เบอร์โทรติดต่อ</h3><div class="cd">${rows.map((x, i) => `<div class="bd" style="padding:10px 0;align-items:center;${i ? 'border-top:1px solid var(--ln)' : ''}"><span><b>${i + 1}. ${x[0]}</b><br><small class="mu">${e(x[1].name || '')}</small></span>${x[1].phone ? `<a class="b sm" style="text-decoration:none" href="tel:${e(x[1].phone)}">โทร ${e(x[1].phone)}</a>` : '<small class="mu">ยังไม่ได้ตั้งค่าเบอร์โทร</small>'}</div>`).join('')}</div>`;
}
function tkrp(id) {
  const t = D.tk.find(x => x.id == id),
    v = $('#rp_' + id).value.trim();
  if (!v) return alert('พิมพ์ข้อความตอบกลับ');
  t.reply = v;
  t.rby = U.name;
  t.rt = Date.now();
  if (t.s == 'open') t.s = 'prog';
  lg('ตอบคำขอ ' + t.title);
  save();
  R();
  tt('✓ ส่งคำตอบแล้ว');
}
