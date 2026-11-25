/* 29_line.js — แจ้งเตือนทาง LINE: การ์ดเชื่อมบัญชีในหน้าโปรไฟล์ + หน้าติดตามหนี้ค้าง
   ข้อมูลจากฐานข้อมูล: line_links (สถานะการเชื่อม), notify_log (การเตือนล่าสุด)
   RPC: line_link_code(), line_unlink(), line_remind(p_invoice), line_remind_overdue() */
const LN = { lk: {}, nl: {}, code: null, exp: 0, tm: null };
IC.debt = SV('<path d="M5 21V4"/><path d="M5 4h12l-2.5 4.5L17 13H5"/>');

// โหลดสถานะ LINE ต่อท้ายการโหลดข้อมูลหลัก (ไม่ให้ล้มทั้งหน้าถ้าตารางนี้มีปัญหา)
{
  const _ld = sbLoad;
  sbLoad = async function () {
    await _ld();
    await lnLoad();
  };
}
async function lnLoad() {
  const c = SBX.cl;
  if (!c || !SBX.uid) return;
  const me = D.users.find(x => x._uid == SBX.uid);
  try {
    const r = await c.from('line_links').select('user_id, linked_at');
    LN.lk = {};
    ((r && r.data) || []).forEach(x => (LN.lk[x.user_id] = x.linked_at));
    if (me && me.role != 'tenant') {
      const n = await c
        .from('notify_log')
        .select('invoice_id, kind, ok, sent_at')
        .in('kind', ['due_soon', 'overdue', 'last_day', 'manual'])
        .order('sent_at', { ascending: false })
        .limit(500);
      LN.nl = {};
      ((n && n.data) || []).forEach(x => {
        if (x.invoice_id && !LN.nl[x.invoice_id]) LN.nl[x.invoice_id] = x;
      });
    }
  } catch (_) {
    /* ไม่มีข้อมูล LINE ก็ใช้งานส่วนอื่นได้ตามปกติ */
  }
}
const lnOn = uid => !!(uid && LN.lk[uid]);
const lnAdd = () => {
  const id = lnBotId(D.set.lineBot);
  return id ? lnUrl(id) : '';
};

// ---------- การ์ดในหน้าโปรไฟล์ (ผู้เช่า + ผู้ดูแลระบบ + เจ้าของกิจการ) ----------
function lnCard() {
  const h = '<h3>แจ้งเตือนทาง LINE</h3>';
  if (!SBX.cl)
    return `<div class="cd" id="lnc">${h}<p class="mu" style="margin:8px 0 0">ใช้ได้เมื่อเชื่อมฐานข้อมูลจริง</p></div>`;
  const what =
    U.role == 'tenant'
      ? 'รับแจ้งเตือนเมื่อบิลออก ใกล้ครบกำหนด เลยกำหนด และเมื่อใบเสร็จออกแล้ว'
      : 'รับแจ้งเตือนทันทีเมื่อมีผู้เช่าส่งสลิปชำระเงิน';
  const at = LN.lk[SBX.uid];
  if (at)
    return `<div class="cd" id="lnc">${h}<p class="mu" style="margin:6px 0 12px">${what}</p><div class="bd"><span><span class="pl g">เชื่อมแล้ว</span> <small class="mu">ตั้งแต่ ${dt(at)}</small></span><button class="b b2 sm" onclick="lnUnlink()">ยกเลิกการเชื่อม</button></div></div>`;
  const add = lnAdd(),
    live = LN.code && LN.exp > Date.now();
  return `<div class="cd" id="lnc">${h}<p class="mu" style="margin:6px 0 12px">${what}</p><ol style="margin:0 0 14px;padding-left:20px;line-height:1.9"><li>เพิ่มเพื่อนบอทแจ้งเตือนของหอพัก ${add ? `<a class="b b2 sm" href="${add}" target="_blank" rel="noopener">เพิ่มเพื่อน ${e(lnBotId(D.set.lineBot))}</a>` : '<small class="mu">(ผู้ดูแลยังไม่ได้ตั้งค่าบอทในหน้าช่วยเหลือ)</small>'}</li><li>กดขอรหัส แล้วพิมพ์รหัส 6 หลักส่งในแชทของบอท</li></ol>${
    live
      ? `<div style="text-align:center;padding:12px;border:1px dashed var(--ac);border-radius:12px"><small class="mu">รหัสเชื่อมบัญชี</small><div style="font-size:32px;font-weight:700;letter-spacing:8px;color:var(--ac)">${LN.code}</div><small class="mu">หมดอายุใน <b id="lnt">${lnLeft()}</b> · ระบบจะเปลี่ยนสถานะให้เองเมื่อเชื่อมสำเร็จ</small></div><br><button class="b b2 sm" onclick="lnCode()">ขอรหัสใหม่</button> <button class="b b2 sm" onclick="lnCheck(1)">ตรวจสถานะ</button>`
      : `<button class="b" onclick="lnCode()">ขอรหัส</button>`
  }</div>`;
}
const lnLeft = () => {
  const s = Math.max(0, Math.ceil((LN.exp - Date.now()) / 1000));
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
};
{
  const _p = pg.prof;
  pg.prof = () => _p().replace(/<\/div><\/div>$/, lnCard() + '</div></div>');
}
async function lnCode() {
  const r = await SBX.cl.rpc('line_link_code');
  if (r.error) return alert('ขอรหัสไม่สำเร็จ: ' + thErr(r.error));
  LN.code = r.data;
  LN.exp = Date.now() + 10 * 60e3;
  clearInterval(LN.tm);
  let k = 0;
  LN.tm = setInterval(() => {
    const t = $('#lnt');
    if (!t || LN.exp <= Date.now()) {
      clearInterval(LN.tm);
      LN.code = null;
      if (t) R();
      return;
    }
    t.textContent = lnLeft();
    if (++k % 4 == 0) lnCheck(0);
  }, 1000);
  R();
}
async function lnCheck(say) {
  const r = await SBX.cl.from('line_links').select('linked_at').eq('user_id', SBX.uid);
  const x = ((r && r.data) || [])[0];
  if (x) {
    LN.lk[SBX.uid] = x.linked_at;
    LN.code = null;
    clearInterval(LN.tm);
    if (P == 'prof') R();
    tt('✓ เชื่อม LINE เรียบร้อยแล้ว');
  } else if (say) tt('ยังไม่ได้รับรหัสในแชท LINE');
}
function lnUnlink() {
  cf('ยกเลิกการเชื่อม LINE?\nจะไม่ได้รับแจ้งเตือนทาง LINE อีกจนกว่าจะเชื่อมใหม่', async () => {
    const r = await SBX.cl.rpc('line_unlink');
    if (r.error) return alert('ยกเลิกไม่สำเร็จ: ' + thErr(r.error));
    delete LN.lk[SBX.uid];
    R();
    tt('ยกเลิกการเชื่อม LINE แล้ว');
  });
}

// ---------- หน้าติดตามหนี้ค้าง (ผู้ดูแลส่งเตือนได้ · เจ้าของกิจการดูอย่างเดียว) ----------
pg.debt = () => {
  const ad = U.role == 'admin',
    L = D.inv.filter(i => i.s == 'unpaid' && late(i) > 0).sort((a, b) => late(b) - late(a)),
    sum = L.reduce((s, i) => s + tot(i), 0),
    nLk = L.filter(i => lnOn((tu(i) || {})._uid)).length;
  const row = i => {
    const u = tu(i) || {},
      on = lnOn(u._uid),
      n = LN.nl[i._id];
    return `<tr><td>ห้อง ${i.room}</td><td>${e(u.name || '-')}</td><td>${mlab(i)}</td><td><b>฿${fm(tot(i))}</b></td><td><span class="pl ${late(i) > 5 ? 'p' : 'r'}">เกิน ${late(i)} วัน</span></td><td>${on ? '<span class="pl g">เชื่อมแล้ว</span>' : '<span class="mu">ยังไม่เชื่อม</span>'}</td><td>${n ? dt(n.sent_at) + (n.ok ? '' : ' <small class="mu">(ส่งไม่สำเร็จ)</small>') : '-'}</td>${ad ? `<td><button class="b b2 sm" ${on && SBX.cl ? `onclick="lnRemind('${i.id}')"` : 'disabled'}>ส่งเตือน</button></td>` : ''}</tr>`;
  };
  return `<h2>ติดตามหนี้ค้าง</h2><p class="mu">บิลที่เลยวันครบกำหนดแล้วยังไม่ชำระ · ระบบส่งเตือนทาง LINE อัตโนมัติก่อนครบกำหนด 2 วัน หลังเลยกำหนด 1 วัน และ 5 วัน</p>${SBX.cl ? '' : '<p class="mu">การส่งเตือนทาง LINE ใช้ได้เมื่อเชื่อมฐานข้อมูลจริง</p>'}<div class="cd" style="margin-top:14px"><div class="bd" style="flex-wrap:wrap;gap:10px"><span>ค้างชำระ <b>${L.length}</b> บิล · รวม <b>฿${fm(sum)}</b> · เชื่อม LINE แล้ว <b>${nLk}</b> บิล</span>${ad ? `<button class="b" ${nLk && SBX.cl ? 'onclick="lnRemindAll()"' : 'disabled'}>ส่งเตือนทุกบิลที่เชื่อม LINE</button>` : ''}</div></div><div class="cd sc" style="margin-top:14px"><table><tr><th>ห้อง</th><th>ผู้เช่า</th><th>รอบบิล</th><th>ยอดค้าง</th><th>เลยกำหนด</th><th>LINE</th><th>เตือนล่าสุด</th>${ad ? '<th></th>' : ''}</tr>${L.map(row).join('') || `<tr><td colspan=${ad ? 8 : 7} class=mu>ไม่มีบิลค้างชำระ</td></tr>`}</table></div>`;
};
async function lnRemind(code) {
  const i = D.inv.find(x => x.id == code);
  if (!i || lnRemind[code]) return; // กันกดส่งเตือนซ้ำ
  lnRemind[code] = 1;
  setTimeout(() => delete lnRemind[code], 5000);
  const r = await SBX.cl.rpc('line_remind', { p_invoice: i._id });
  if (r.error) return alert('ส่งเตือนไม่สำเร็จ: ' + thErr(r.error));
  tt('✓ ส่งเตือนห้อง ' + i.room + ' แล้ว');
  setTimeout(lnAfter, 2500);
}
function lnRemindAll() {
  cf('ส่งเตือนทาง LINE ให้ทุกบิลที่เลยกำหนดและผู้เช่าเชื่อม LINE แล้ว?', async () => {
    const r = await SBX.cl.rpc('line_remind_overdue');
    if (r.error) return alert('ส่งเตือนไม่สำเร็จ: ' + thErr(r.error));
    tt('✓ ส่งเตือนแล้ว ' + (r.data || 0) + ' บิล');
    setTimeout(lnAfter, 2500);
  });
}
async function lnAfter() {
  await lnLoad();
  if (P == 'debt') R();
}

// เมนู: ผู้ดูแลระบบต่อจาก "รับชำระเงิน" · เจ้าของกิจการต่อจาก "สัญญาเช่า"
NVA.splice(NVA.findIndex(n => n[0] == 'pay') + 1, 0, ['debt', 'ติดตามหนี้ค้าง', '⚑']);
