/* 31_preview_mode.js — โหมดตัวอย่างระบบ (?preview)
   ให้คนทั่วไป เช่น อาจารย์ ดูหน้าตาภายในระบบได้โดยไม่ต้องมีบัญชี
   - ทำงานแบบออฟไลน์ในแท็บนี้เท่านั้น (sessionStorage) ไม่ต่อฐานข้อมูลจริง ไม่ส่ง LINE
   - ข้อมูลทั้งหมดเป็นข้อมูลสมมติ สร้างใหม่ทุกครั้งที่เปิดโหมดตัวอย่าง
   - กดออกจากโหมดตัวอย่าง หรือปิดแท็บ ข้อมูลตัวอย่างจะหายไป */

// ---------- ปุ่มในหน้าเข้าสู่ระบบ ----------
function pvLoginBox() {
  if (!window.TTM_PV)
    return `<div class="pvb"><small class="mu">อยากดูหน้าตาระบบก่อน? ไม่ต้องมีบัญชี</small><button class="b b2" style="width:100%" onclick="pvOpen()">ดูตัวอย่างระบบ (ข้อมูลสมมติ)</button></div>`;
  return `<div class="pvb on"><b>โหมดตัวอย่างระบบ</b><small class="mu">ข้อมูลทั้งหมดเป็นข้อมูลสมมติ ไม่ใช่ข้อมูลจริง · เลือกมุมมองที่อยากดู</small><div class="pvr"><button class="b" onclick="pvEnter('admin')">ผู้ดูแลระบบ</button><button class="b" onclick="pvEnter('owner')">เจ้าของกิจการ</button><button class="b" onclick="pvEnter('tenant')">ผู้เช่า</button></div><span class="ac" style="cursor:pointer;font-size:13px" onclick="pvExit()">ออกจากโหมดตัวอย่าง</span></div>`;
}
function pvOpen() {
  location.href = location.pathname + '?preview';
}
function pvExit() {
  try {
    ['ttm_pv', 'ttm_pv_d', 'ttm_s'].forEach(k => sessionStorage.removeItem(k));
  } catch (x) {}
  location.href = location.pathname;
}
function pvEnter(role) {
  const u =
    role == 'tenant'
      ? D.users.find(x => x.role == 'tenant' && x.room == 102 && !x.out)
      : D.users.find(x => x.role == role);
  if (u) enter(u, 0, 1);
}

// ---------- ข้อมูลสมมติ ----------
function pvSeed() {
  const now = Date.now(),
    DAY = 864e5,
    per0 = pcur(),
    perAdd = (p, k) => {
      const [y, m] = p.split('-').map(Number),
        d = new Date(y, m - 1 + k, 1);
      return d.getFullYear() + '-' + pad(d.getMonth() + 1);
    },
    pers = [perAdd(per0, -2), perAdd(per0, -1), per0];
  D.set = {
    rent: 3600,
    rate: 8,
    dep: 7600,
    due: 5,
    max: 250,
    fpd: 50,
    pp: '0800000000',
    name: 'T&T Mansion (ตัวอย่าง)',
    addr: '99/9 ถนนตัวอย่าง ตำบลตัวอย่าง อำเภอเมือง จังหวัดตัวอย่าง 10000',
    tel: '080-000-0000',
    tax: '',
    payee: 'หอพักตัวอย่าง',
    url: '',
    line: '@example',
  };
  D.rooms = ROOMS.map((n, i) => ({ n, m: 1000 + i * 37 }));
  D.rooms.find(r => r.n == 309).st = 'maint';
  const T = [
    [101, 'สมชาย ใจดี', 'm', 14],
    [102, 'สมหญิง รักเรียน', 'f', 11],
    [103, 'อนันต์ มั่นคง', 'm', 9],
    [105, 'มาลี ศรีสุข', 'f', 7],
    [201, 'กิตติ มีสุข', 'm', 13],
    [202, 'วรัญญา แสงทอง', 'f', 10],
    [204, 'ธนพล ใจงาม', 'm', 5],
    [206, 'ปิยะนุช บุญมา', 'f', 4],
    [301, 'ณัฐพล ศรีสุข', 'm', 12],
    [303, 'ชลธิชา พรหมดี', 'f', 3],
  ];
  D.users = [
    { id: 1, name: 'ผู้ดูแลตัวอย่าง', email: 'admin@example.com', pw: 'preview', role: 'admin' },
    { id: 99, name: 'เจ้าของหอตัวอย่าง', email: 'owner@example.com', pw: 'preview', role: 'owner' },
    ...T.map((x, i) => ({
      id: i + 2,
      name: x[1],
      email: 'tenant' + x[0] + '@example.com',
      pw: 'preview',
      role: 'tenant',
      room: x[0],
      g: x[2],
      tel: '08000' + String(x[0]).padStart(5, '0'),
      cs: now - x[3] * 30 * DAY,
      // 1 ห้องสัญญาใกล้หมด ให้เห็นการแจ้งเตือนสัญญา
      ce: x[0] == 204 ? now + 40 * DAY : now + (12 - (x[3] % 12)) * 30 * DAY + 365 * DAY,
      sm: 1000,
    })),
    // อดีตผู้เช่า 1 คน
    {
      id: 30,
      name: 'วิชัย ย้ายออกแล้ว',
      email: 'old@example.com',
      pw: 'preview',
      role: 'tenant',
      room: 104,
      g: 'm',
      tel: '0800000104',
      cs: now - 400 * DAY,
      out: now - 60 * DAY,
    },
  ];
  // บิล 3 รอบล่าสุด: 2 รอบก่อนชำระแล้วเกือบหมด · รอบปัจจุบันมีทุกสถานะ
  const mkSlip = (ref, amt) => {
    const c = document.createElement('canvas');
    c.width = 360;
    c.height = 560;
    const x = c.getContext('2d');
    x.fillStyle = '#f3f6f9';
    x.fillRect(0, 0, 360, 560);
    x.fillStyle = '#1e3a5f';
    x.fillRect(0, 0, 360, 84);
    x.fillStyle = '#fff';
    x.font = 'bold 24px sans-serif';
    x.fillText('โอนเงินสำเร็จ', 108, 52);
    x.fillStyle = '#c0392b';
    x.font = 'bold 18px sans-serif';
    x.fillText('สลิปตัวอย่าง · ไม่ใช่สลิปจริง', 60, 130);
    x.fillStyle = '#222';
    x.font = '18px sans-serif';
    x.fillText('ไปยัง หอพักตัวอย่าง', 30, 190);
    x.fillText('จำนวนเงิน', 30, 250);
    x.font = 'bold 36px sans-serif';
    x.fillText(amt + ' บาท', 30, 300);
    x.font = '15px sans-serif';
    x.fillText('เลขที่รายการ ' + ref, 30, 370);
    return c.toDataURL('image/jpeg', 0.8);
  };
  let rcn = 0;
  const units = (room, k) => 80 + ((room * 7 + k * 13) % 70),
    plan = {
      // รอบปัจจุบัน: สถานะของแต่ละห้อง
      101: 'paid',
      102: 'unpaid',
      103: 'pending',
      105: 'paid',
      201: 'pending',
      202: 'unpaid',
      204: 'paid',
      206: 'unpaid',
      301: 'paid',
      303: 'unpaid',
    };
  D.inv = [];
  const meter = {};
  T.forEach(t => (meter[t[0]] = 1000));
  pers.forEach((per, k) => {
    T.forEach(t => {
      const room = t[0];
      // ผู้เช่าที่เพิ่งเข้า ไม่มีบิลรอบเก่า
      if (t[3] < 3 - k) return;
      const u = D.users.find(x => x.room == room && x.role == 'tenant' && !x.out),
        n = units(room, k),
        pv = meter[room];
      meter[room] = pv + n;
      let s = k == 2 ? plan[room] : 'paid';
      // ห้อง 202 ค้างรอบก่อนด้วย ให้เห็นหน้าติดตามหนี้ค้าง
      if (room == 202 && k == 1) s = 'unpaid';
      const i = {
        id: 'INV' + per.replace('-', '') + '-' + room,
        room,
        uid: u.id,
        per,
        pv,
        u: n,
        el: n * D.set.rate,
        x: room == 201 && k == 1 ? 350 : 0,
        xn: room == 201 && k == 1 ? 'ค่าซ่อมก๊อกน้ำ' : '',
        rent: D.set.rent,
        fine: 0,
        s,
        iss: new Date(...per.split('-').map((v, j) => (j ? +v - 1 : +v)), 28).getTime(),
      };
      if (s == 'paid' || s == 'pending') {
        const cash = (room == 105 || room == 301) && k != 1;
        i.mt = cash ? 'cash' : 'qr';
        i.sub = i.iss + (3 + (room % 5)) * DAY;
        if (!cash) {
          i.slip = mkSlip('DEMO' + per.replace('-', '') + room, fm(tot(i)));
          i.sref = 'DEMO' + per.replace('-', '') + room;
          i.sbank = '004';
        }
        if (s == 'paid') {
          i.paid = i.sub + DAY;
          rcn++;
          i.rc = 'RC' + per.replace('-', '') + '-' + String(rcn).padStart(4, '0');
        }
      }
      D.inv.push(i);
    });
  });
  // บิลของอดีตผู้เช่า (ชำระครบก่อนย้ายออก)
  D.inv.push({
    id: 'INV' + pers[0].replace('-', '') + '-104',
    room: 104,
    uid: 30,
    per: pers[0],
    pv: 2100,
    u: 95,
    el: 95 * D.set.rate,
    x: 0,
    xn: '',
    rent: D.set.rent,
    fine: 0,
    s: 'paid',
    mt: 'cash',
    iss: now - 75 * DAY,
    sub: now - 72 * DAY,
    paid: now - 72 * DAY,
    rc: 'RC' + pers[0].replace('-', '') + '-' + String(++rcn).padStart(4, '0'),
  });
  // เลขมิเตอร์ล่าสุดของห้อง = เลขสุดท้ายในบิล
  D.rooms.forEach(r => {
    if (meter[r.n]) r.m = meter[r.n];
  });
  D.news = [
    {
      id: 'N2',
      t: now - 2 * DAY,
      title: 'แจ้งปิดน้ำชั่วคราว (ตัวอย่าง)',
      body: 'วันเสาร์นี้ เวลา 09:00–12:00 น. จะปิดน้ำเพื่อล้างแท็งก์ ขออภัยในความไม่สะดวก',
      by: 'ผู้ดูแลตัวอย่าง',
    },
    {
      id: 'N1',
      t: now - 20 * DAY,
      title: 'ชำระค่าเช่าผ่าน QR ได้แล้ว (ตัวอย่าง)',
      body: 'ผู้เช่าสามารถสแกน QR ในระบบเพื่อชำระเงิน แล้วแนบสลิปได้ทันที ไม่ต้องส่งสลิปทางแชท',
      by: 'ผู้ดูแลตัวอย่าง',
    },
  ];
  D.tk = [
    {
      id: 'TK2',
      uid: 4,
      name: 'อนันต์ มั่นคง',
      room: 103,
      cat: 'ซ่อมบำรุง',
      title: 'แอร์ไม่เย็น (ตัวอย่าง)',
      body: 'แอร์ห้อง 103 เปิดแล้วไม่ค่อยเย็นตั้งแต่เมื่อวาน รบกวนช่วยตรวจสอบด้วยครับ',
      imgs: [],
      t: now - DAY,
      s: 'open',
    },
    {
      id: 'TK1',
      uid: 3,
      name: 'สมหญิง รักเรียน',
      room: 102,
      cat: 'ปัญหาการชำระเงิน',
      title: 'สแกน QR แล้วยอดไม่ขึ้น (ตัวอย่าง)',
      body: 'ลองสแกนด้วยแอปธนาคารแล้วยอดเงินไม่ขึ้นค่ะ',
      imgs: [],
      t: now - 9 * DAY,
      s: 'done',
      reply: 'ลองอัปเดตแอปธนาคารเป็นเวอร์ชันล่าสุด แล้วสแกนใหม่อีกครั้งนะคะ',
      rby: 'ผู้ดูแลตัวอย่าง',
      rt: now - 8 * DAY,
    },
  ];
  D.log = [
    { t: now - 3 * 36e5, by: 'ผู้ดูแลตัวอย่าง', a: 'อนุมัติการชำระเงินห้อง 101' },
    { t: now - 26 * 36e5, by: 'ผู้ดูแลตัวอย่าง', a: 'ออกบิลประจำเดือน ' + mon(per0) },
    { t: now - 2 * DAY, by: 'ผู้ดูแลตัวอย่าง', a: 'ประกาศข่าว: แจ้งปิดน้ำชั่วคราว (ตัวอย่าง)' },
  ];
  D._pv = 1;
  save();
}

// ---------- เริ่มโหมดตัวอย่าง ----------
if (window.TTM_PV) {
  document.documentElement.classList.add('pv-mode');
  if (!D._pv) pvSeed();
  // เปิดลิงก์ ?preview ครั้งแรก: ไปหน้าเลือกมุมมองเลย
  if (!U && P == 'home') {
    P = 'login';
    R();
  }
  // ป้าย "โหมดตัวอย่าง" บนแถบด้านบนทุกหน้าในระบบ
  const _pvR = R;
  R = function () {
    const r = _pvR.apply(this, arguments);
    try {
      const top = document.querySelector('.mn .top');
      if (top && !top.querySelector('.pvtag')) {
        const s = document.createElement('span');
        s.className = 'pvtag';
        s.innerHTML =
          '<b>' +
          T2('โหมดตัวอย่าง') +
          '</b><small>' +
          T2('ข้อมูลสมมติ') +
          '</small><button type="button" onclick="pvExit()">' +
          (LANG == 'en' ? 'Exit' : 'ออก') +
          '</button>';
        top.insertBefore(s, top.firstChild);
      }
    } catch (x) {}
    return r;
  };
  R();
}
