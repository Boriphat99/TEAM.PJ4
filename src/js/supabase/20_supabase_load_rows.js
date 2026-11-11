/* 20_supabase_load_rows.js — Supabase: โหลดข้อมูลมาเป็นโครงสร้างหน้าเว็บ + แปลงเป็นแถวตาราง
   (แยกมาจาก script.js บรรทัด 1321-1389; โหลดเรียงตามเลขหน้าชื่อไฟล์ใน index.html) */
// ---------- โหลดข้อมูลจากฐานข้อมูลมาเป็นโครงสร้างที่หน้าเว็บใช้ (RLS กรองให้ตามบทบาท) ----------
async function sbLoad() {
  const c = SBX.cl;
  if (U) await sbFlush();
  const au = (await c.auth.getUser()).data.user;
  if (!au) throw new Error('ยังไม่ได้เข้าสู่ระบบ');
  SBX.uid = au.id;
  const q = async (t, f) => {
    const r = await f(c.from(t).select('*'));
    if (r.error) throw r.error;
    return r.data || [];
  };
  const me = (await q('users', x => x.eq('id', au.id)))[0];
  if (!me) throw new Error('ไม่พบข้อมูลบัญชีในระบบ');
  const ad = me.role == 'admin',
    stf = me.role != 'tenant';
  const [st, us, tn_, rm_, ct, mr, iv, it, pm_, tk, nw, lgs, ml] = await Promise.all([
    q('app_settings', x => x),
    q('users', x => x),
    q('tenants', x => x),
    q('rooms', x => x.order('room_no')),
    q('contracts', x => x),
    q('meter_readings', x => x),
    q('invoices', x => x.order('billing_month', { ascending: false })),
    q('invoice_items', x => x),
    q('payments', x => x),
    q('support_tickets', x => x.order('created_at', { ascending: false })),
    q('news', x => x.order('created_at', { ascending: false })),
    stf ? q('audit_logs', x => x.order('created_at', { ascending: false }).limit(50)) : [],
    ad ? q('email_queue', x => x.order('created_at', { ascending: false }).limit(100)) : [],
  ]);
  const S = st[0] || {},
    rn = id => {
      const r = rm_.find(x => x.id == id);
      return r ? +r.room_no : null;
    };
  D.set = {
    rent: +S.rent_rate || 0,
    rate: +S.electricity_rate || 0,
    dep: +S.default_deposit || 0,
    due: +S.due_day || 5,
    max: +S.max_fine || 0,
    fpd: +S.fine_per_day || 50,
    pp: S.promptpay_id || '',
    name: S.dorm_name || '',
    addr: S.address || '',
    tel: S.phone || '',
    tax: S.tax_id || '',
    payee: S.payee_name || '',
    url: S.system_url || '',
    line: S.line_id || '',
    _id: S.id,
  };
  D.set._lqp = S.line_qr_path || undefined;
  if (S.line_qr_path)
    D.set.lineqr = pubUrl('branding', S.line_qr_path) + '?v=' + (tsv(S.updated_at) || 0);
  D.rooms = rm_.map(r => ({
    n: +r.room_no,
    m: +r.current_meter,
    st: r.occupancy_status == 'free' ? undefined : r.occupancy_status,
    pdf: r.contract_pdf_path
      ? { name: r.contract_pdf_name, size: r.contract_pdf_size || 0, path: r.contract_pdf_path }
      : undefined,
    _id: r.id,
  }));
  const avU = u => (u.avatar_path ? pubUrl('avatars', u.avatar_path) : undefined),
    L = [];
  us.filter(u => u.role != 'tenant').forEach(u =>
    L.push({
      id: +u.app_id,
      name: u.full_name || u.email,
      email: u.email,
      role: u.role,
      tel: u.phone || '',
      g: u.gender || '',
      av: avU(u),
      _avp: u.avatar_path,
      pf: { lang: u.lang || 'th' },
      _uid: u.id,
    })
  );
  tn_.forEach(t => {
    const u = us.find(x => x.id == t.user_id) || {},
      c0 = ct
        .filter(x => x.tenant_id == t.id)
        .sort(
          (a, b) =>
            (a.status == 'active' ? 0 : 1) - (b.status == 'active' ? 0 : 1) ||
            String(b.created_at).localeCompare(String(a.created_at))
        )[0];
    const o = {
      id: +t.app_id,
      name: t.full_name,
      email: t.email || u.email || '',
      role: 'tenant',
      tel: t.phone || '',
      g: t.gender || '',
      av: avU(u),
      _avp: u.avatar_path,
      pf: { lang: u.lang || 'th' },
      cs: tsv(t.created_at),
      _uid: t.user_id,
      _tid: t.id,
      room: null,
    };
    if (c0) {
      o.room = rn(c0.room_id);
      o.cs = D2T(c0.start_date);
      if (c0.end_date) o.ce = D2T(c0.end_date);
      if (c0.status == 'ended') o.out = tsv(c0.moved_out_at) || Date.now();
      o._cid = c0.id;
      o._crm = o.room;
    }
    L.push(o);
  });
  D.users = L;
  const itBy = {},
    pmBy = {};
  it.forEach(x => (itBy[x.invoice_id] = itBy[x.invoice_id] || []).push(x));
  pm_.forEach(x => (pmBy[x.invoice_id] = pmBy[x.invoice_id] || []).push(x));
  D.inv = iv.map(v => {
    const its = itBy[v.id] || [],
      g = t => its.find(x => x.item_type == t),
      m = mr.find(x => x.id == (g('electricity') || {}).meter_reading_id) || {},
      c0 = ct.find(x => x.id == v.contract_id) || {},
      tn0 = tn_.find(x => x.id == c0.tenant_id) || {},
      p = (pmBy[v.id] || [])
        .filter(x => x.verify_status != 'rejected')
        .sort((a, b) => String(b.submitted_at).localeCompare(String(a.submitted_at)))[0];
    const i = {
      id: v.code,
      room: rn(c0.room_id),
      uid: tn0.app_id == null ? undefined : +tn0.app_id,
      per: v.billing_month,
      pv: +m.previous_reading || 0,
      u: +m.units_used || 0,
      el: +(g('electricity') || {}).amount || 0,
      x: +(g('other') || {}).amount || 0,
      xn: (g('other') || {}).description || '',
      rent: +(g('rent') || {}).amount || 0,
      fine: +(g('fine') || {}).amount || 0,
      s: v.status == 'overdue' ? 'unpaid' : v.status,
      iss: tsv(v.created_at),
      _id: v.id,
      _cid: v.contract_id,
      _mid: m.id,
    };
    if (p) {
      i.mt = p.payment_method;
      i.sub = tsv(p.submitted_at);
      if (p.slip_url) i.slip = p.slip_url;
      if (p.receipt_no) i.rc = p.receipt_no;
      if (p.verify_status == 'approved') i.paid = tsv(p.paid_at || p.verified_at);
      i._pid = p.id;
    }
    const rjp = (pmBy[v.id] || [])
      .filter(x => x.verify_status == 'rejected')
      .sort((a, b) => String(b.submitted_at).localeCompare(String(a.submitted_at)))[0];
    if (!p && rjp && i.s == 'unpaid') i.rj = rjp.reject_reason || 'ไม่ระบุเหตุผล';
    return i;
  });
  D.tk = [];
  for (const t of tk) {
    let imgs = [];
    if ((t.image_paths || []).length) {
      const r = await c.storage.from('attachments').createSignedUrls(t.image_paths, 3600);
      imgs = ((r && r.data) || []).map(x => x.signedUrl).filter(Boolean);
    }
    const a0 = D.users.find(x => x._uid == t.author_id);
    D.tk.push({
      id: t.code,
      uid: a0 ? a0.id : null,
      name: t.author_name,
      room: t.author_room ? +t.author_room : null,
      cat: t.category,
      title: t.title,
      body: t.body,
      imgs,
      imgp: t.image_paths || [],
      t: tsv(t.created_at),
      s: t.status,
      reply: t.admin_reply || undefined,
      rby: t.replied_by || undefined,
      rt: tsv(t.replied_at),
      _id: t.id,
      _au: t.author_id,
    });
  }
  D.news = nw.map(n => ({
    id: n.id,
    t: tsv(n.created_at),
    title: n.title,
    body: n.body,
    by: n.author_name,
    _id: n.id,
  }));
  D.log = lgs.map(l => ({ t: tsv(l.created_at), by: l.actor_name, a: l.action }));
  D.mail = ml.map(m => ({
    t: tsv(m.sent_at || m.created_at),
    to: m.to_email,
    sj: m.subject,
    k: m.kind == 'invoice' ? 'inv' : 'rcp',
    inv: (iv.find(x => x.id == m.invoice_id) || {}).code,
    st: { pending: 'sending', sent: 'ok', failed: 'fail', wait: 'wait' }[m.status],
    er: m.error || '',
    _id: m.id,
  }));
  D.contacts = [];
  if (!ad) {
    const r = await c.rpc('get_contacts');
    D.contacts = ((r && r.data) || []).map(x => ({
      role: x.role,
      name: x.full_name,
      phone: x.phone,
    }));
  }
  if (U) {
    const n = D.users.find(x => x._uid == SBX.uid);
    if (n) U = n;
  }
  SBX.snap = sbRows();
}

// ---------- แปลงข้อมูลในหน้าเว็บเป็นแถวของตาราง (ใช้เทียบหาสิ่งที่เปลี่ยนแล้วบันทึกกลับ) ----------
function sbPrep() {
  if (!U || U.role != 'admin') return;
  D.users.forEach(u => {
    if (u.role == 'tenant' && u._tid && u.room && (!u._cid || u._crm != u.room)) {
      u._oldc = u._cid && u._crm != u.room ? u._cid : null;
      u._cid = NEWID();
      u._crm = u.room;
    }
  });
  D.inv.forEach(i => {
    i._id = i._id || NEWID();
    i._mid = i._mid || NEWID();
    if (!i._cid) {
      const u = D.users.find(x => x.id == i.uid);
      i._cid = u && u._cid;
    }
    if ((i.mt || i.slip || i.s == 'paid') && !i._pid) i._pid = NEWID();
  });
  D.news.forEach(n => {
    n._id = n._id || NEWID();
  });
}
function sbRows() {
  const o = {},
    A = (t, k, r) => ((o[t] = o[t] || {})[k] = r),
    S = D.set,
    ad = U && U.role == 'admin';
  if (S._id)
    A('app_settings', S._id, {
      id: S._id,
      rent_rate: S.rent,
      electricity_rate: S.rate,
      default_deposit: S.dep,
      fine_per_day: S.fpd || 50,
      max_fine: S.max,
      due_day: S.due,
      promptpay_id: S.pp || null,
      dorm_name: S.name || null,
      address: S.addr || null,
      phone: S.tel || null,
      tax_id: S.tax || null,
      payee_name: S.payee || null,
      system_url: S.url || null,
      line_id: S.line || null,
    });
  D.rooms.forEach(
    r =>
      r._id &&
      A('rooms', r._id, {
        id: r._id,
        room_no: String(r.n),
        occupancy_status: r.st || 'free',
        current_meter: r.m,
      })
  );
  D.users.forEach(u => {
    if (u._uid && (ad || u._uid == SBX.uid))
      A('users', u._uid, {
        id: u._uid,
        full_name: u.name,
        phone: u.tel || null,
        gender: u.g || null,
        lang: (u.pf && u.pf.lang) || 'th',
      });
    if (u.role == 'tenant' && u._tid) {
      A('tenants', u._tid, {
        id: u._tid,
        full_name: u.name,
        phone: u.tel || null,
        gender: u.g || null,
      });
      const rr = u.room && D.rooms.find(x => x.n == u.room);
      if (rr && u._cid)
        A('contracts', u._cid, {
          id: u._cid,
          tenant_id: u._tid,
          room_id: rr._id,
          start_date: DD(u.cs),
          end_date: u.ce ? DD(u.ce) : null,
          deposit_amount: D.set.dep,
          status: u.out ? 'ended' : 'active',
          moved_out_at: u.out ? ISO(u.out) : null,
        });
    }
  });
  D.inv.forEach(i => {
    if (!i._id) return;
    const g = (t, r) => A('invoice_items', i._id + ':' + t, r),
      rm0 = D.rooms.find(r => r.n == i.room) || {};
    A('invoices', i._id, {
      id: i._id,
      code: i.id,
      contract_id: i._cid,
      billing_month: i.per,
      issue_date: DD(i.iss),
      due_date: DD(due(i).getTime()),
      status: i.s,
      total_amount: base(i) + (i.fine || 0),
    });
    if (i._mid)
      A('meter_readings', i._mid, {
        id: i._mid,
        room_id: rm0._id,
        billing_month: i.per,
        previous_reading: i.pv,
        current_reading: i.pv + i.u,
      });
    g('rent', { invoice_id: i._id, item_type: 'rent', description: null, amount: i.rent });
    g('electricity', {
      invoice_id: i._id,
      item_type: 'electricity',
      meter_reading_id: i._mid || null,
      description: null,
      amount: i.el,
    });
    if (i.x)
      g('other', { invoice_id: i._id, item_type: 'other', description: i.xn || null, amount: i.x });
    if (i.fine)
      g('fine', { invoice_id: i._id, item_type: 'fine', description: null, amount: i.fine });
    if (i._pid && (i.mt || i.slip || i.s == 'paid'))
      A('payments', i._pid, {
        id: i._pid,
        invoice_id: i._id,
        receipt_no: i.rc && i.rc[0] != '(' ? i.rc : null,
        payment_method: i.mt || 'cash',
        slip_url: i.slip || null,
        amount_paid: base(i) + (i.fine || 0),
        verify_status: i.s == 'paid' ? 'approved' : 'pending',
        submitted_at: ISO(i.sub),
        paid_at: i.paid ? ISO(i.paid) : null,
        verified_at: i.paid ? ISO(i.paid) : null,
      });
  });
  D.tk.forEach(t => {
    if (t._id)
      A('support_tickets', t._id, {
        id: t._id,
        code: t.id,
        author_id: t._au,
        author_name: t.name || null,
        author_room: t.room ? String(t.room) : null,
        category: t.cat,
        title: t.title,
        body: t.body,
        status: t.s,
        admin_reply: t.reply || null,
        replied_by: t.rby || null,
        replied_at: t.rt ? ISO(t.rt) : null,
        image_paths: t.imgp || [],
        created_at: ISO(t.t),
      });
  });
  D.news.forEach(n => {
    if (n._id)
      A('news', n._id, {
        id: n._id,
        title: n.title,
        body: n.body,
        author_name: n.by || null,
        created_at: ISO(n.t),
      });
  });
  return o;
}
