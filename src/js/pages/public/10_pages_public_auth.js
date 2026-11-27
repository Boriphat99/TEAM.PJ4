/* 10_pages_public_auth.js — หน้าต้อนรับ เข้าสู่ระบบ ลืมรหัสผ่าน ออกจากระบบ
   (แยกมาจาก script.js บรรทัด 900-951; โหลดเรียงตามเลขหน้าชื่อไฟล์ใน index.html) */
// ---- public pages ----
const bgL = c =>
  `<div class="bgL"><div class="orb px" style="--k:40;left:-8%;top:-10%;width:520px;height:520px"><i style="background:radial-gradient(circle,#0e7490cc,transparent 65%)"></i></div><div class="orb px" style="--k:-30;right:-10%;top:20%;width:620px;height:620px"><i style="background:radial-gradient(circle,#3730a3cc,transparent 65%);animation-delay:-4s"></i></div><div class="orb px" style="--k:20;left:30%;bottom:-20%;width:480px;height:480px"><i style="background:radial-gradient(circle,#0891b266,transparent 65%);animation-delay:-8s"></i></div><div class="g3"></div>${c ? '<canvas id="pc"></canvas>' : ''}</div>`;
const kp = () => {
  const N = D.rooms.length,
    occ = D.rooms.filter(r => tn(r.n)).length,
    cur = dper(),
    I = D.inv;
  return {
    N,
    op: Math.round((occ / N) * 100),
    ic: I.filter(i => i.s == 'paid' && i.per == cur).reduce((t, i) => t + tot(i), 0),
    un: I.filter(i => st(i) == 'unpaid').length,
    ov: I.filter(i => st(i) == 'over').length,
  };
};
const scr = id => {
  const x = document.getElementById(id);
  x && x.scrollIntoView({ behavior: 'smooth' });
};
// ข้อมูลหอสำหรับหน้าต้อนรับ: ระบบจริงใช้ public_info() (ห้องว่าง/ติดต่อ/อัตรา) · โหมดทดลองคำนวณจากข้อมูลในเครื่อง
var PUBI = null;
async function pubInfoLoad() {
  if (!SBON || !SBX.cl || window.TTM_PV) return;
  try {
    const { data, error } = await SBX.cl.rpc('public_info');
    if (error || !data) return;
    PUBI = data;
    if (!U && P == 'home') R();
  } catch (_) {}
}
function pinfo() {
  const S = D.set,
    q = PUBI && !window.TTM_PV ? PUBI : null;
  return {
    total: q ? +q.total : D.rooms.filter(r => r.st != 'maint').length,
    free: q ? +q.free : D.rooms.filter(r => vac(r)).length,
    phone: (q ? q.phone : S.tel) || '',
    line: (q ? q.line : S.line) || '',
    rent: +(q ? q.rent : S.rent) || 0,
    due: +(q ? q.due : S.due) || 5,
    fpd: +(q ? q.fpd : S.fpd) || 50,
    max: +(q ? q.max : S.max) || 0,
  };
}
const home0 = () => {
  const K = kp(),
    nm = e(D.set.name || 'T&T Mansion'),
    AD = D.users.find(u => u.role == 'admin') || { name: 'ผู้ดูแลระบบ' },
    OC = D.rooms.filter(r => tn(r.n)).length;
  // หน้าต้อนรับแบบเว็บไซต์ Apple: แถบเมนูบาง · ภาพเต็มจอ · หัวข้อใหญ่ · การ์ดมุมมน
  const feats = [
    ['⌂', 'ห้องพัก', 'จัดการห้อง สถานะ และผู้เช่า'],
    ['▥', 'สัญญาเช่า', 'บันทึกสัญญาและเงินแรกเข้า'],
    ['◔', 'มิเตอร์ไฟฟ้า', 'จดเลขมิเตอร์ คำนวณหน่วยไฟอัตโนมัติ'],
    ['▤', 'ใบแจ้งหนี้', 'ออกบิลทุกห้อง พร้อมค่าปรับอัตโนมัติ'],
    ['฿', 'ชำระเงิน', 'Dynamic PromptPay QR และแนบสลิป'],
    ['☰', 'รายงาน', 'สรุปรายได้และสถานะการชำระเงิน'],
  ];
  const stats = [
    [D.rooms.length, 'ห้องพักที่จัดการในระบบ'],
    ['3', 'กลุ่มผู้ใช้งาน เจ้าของ · ผู้ดูแล · ผู้เช่า'],
    ['฿' + D.set.rate, 'ค่าไฟต่อหน่วย คำนวณอัตโนมัติ'],
  ];
  const PIF = pinfo(),
    tel = PIF.phone.replace(/[^0-9+]/g, ''),
    lineUrl = 'https://line.me/R/ti/p/~' + encodeURIComponent(PIF.line),
    faq = [
      ['ชำระค่าห้องได้ช่องทางไหนบ้าง', 'สแกน QR พร้อมเพย์ในหน้าใบแจ้งหนี้ ยอดเงินขึ้นให้เอง แล้วแนบสลิปในระบบ หรือชำระเป็นเงินสดกับผู้ดูแลหอพัก'],
      ['ต้องจ่ายภายในวันไหน มีค่าปรับไหม', `ชำระภายในวันที่ ${PIF.due} ของเดือน ถ้าเลยกำหนดคิดค่าปรับวันละ ฿${fm(PIF.fpd)}${PIF.max ? ' สูงสุดไม่เกิน ฿' + fm(PIF.max) : ''}`],
      ['ส่งสลิปแล้วต้องทำอะไรต่อ', 'รอผู้ดูแลตรวจสอบ เมื่ออนุมัติแล้วจะได้ใบเสร็จในระบบ ถ้าเชื่อม LINE ไว้จะได้รับแจ้งทาง LINE ด้วย'],
      ['ใบเสร็จตรวจสอบได้ไหมว่าเป็นของจริง', 'ได้ ใบเสร็จทุกใบมี QR สแกนแล้วระบบจะบอกว่าใบเสร็จนี้ออกจากระบบจริงหรือไม่'],
      ['ได้บัญชีเข้าใช้งานจากไหน', 'ผู้ดูแลหอพักสร้างบัญชีให้ตอนทำสัญญาเช่า เข้าสู่ระบบครั้งแรกแล้วควรเปลี่ยนรหัสผ่านใหม่'],
      ['ลืมรหัสผ่านทำอย่างไร', 'กด “ลืมรหัสผ่าน” ที่หน้าเข้าสู่ระบบ ระบบจะส่งลิงก์ตั้งรหัสใหม่ไปที่อีเมล หรือติดต่อผู้ดูแลหอพัก'],
      ['รับแจ้งเตือนทาง LINE ได้ไหม', 'ได้ หลังเข้าสู่ระบบไปที่เมนู LINE แล้วเชื่อมบัญชี จะได้รับแจ้งบิลใหม่ เตือนก่อนครบกำหนด และใบเสร็จ'],
    ];
  const steps = ['ดูใบแจ้งหนี้ของห้องคุณ', 'สแกน QR ยอดขึ้นอัตโนมัติ', 'แนบสลิปโอนเงิน', 'ผู้ดูแลอนุมัติ รับใบเสร็จ'];
  return `<div class="apl">
<header class="ap-nav np"><div class="ap-in">
  <a class="ap-logo" onclick="scrollTo({top:0,behavior:'smooth'})"><img class="lgi" src="${LG}" alt=""><span>T&T MANSION</span></a>
  <nav class="ap-links"><a onclick="scrollTo({top:0,behavior:'smooth'})">หน้าแรก</a><a onclick="scr('hf')">ฟีเจอร์</a><a onclick="scr('hst')">ขั้นตอนชำระเงิน</a><a onclick="scr('hq')">คำถาม</a></nav>
  <div class="ap-tools">${TGL()}<button class="ap-login" onclick="go('login')">เข้าสู่ระบบ</button></div>
</div></header>

<section class="ap-hero">
  <div class="ap-hero-tx">
    <h1>ยินดีต้อนรับสู่<br><em>ระบบชำระค่าบริการของหอพัก</em></h1>
    <p class="ap-sub">ดูบิล จ่ายค่าห้อง และรับใบเสร็จได้ทางออนไลน์</p>
    <div class="ap-cta"><button class="ap-btn" onclick="go('login')">เริ่มใช้งาน</button><a class="ap-more" onclick="scr('hf')">ดูฟีเจอร์ ›</a></div>
    <div class="ap-ck"><span>แจ้งเตือนผ่าน LINE</span><span>ไม่ต้องติดตั้งแอป</span><span>ใช้ได้ทั้งมือถือและคอมพิวเตอร์</span><span>ยอด QR ขึ้นอัตโนมัติ</span></div>
    <div class="ap-dev"><div class="pvw"><div class="pv"><div class="pvb"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i></div><div class="pvx"><div class="pvd"><div class="app"><div class="sb np"><div class="logo" style="margin-bottom:14px"><img class="lgi" src="${LG}" alt=""><div>T&T MANSION<br><small class="ac">PAYMENT SYSTEM</small></div></div>${NVA.map(n => `<div class="nv ${n[0] == 'dash' ? 'on' : ''}"><i>${IC[n[0]] || n[2]}</i><span>${n[1]}</span></div>`).join('')}</div><div class="mn"><div class="top np"><input placeholder="ค้นหาห้อง ผู้เช่า หรือเลขที่บิล (กด Enter)"><span class="me">${av(AD, 36)}<b>${e(AD.name)}</b></span><span class="seg"><span class="${LANG == 'th' ? 'on' : ''}">TH</span><span class="${LANG == 'en' ? 'on' : ''}">EN</span></span><button class="b b2 sm">ออกจากระบบ</button></div>${pg.dash()}</div></div></div></div><span class="pvf">● แดชบอร์ดผู้ดูแลระบบ</span></div>
<div class="ph"><div class="pnt"></div><div class="phs"><div class="phtop"><span class="me">${av(AD, 26)}<b>${e(AD.name)}</b></span><span class="seg"><span class="${LANG == 'th' ? 'on' : ''}">TH</span><span class="${LANG == 'en' ? 'on' : ''}">EN</span></span></div><b class="pht">ภาพรวมการจัดการ</b><div class="po"><div class="phr">${BLD(30)}<div><b>${nm}</b><small>หอพัก · พิษณุโลก</small></div></div><small>${OC}/${K.N} ห้อง</small><b>${K.op}%</b><div class="pb"><i style="width:${K.op}%"></i></div></div><div class="pt2"><div><small>ห้องทั้งหมด</small><b>${K.N}</b></div><div><small>รายได้เดือนนี้</small><b>฿${fm(K.ic)}</b></div><div><small>ยังไม่ชำระ</small><b>${K.un}</b></div><div><small>ผิดนัดชำระ</small><b>${K.ov}</b></div></div></div><div class="pnb">${NVA.map(n => `<span class="${n[0] == 'dash' ? 'on' : ''}"><i>${IC[n[0]] || n[2]}</i>${n[1]}</span>`).join('')}</div></div></div>
  </div>
</section>

<section class="ap-sec ap-stats">
  <div class="ap-in">
    <h2 class="ap-r">ข้อมูลหอพัก</h2>
    <div class="ap-who ap-r"><small>รองรับผู้ใช้งาน 3 กลุ่ม</small><div><span>${IC.rooms} เจ้าของหอพัก</span><span>${IC.set} ผู้ดูแลระบบ</span><span>${PI} ผู้เช่า</span></div></div>
    <div class="ap-st">${stats.map(x => `<div class="ap-r"><b>${x[0]}</b><small>${x[1]}</small></div>`).join('')}</div>
    <p class="ap-note">ตัวเลขอ้างอิงจากการตั้งค่าของหอพัก ${e(D.set.name || 'T&T Mansion')}</p>
  </div>
</section>

<section class="ap-sec ap-feat" id="hf">
  <div class="ap-in">
    <h2 class="ap-r">ระบบนี้ใช้ทำอะไรได้บ้าง</h2>
    <div class="ap-grid">${feats.map(f => `<div class="ap-tile ap-r"><i>${IG[f[0]] || f[0]}</i><b>${f[1]}</b><small>${f[2]}</small></div>`).join('')}</div>
  </div>
</section>

<section class="ap-sec ap-vac">
  <div class="ap-in">
    <div class="ap-vbox ap-r">
      <div class="ap-vl">
        <span class="ap-live"><i></i>ข้อมูลล่าสุดจากระบบ</span>
        <h2>ห้องว่างตอนนี้</h2>
        <p>สนใจเข้าพัก สอบถามหรือนัดดูห้องกับผู้ดูแลหอพักได้เลย</p>
        <div class="ap-vbtn">${tel ? `<a class="ap-btn" href="tel:${e(tel)}">โทร ${e(PIF.phone)}</a>` : ''}${PIF.line ? `<a class="ap-more" href="${lineUrl}" target="_blank" rel="noopener">LINE: ${e(PIF.line)}</a>` : ''}</div>
      </div>
      <div class="ap-vr">
        <div class="ap-ring" style="--v:${PIF.total ? Math.round((PIF.free / PIF.total) * 100) : 0}"><b>${PIF.free}</b><small>ห้องว่าง</small></div>
        <small>จากทั้งหมด ${PIF.total} ห้อง${PIF.rent ? ' · ค่าเช่า ฿' + fm(PIF.rent) + '/เดือน' : ''}</small>
      </div>
    </div>
  </div>
</section>

<section class="ap-sec ap-steps" id="hst">
  <div class="ap-in">
    <h2 class="ap-r">วิธีจ่ายค่าห้อง</h2>
    <ol class="ap-ol">${steps.map((t, i) => `<li class="ap-r"><b>${i + 1}</b><span>${t}</span></li>`).join('')}</ol>
    <div class="ap-cta ap-cta2 ap-r"><div class="ap-pill"><span class="ap-ptx"><b>มีบัญชีแล้ว?</b> เข้าสู่ระบบเพื่อดูบิลและจ่ายค่าห้อง</span><button class="ap-btn ap-go" onclick="go('login')">เริ่มใช้งาน<i aria-hidden="true">→</i></button></div><a class="ap-qlink" onclick="scr('hq')">มีคำถาม? ดูคำถามที่พบบ่อย</a></div>
  </div>
</section>

<section class="ap-sec ap-faq" id="hq">
  <div class="ap-in">
    <h2 class="ap-r">คำถามที่พบบ่อย</h2>
    <p class="ap-fsub ap-r">เรื่องที่ผู้เช่าถามกันบ่อย กดที่คำถามเพื่อดูคำตอบ</p>
    <div class="ap-fq">
      <div class="ap-qs ap-r">${faq.map((q, i) => `<details class="ap-q"><summary><em>${String(i + 1).padStart(2, '0')}</em><span>${q[0]}</span><i aria-hidden="true"></i></summary><div class="ap-qa"><p>${q[1]}</p></div></details>`).join('')}</div>
      <aside class="ap-fask ap-r">
        <b>ยังมีคำถามอยู่?</b>
        <p>ถามผู้ดูแลหอพักได้โดยตรง ตอบเรื่องห้องพัก บิล และการใช้งานระบบ</p>
        ${tel ? `<a class="ap-btn" href="tel:${e(tel)}">โทร ${e(PIF.phone)}</a>` : ''}${PIF.line ? `<a class="ap-fline" href="${lineUrl}" target="_blank" rel="noopener">LINE: ${e(PIF.line)}</a>` : ''}${!tel && !PIF.line ? `<button class="ap-btn" onclick="go('login')">เข้าสู่ระบบ</button>` : ''}
      </aside>
    </div>
  </div>
</section>

<footer class="ap-foot">
  <div class="ap-in ap-fg">
    <div class="ap-fb"><a class="ap-logo" onclick="scrollTo({top:0,behavior:'smooth'})"><img class="lgi" src="${LG}" alt=""><span>T&T MANSION</span></a><small>ระบบชำระค่าบริการของหอพัก ${nm}</small></div>
    <div class="ap-fc"><b>เมนู</b><a onclick="scrollTo({top:0,behavior:'smooth'})">หน้าแรก</a><a onclick="scr('hf')">ฟีเจอร์</a><a onclick="scr('hst')">ขั้นตอนชำระเงิน</a><a onclick="scr('hq')">คำถามที่พบบ่อย</a></div>
    <div class="ap-fc"><b>ติดต่อหอพัก</b>${tel ? `<a href="tel:${e(tel)}">โทร ${e(PIF.phone)}</a>` : ''}${PIF.line ? `<a href="${lineUrl}" target="_blank" rel="noopener">LINE: ${e(PIF.line)}</a>` : ''}<a onclick="go('login')">เข้าสู่ระบบ</a></div>
  </div>
  <div class="ap-in ap-fcopy">© ${new Date().getFullYear()} T&T Mansion Payment System · ${APP_V}</div>
</footer>
</div>`;

};
const home = () => {
  if (PUBD) {
    try {
      return withPub(home0);
    } catch (x) {
      console.error(x);
      PUBD = null;
    }
  }
  return home0();
};
let LP = 0;
function lp() {
  cancelAnimationFrame(LP);
  const el = $('#lp'),
    cv = $('#pc');
  if (!el || !cv) return;
  const x = cv.getContext('2d'),
    N = innerWidth < 700 ? 28 : 60;
  let W, H;
  const ps = [];
  const sz = () => {
    W = cv.width = innerWidth;
    H = cv.height = innerHeight;
  };
  sz();
  window.onresize = sz;
  for (let i = 0; i < N; i++)
    ps.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.8 + 0.4,
      v: Math.random() * 0.35 + 0.08,
      a: Math.random() * 0.6 + 0.2,
    });
  el.onpointermove = e => {
    el.style.setProperty('--mx', ((e.clientX / innerWidth) * 2 - 1).toFixed(3));
    el.style.setProperty('--my', ((e.clientY / innerHeight) * 2 - 1).toFixed(3));
  };
  (function f() {
    if (!$('#pc')) return;
    x.clearRect(0, 0, W, H);
    x.shadowColor = '#ef4444';
    x.shadowBlur = 8;
    for (const p of ps) {
      p.y -= p.v;
      p.x += Math.sin(p.y / 60) * 0.15;
      if (p.y < -5) {
        p.y = H + 5;
        p.x = Math.random() * W;
      }
      x.beginPath();
      x.arc(p.x, p.y, p.r, 0, 7);
      x.fillStyle = 'rgba(239,68,68,' + p.a + ')';
      x.fill();
    }
    LP = requestAnimationFrame(f);
  })();
}
const fld = (id, l, ic, t = 'text', x = '') =>
  `<label>${l}</label><div class="fi"><i>${IG[ic] || ic}</i><input id="${id}" type="${t}" ${t == 'password' ? 'style="padding-right:64px"' : ''} ${x}>${t == 'password' ? `<u onclick="tg('${id}',this)">แสดง</u>` : ''}</div>`;
const tg = (id, b) => {
    const el = $('#' + id);
    el.type = el.type == 'password' ? 'text' : 'password';
    b.textContent = el.type == 'password' ? 'แสดง' : 'ซ่อน';
  },
  fl = (m, p) => {
    $('#em').value = m;
    $('#pw').value = p;
  };
const auth = (t, s, h, l, lk, lq) =>
  `${bgL(0)}${TGL('fx-tr')}<div class="wrap au"><div class="al"><div class="rings px" style="--k:14"><i class="r1"><b></b></i><i class="r2"><b></b></i></div><div class="logo"><img class="lgi" src="${LG}" alt=""> T&T MANSION</div><h1 class="gt">${t}</h1><p class="mu">${s}</p></div><div class="cd gc">${P == 'forgot' ? '' : '<div class="tabs"><span class="' + (P == 'login' ? 'on' : '') + '" onclick="go(\'login\')">เข้าสู่ระบบ</span></div>'}${h}<p style="text-align:center;margin:18px 0 0" class="mu">${l} <b class="ac" style="cursor:pointer" onclick="go('${lq}')">${lk}</b></p></div></div>`;
const login = () =>
  auth(
    'ยินดีต้อนรับ',
    'เข้าสู่ระบบเพื่อตรวจสอบบิลและสถานะการชำระเงินของห้องพัก',
    `<div class="ah"><span class="ib">${IC.lock}</span><div><h2>เข้าสู่ระบบ</h2><small class="mu">สำหรับผู้เช่าและผู้ดูแล</small></div><b class="ac bk" onclick="go('home')">‹ หน้าหลัก</b></div>${fld('em', 'อีเมล', '✉', 'email', `autocomplete="username" placeholder="name@example.com"`)}${fld('pw', 'รหัสผ่าน', '🔑', 'password', `autocomplete="current-password" placeholder="••••••••" onkeydown="if(event.key=='Enter')dl()"`)}<div style="text-align:right;margin:-6px 0 12px"><span class="ac" style="cursor:pointer;font-size:13px" onclick="go('forgot')">ลืมรหัสผ่าน?</span></div><button class="b go" style="width:100%" onclick="dl()">เข้าสู่ระบบ →</button>${typeof pvLoginBox == 'function' && (window.TTM_PV || SBON) ? pvLoginBox() : `<div class="dm"><small class="mu">ทดลองใช้งาน</small><span><button class="b b2 sm" onclick="fl('admin@ttmansion.local','admin123')">ผู้ดูแล</button> <button class="b b2 sm" onclick="fl('owner@ttmansion.local','owner123')">เจ้าของ</button> <button class="b b2 sm" onclick="fl('nattapol@ttmansion.local','1234')">ผู้เช่า</button></span></div>`}`,
    'ยังไม่มีบัญชี? ติดต่อผู้ดูแลหอพักเพื่อขอสร้างบัญชี',
    '',
    'login'
  );
function dl() {
  const u = D.users.find(
    u => u.email == $('#em').value.trim().toLowerCase() && u.pw == $('#pw').value
  );
  if (!u) return alert('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
  if (u.out && !D.inv.some(i => i.uid == u.id && i.s != 'paid'))
    return alert('บัญชีนี้ย้ายออกแล้ว กรุณาติดต่อผู้ดูแล');
  enter(u, 0, 1);
}
function enter(u, pg2, how) {
  U = u;
  applyPf(u);
  P = pg2 || 'x';
  try {
    STO.setItem('ttm_s', u.id);
  } catch (x) {}
  R();
  if (how) tt('✓ เข้าสู่ระบบสำเร็จ · ' + (RL[u.role] || '') + ' ' + u.name);
}
function genPw() {
  const c = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  // สุ่มจนได้รหัสที่มีทั้งตัวอักษรและตัวเลข (ผ่านเกณฑ์ pwBad)
  do {
    s = '';
    const a = new Uint32Array(8);
    crypto.getRandomValues(a);
    for (const v of a) s += c[v % c.length];
  } while (pwBad(s));
  return s;
}
const forgot = () =>
  SBON
    ? forgotSB()
    : auth(
        'ลืมรหัสผ่าน',
        'ยืนยันตัวตนด้วยอีเมลและเบอร์โทรที่ลงทะเบียนไว้ แล้วตั้งรหัสผ่านใหม่',
        `<div class="ah"><span class="ib">${IC.key}</span><div><h2>ตั้งรหัสผ่านใหม่</h2><small class="mu">ใช้ได้เมื่อบัญชีมีเบอร์โทร</small></div><b class="ac bk" onclick="go('login')">‹ กลับ</b></div>${fld('em', 'อีเมล', '✉', 'email')}${fld('rt', 'เบอร์โทรที่ลงทะเบียน', '☎', 'tel')}${fld('pw', 'รหัสผ่านใหม่ (อย่างน้อย 8 ตัว)', '🔑', 'password')}${fld('pw2', 'ยืนยันรหัสผ่านใหม่', '🔑', 'password')}<button class="b go" style="width:100%" onclick="fp()">ตั้งรหัสผ่านใหม่ →</button><div class="note">หากบัญชียังไม่มีเบอร์โทร (เช่น ผู้ดูแลระบบ) ให้ติดต่อผู้ดูแลเพื่อรีเซ็ตรหัสผ่านให้</div>`,
        'จำรหัสผ่านได้แล้ว?',
        'เข้าสู่ระบบ',
        'login'
      );
function fp() {
  const m = $('#em').value.trim().toLowerCase(),
    t = $('#rt').value.replace(/\D/g, ''),
    w = $('#pw').value,
    u = D.users.find(x => x.email == m);
  if (!m || !t || !w) return alert('กรอกข้อมูลให้ครบ');
  if (!u || !u.tel) return alert('ไม่พบบัญชี หรือบัญชีนี้ยังไม่มีเบอร์โทร กรุณาติดต่อผู้ดูแลระบบ');
  if (u.tel.replace(/\D/g, '') != t) return alert('เบอร์โทรไม่ตรงกับที่ลงทะเบียนไว้');
  if (u.out) return alert('บัญชีนี้ย้ายออกแล้ว กรุณาติดต่อผู้ดูแล');
  if (pwBad(w, m)) return alert(pwBad(w, m));
  if (w != $('#pw2').value) return alert('ยืนยันรหัสผ่านไม่ตรงกัน');
  u.pw = w;
  save();
  go('login');
  tt('✓ ตั้งรหัสผ่านใหม่สำเร็จ กรุณาเข้าสู่ระบบ');
}
function lof(r, err) {
  // ตัวกันเหนียว: ถ้าวาดหน้าต้อนรับไม่สำเร็จ ให้ล้างเซสชันแล้วโหลดหน้าแรกใหม่
  try {
    Object.keys(localStorage)
      .filter(k => /^sb-.*-auth-token/.test(k) || k == 'ttm_s')
      .forEach(k => localStorage.removeItem(k));
  } catch (x) {}
  try {
    sessionStorage.setItem('ttm_lo', r || '1');
  } catch (x) {}
  try {
    console.error('logout render failed:', err);
  } catch (x) {}
  location.replace(location.pathname + location.search);
}
function lok() {
  return !document.querySelector('#app > .app');
}
function lout(r) {
  let bad = null;
  try {
    R();
  } catch (x) {
    bad = x;
    PUBD = null;
    try {
      R();
      bad = null;
    } catch (y) {
      bad = y;
    }
  }
  if (bad || !lok()) return lof(r, bad);
  try {
    tt('✓ ออกจากระบบสำเร็จ' + (r ? ' · ' + RL[r] : ''));
  } catch (x) {}
  setTimeout(() => {
    if (!U && !lok()) lof(r, 'late re-render');
  }, 1500);
}
// ปุ่มออกจากระบบ: ถามยืนยันก่อน กันกดพลาดแล้วหลุดออกทันที
function askOut() {
  cf('ต้องการออกจากระบบใช่หรือไม่?', () => out());
  const y = $('#dy');
  if (y) y.textContent = 'ออกจากระบบ';
}
function out() {
  const r = U && U.role;
  U = null;
  P = 'home';
  try {
    STO.removeItem('ttm_s');
  } catch (x) {}
  lout(r);
}
