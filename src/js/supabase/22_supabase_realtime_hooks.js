/* 22_supabase_realtime_hooks.js — Supabase: เรียลไทม์ + เชื่อมการทำงานเมื่อใช้ฐานข้อมูลจริง
   (แยกมาจาก script.js บรรทัด 1417-1524; โหลดเรียงตามเลขหน้าชื่อไฟล์ใน index.html) */
// ---------- เรียลไทม์ ----------
function sbRT() {
  if (SBX.ch || !SBX.cl) return;
  SBX.ch = SBX.cl
    .channel('ttm-live')
    .on('postgres_changes', { event: '*', schema: 'public' }, () => {
      clearTimeout(SBX.rt);
      SBX.rt = setTimeout(sbRefresh, 700);
    })
    .subscribe();
}
async function sbRefresh() {
  if (!U) return;
  const busy =
    getComputedStyle($('#mo')).display != 'none' ||
    /INPUT|SELECT|TEXTAREA/.test((document.activeElement || {}).tagName || '');
  if (busy) {
    clearTimeout(SBX.rt);
    SBX.rt = setTimeout(sbRefresh, 3000);
    return;
  }
  try {
    await sbLoad();
    R();
  } catch (x) {}
}

if (SBON) {
  document.body.classList.add('sbon');
  dl = async function () {
    const em = $('#em').value.trim().toLowerCase(),
      pw = $('#pw').value;
    if (!em || !pw) return alert('กรอกอีเมลและรหัสผ่าน');
    const { error } = await SBX.cl.auth.signInWithPassword({ email: em, password: pw });
    if (error)
      return alert(
        /confirm/i.test(error.message)
          ? 'กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ (ตรวจสอบกล่องจดหมายของคุณ)'
          : 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
      );
    try {
      await sbEnter(1);
    } catch (x) {
      alert(x.message || x);
    }
  };
  fp = async function () {
    const m = $('#em').value.trim().toLowerCase();
    if (!m) return alert('กรอกอีเมล');
    if (!MAILOK(m)) return alert(MAILMSG);
    const { error } = await SBX.cl.auth.resetPasswordForEmail(m, {
      redirectTo: location.href.split('#')[0].split('?')[0],
    });
    if (error) return alert(error.message);
    go('login');
    alert('ส่งลิงก์ตั้งรหัสผ่านใหม่ไปที่อีเมลแล้ว กรุณาตรวจสอบกล่องจดหมาย');
  };
  rp = async function () {
    const w = $('#pw').value;
    if (pwBad(w)) return alert(pwBad(w));
    if (w != $('#pw2').value) return alert('ยืนยันรหัสผ่านไม่ตรงกัน');
    const { error } = await SBX.cl.auth.updateUser({ password: w });
    if (error) return alert(error.message);
    SBX.recov = false;
    await SBX.cl.auth.signOut();
    try {
      history.replaceState(null, '', location.pathname);
    } catch (x) {}
    sbReset();
    go('login');
    alert('ตั้งรหัสผ่านใหม่สำเร็จ กรุณาเข้าสู่ระบบ');
  };
  out = function () {
    const r = U && U.role,
      purge = () => {
        try {
          Object.keys(localStorage)
            .filter(k => /^sb-.*-auth-token/.test(k))
            .forEach(k => localStorage.removeItem(k));
        } catch (x) {}
      };
    try {
      const p = SBX.cl.auth.signOut();
      if (p && p.catch) p.catch(() => {});
    } catch (x) {}
    try {
      sbReset();
    } catch (x) {}
    U = null;
    P = 'home';
    try {
      localStorage.removeItem('ttm_s');
    } catch (x) {}
    lout(r);
    setTimeout(purge, 1500);
    try {
      pubLoad();
    } catch (x) {}
  };
  pc = async function () {
    const o = $('#p_o').value,
      w = $('#p_w').value;
    if (pwBad(w, U.email)) return alert(pwBad(w, U.email));
    if (w != $('#p_c').value) return alert('ยืนยันรหัสผ่านไม่ตรงกัน');
    const a = await SBX.cl.auth.signInWithPassword({ email: U.email, password: o });
    if (a.error) return alert('รหัสผ่านปัจจุบันไม่ถูกต้อง');
    const { error } = await SBX.cl.auth.updateUser({ password: w });
    if (error) return alert(error.message);
    lg('เปลี่ยนรหัสผ่าน');
    R();
    alert('เปลี่ยนรหัสผ่านสำเร็จ\nครั้งต่อไปให้เข้าสู่ระบบด้วยรหัสผ่านใหม่');
  };
  ps = function () {
    const n = $('#p_n').value.trim(),
      t = $('#p_t').value.trim();
    if (!n) return alert('กรอกชื่อ');
    if (t && !/^[0-9\-+ ]{9,15}$/.test(t)) return alert('เบอร์โทรไม่ถูกต้อง');
    Object.assign(U, { name: n, tel: t, g: $('#p_g').value });
    lg('แก้ไขโปรไฟล์');
    save();
    R();
    tt('✓ บันทึกข้อมูลแล้ว');
  };
  {
    const _p = pg.prof;
    pg.prof = () => _p().replace('id="p_e"', 'id="p_e" disabled');
  }
  {
    const _e = et;
    et = function (id) {
      _e(id);
      const w = $('#f_w'),
        m = $('#f_e');
      if (w) {
        w.previousElementSibling.style.display = 'none';
        w.style.display = 'none';
      }
      if (m) m.disabled = true;
    };
  }
  eu = function (id) {
    const u = D.users.find(x => x.id == id),
      n = $('#f_n').value.trim(),
      r = +$('#f_r').value,
      go2 = $('#f_s').value == 'out';
    if (!n) return alert('กรอกชื่อ');
    if (!go2 && r) {
      const o = act(r),
        rr = D.rooms.find(x => x.n == r);
      if (o && o.id != id) return alert('ห้อง ' + r + ' มีผู้เช่าอยู่แล้ว');
      if (rr.st) return alert('ห้อง ' + r + ' ไม่ว่าง/ปิดปรับปรุง กรุณาเปลี่ยนสถานะห้องเป็นว่างก่อน');
    }
    if (!u.room && r) u.cs = Date.now();
    Object.assign(u, { name: n, tel: $('#f_t').value.trim(), room: r || null });
    if (go2) {
      if (!u.out) u.out = Date.now();
    } else delete u.out;
    lg('แก้ไขผู้เช่า ' + n);
    save();
    cm();
    R();
    tt('✓ บันทึกข้อมูลผู้เช่าแล้ว');
  };
  ss = function () {
    const er = ssCheck();
    if (er) return alert(er);
    const s = D.set;
    ['rent', 'rate', 'dep', 'due', 'max'].forEach(k => (s[k] = +$('#s_' + k).value || 0));
    ['pp', 'tax', 'name', 'payee', 'tel', 'addr', 'url'].forEach(
      k => (s[k] = $('#s_' + k).value.trim())
    );
    lg('แก้ไขการตั้งค่า');
    save();
    tt('✓ บันทึกแล้ว');
  };
  sub = async function (id) {
    const i = gi(id),
      pd = i.s == 'pending';
    if (!SLIP) return alert('กรุณาอัปโหลดสลิปโอนเงิน');
    if (!(await slipGate())) return;
    const path = i._id + '/' + Date.now() + '.jpg',
      up = await SBX.cl.storage
        .from('slips')
        .upload(path, d2b(SLIP), { contentType: 'image/jpeg' });
    if (up.error) return alert('อัปโหลดสลิปไม่สำเร็จ: ' + up.error.message);
    const { error } = await SBX.cl.rpc('submit_payment', {
      p_invoice: i._id,
      p_slip: path,
      p_ref: (SLIPQ && SLIPQ.ref) || null,
      p_bank: (SLIPQ && SLIPQ.bank) || null,
    });
    if (error) {
      SBX.cl.storage.from('slips').remove([path]);
      return alert(error.message);
    }
    lg((pd ? 'ส่งสลิปใหม่ ' : 'แจ้งชำระ ') + id);
    cm();
    await sbLoad();
    R();
    tt(pd ? '✓ ส่งสลิปใหม่แล้ว รอผู้ดูแลตรวจสอบ' : '✓ แจ้งชำระเงินแล้ว รอผู้ดูแลตรวจสอบ');
  };
  // ไฟล์สัญญา: Storage contracts/<contract_id>.pdf + บันทึกชื่อไฟล์ในแถวสัญญา
  cpf = async function (el) {
    const f = el.files[0];
    el.value = '';
    if (!f) return;
    if (f.type != 'application/pdf' && !/\.pdf$/i.test(f.name)) return alert('รองรับเฉพาะไฟล์ PDF');
    if (f.size > 5 * 1024 * 1024) return alert('ไฟล์ใหญ่เกิน 5MB');
    const u = D.users.find(x => x.id == CPU);
    if (!u || !u._cid) return alert('ไม่พบสัญญาของผู้เช่าคนนี้');
    const path = u._cid + '.pdf';
    const up = await SBX.cl.storage
      .from('contracts')
      .upload(path, f, { upsert: true, contentType: 'application/pdf' });
    if (up.error) return alert('อัปโหลดไม่สำเร็จ: ' + up.error.message);
    u.cpdf = { name: f.name, size: f.size, path };
    lg('อัปโหลดไฟล์สัญญา ห้อง ' + u.room + ' (' + u.name + ')');
    save();
    R();
    tt('✓ อัปโหลดไฟล์สัญญา ห้อง ' + u.room + ' แล้ว');
  };
  cpd = function (id) {
    const u = D.users.find(x => x.id == id);
    if (!u || !u.cpdf) return;
    cf('ลบไฟล์สัญญาของ ' + u.name + ' (ห้อง ' + u.room + ')?', async () => {
      await SBX.cl.storage.from('contracts').remove([u.cpdf.path]);
      delete u.cpdf;
      lg('ลบไฟล์สัญญา ห้อง ' + u.room + ' (' + u.name + ')');
      save();
      R();
    });
  };
  cpv = async function (id) {
    const u = D.users.find(x => x.id == id);
    if (!u || !u.cpdf) return;
    const s = await SBX.cl.storage.from('contracts').createSignedUrl(u.cpdf.path, 600);
    if (!s.data) return alert('เปิดไฟล์ไม่สำเร็จ');
    const url = s.data.signedUrl;
    mo(
      `<h3>สัญญาเช่า ห้อง ${u.room}</h3><small class="mu">${e(u.name)} · ${e(u.cpdf.name)}</small>${innerWidth > 800 ? `<iframe src="${url}" style="width:100%;height:62vh;border:1px solid var(--ln);border-radius:12px;margin:10px 0"></iframe>` : '<br><br>'}<a class="b" style="display:inline-block;text-decoration:none" target="_blank" rel="noopener" href="${url}">เปิดไฟล์สัญญา</a> <button class="b b2" onclick="cm()">ปิด</button>`
    );
    $('#mc').style.maxWidth = '860px';
  };
  crs = async function () {
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
    const blob = d2b(o.toDataURL('image/jpeg', 0.85));
    CR = null;
    const path = SBX.uid + '.' + Date.now() + '.jpg',
      old = U._avp;
    const up = await SBX.cl.storage
      .from('avatars')
      .upload(path, blob, { contentType: 'image/jpeg' });
    if (up.error) return alert('อัปโหลดรูปไม่สำเร็จ: ' + up.error.message);
    const r = await SBX.cl.from('users').update({ avatar_path: path }).eq('id', SBX.uid);
    if (r.error) return alert(r.error.message);
    U.av = pubUrl('avatars', path);
    U._avp = path;
    if (old) SBX.cl.storage.from('avatars').remove([old]);
    lg('เปลี่ยนรูปโปรไฟล์');
    cm();
    R();
    tt('✓ เปลี่ยนรูปโปรไฟล์แล้ว');
  };
  pr = function () {
    cf('ลบรูปโปรไฟล์?', async () => {
      const old = U._avp;
      const r = await SBX.cl.from('users').update({ avatar_path: null }).eq('id', SBX.uid);
      if (r.error) return alert(r.error.message);
      if (old) SBX.cl.storage.from('avatars').remove([old]);
      delete U.av;
      U._avp = null;
      lg('ลบรูปโปรไฟล์');
      R();
      tt('✓ ลบรูปแล้ว');
    });
  };
  ls = async function () {
    const id = $('#l_id').value.trim(),
      bot = lnBotId($('#l_bot').value),
      upd = { line_id: id || null, line_bot_id: bot || null, updated_at: new Date().toISOString() };
    if (/^data:/.test(LQ)) {
      const np = 'line_qr_' + Date.now() + '.png',
        up = await SBX.cl.storage
          .from('branding')
          .upload(np, d2b(LQ), { contentType: 'image/png' });
      if (up.error) return alert('อัปโหลดไม่สำเร็จ: ' + up.error.message);
      upd.line_qr_path = np;
    } else if (!LQ) {
      upd.line_qr_path = null;
    }
    const r = await SBX.cl.from('app_settings').update(upd).eq('id', D.set._id);
    if (r.error) return alert(r.error.message);
    const oq = D.set._lqp;
    if (upd.line_qr_path !== undefined && oq && oq !== upd.line_qr_path)
      SBX.cl.storage
        .from('branding')
        .remove([oq])
        .catch(() => {});
    if (upd.line_qr_path !== undefined) D.set._lqp = upd.line_qr_path || undefined;
    D.set.line = id;
    D.set.lineBot = bot;
    if (upd.line_qr_path) D.set.lineqr = pubUrl('branding', upd.line_qr_path) + '?v=' + Date.now();
    else if (upd.line_qr_path === null) delete D.set.lineqr;
    lg('แก้ไขช่องทาง LINE');
    cm();
    R();
    tt('✓ บันทึกแล้ว');
  };
  tks = async function () {
    const c = $('#tkc').value,
      t = $('#tkt').value.trim(),
      b = $('#tkb').value.trim();
    if (!c || !t || !b) return alert('กรอกหมวดหมู่ หัวข้อ และรายละเอียดให้ครบ');
    const code = 'TK' + Date.now(),
      paths = [];
    let k = 0;
    for (const d of TKI) {
      const p = SBX.uid + '/' + code + '/' + k++ + '.jpg',
        up = await SBX.cl.storage
          .from('attachments')
          .upload(p, d2b(d), { contentType: 'image/jpeg' });
      if (up.error) return alert('อัปโหลดรูปไม่สำเร็จ: ' + up.error.message);
      paths.push(p);
    }
    D.tk.unshift({
      id: code,
      uid: U.id,
      name: U.name,
      room: U.room || null,
      cat: c,
      title: t,
      body: b,
      imgs: TKI.slice(),
      imgp: paths,
      t: Date.now(),
      s: 'open',
      _id: NEWID(),
      _au: SBX.uid,
    });
    lg('ส่งคำขอช่วยเหลือ: ' + t);
    save();
    R();
    tt('✓ ส่งคำขอแล้ว เราจะตอบกลับโดยเร็วที่สุด');
  };
}

applyPf(U);
R();
try {
  const lo = sessionStorage.getItem('ttm_lo');
  if (lo) {
    sessionStorage.removeItem('ttm_lo');
    setTimeout(() => tt('✓ ออกจากระบบสำเร็จ' + (RL[lo] ? ' · ' + RL[lo] : '')), 400);
  }
} catch (x) {}
if (SBON) sbBoot().catch(x => alert('เชื่อมต่อ Supabase ไม่สำเร็จ: ' + (x.message || x)));
