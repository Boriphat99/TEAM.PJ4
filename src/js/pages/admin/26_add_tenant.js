/* 26_add_tenant.js — ผู้ดูแลเพิ่มผู้เช่า: สร้างบัญชี (อีเมล + รหัสผ่านเริ่มต้น) + เลือกห้อง + เปิดสัญญาเช่า ในหน้าต่างเดียว
   และแจ้งเตือนผู้เช่าให้เปลี่ยนรหัสผ่านหลังเข้าสู่ระบบครั้งแรก (จนกว่าจะเปลี่ยนในหน้าโปรไฟล์)
   - โหมด Supabase: เรียก Edge Function "create-tenant" (ตรวจสิทธิ์แอดมิน สร้างบัญชี เปิดสัญญาในขั้นตอนเดียว)
   - โหมดทดลอง: บันทึกลงเบราว์เซอร์เหมือนเดิม
   โหลดหลังไฟล์ 25 จึงแทนที่ at0() เดิม (ปุ่ม "+ เพิ่มผู้เช่า") */

const todayISO = () => { const d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) };
const atfRooms = () => D.rooms.filter(r => vac(r));

// ---------- หน้าต่างเพิ่มผู้เช่า ----------
function atf(n) {
    if (!U || U.role != 'admin') return;
    const f = atfRooms();
    if (!f.length) return alert('ไม่มีห้องว่างสำหรับเพิ่มผู้เช่า');
    if (!f.some(r => r.n == n)) n = f[0].n;
    const S = D.set;
    mo(`<h3>เพิ่มผู้เช่า</h3><small class="mu">สร้างบัญชีเข้าสู่ระบบให้ผู้เช่า พร้อมเปิดสัญญาเช่า</small>
    <div class="atf">
      <div class="atf-sec"><b>1 · ห้องพัก</b>
        <label>เลือกห้องว่าง</label><select id="af_r">${f.map(r => `<option value="${r.n}" ${r.n == n ? 'selected' : ''}>ห้อง ${r.n}</option>`).join('')}</select>
      </div>
      <div class="atf-sec"><b>2 · ข้อมูลผู้เช่า</b>
        <label>ชื่อ - นามสกุล *</label><input id="af_n" autocomplete="off">
        <label>เบอร์โทร</label><input id="af_t" type="tel" inputmode="tel" placeholder="08x-xxx-xxxx" autocomplete="off">
      </div>
      <div class="atf-sec"><b>3 · บัญชีเข้าสู่ระบบ</b>
        <label>อีเมล *</label><input id="af_e" type="email" inputmode="email" placeholder="name@example.com" autocomplete="off">
        <label>รหัสผ่านเริ่มต้น * <small class="mu">(อย่างน้อย 6 ตัว)</small></label>
        <div class="atf-pw"><input id="af_p" value="${genPw()}" autocomplete="new-password" spellcheck="false"><button type="button" class="b b2 sm" onclick="$('#af_p').value=genPw()">สุ่มใหม่</button></div>
        <small class="mu">ผู้เช่าจะได้รับการแจ้งเตือนให้เปลี่ยนรหัสผ่านเองหลังเข้าสู่ระบบครั้งแรก</small>
      </div>
      <div class="atf-sec"><b>4 · สัญญาเช่า</b>
        <div class="atf-2"><div><label>วันเริ่มสัญญา *</label><input id="af_s" type="date" value="${todayISO()}"></div>
        <div><label>วันสิ้นสุดสัญญา</label><input id="af_x" type="date"></div></div>
        <small class="mu">เว้นวันสิ้นสุดว่างไว้ = ไม่กำหนด · ค่าเช่า ฿${fm(S.rent)}/เดือน · เงินแรกเข้า ฿${fm(S.dep)} (บันทึกครั้งเดียว ณ วันเริ่มสัญญา)</small>
        <label>ไฟล์สัญญาเช่า (PDF ไม่บังคับ)</label><input id="af_f" type="file" accept="application/pdf,.pdf">
      </div>
    </div>
    <div class="acts" style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;margin-top:16px">
      <button class="b b2" onclick="cm()">ยกเลิก</button>
      <button class="b" id="af_go" onclick="atfGo()">สร้างบัญชีและเปิดสัญญา</button>
    </div>`);
    if (innerWidth > 800) $('#mc').style.maxWidth = '560px';
}

async function atfGo() {
    const n = +$('#af_r').value, name = $('#af_n').value.trim(), tel = $('#af_t').value.trim(),
        em = $('#af_e').value.trim().toLowerCase(), pw = $('#af_p').value, s = $('#af_s').value, x = $('#af_x').value,
        fEl = $('#af_f'), file = fEl && fEl.files[0];
    if (!name) return alert('กรุณากรอกชื่อ - นามสกุล');
    if (!/^\S+@\S+\.\S+$/.test(em)) return alert('รูปแบบอีเมลไม่ถูกต้อง');
    if (pw.length < 6) return alert('รหัสผ่านต้องมีอย่างน้อย 6 ตัว');
    if (tel && !/^[0-9\-+ ]{9,15}$/.test(tel)) return alert('เบอร์โทรไม่ถูกต้อง');
    if (!s) return alert('กรุณาระบุวันเริ่มสัญญา');
    if (x && x < s) return alert('วันสิ้นสุดสัญญาต้องไม่ก่อนวันเริ่มสัญญา');
    if (file && (file.type != 'application/pdf' && !/\.pdf$/i.test(file.name))) return alert('ไฟล์สัญญารองรับเฉพาะ PDF');
    if (file && file.size > 5 * 1024 * 1024) return alert('ไฟล์สัญญาใหญ่เกิน 5MB');
    const btn = $('#af_go'); if (btn) { btn.disabled = true; btn.textContent = 'กำลังสร้างบัญชี…' }
    const done = () => { if (btn) { btn.disabled = false; btn.textContent = 'สร้างบัญชีและเปิดสัญญา' } };
    const D2T0 = v => new Date(v + 'T00:00:00').getTime();

    if (SBON) {
        const r = await SBX.cl.functions.invoke('create-tenant', { body: { email: em, password: pw, full_name: name, phone: tel, room_no: String(n), start_date: s, end_date: x || null } });
        if (r.error) {
            let msg = r.error.message;
            try { const j = await r.error.context.json(); if (j && j.error) msg = j.error } catch (e2) { }
            done(); return alert(msg);
        }
        await sbLoad();
        if (file) { CPR = n; const dt = new DataTransfer(); dt.items.add(file); const tmp = document.createElement('input'); tmp.type = 'file'; tmp.files = dt.files; try { await cpf(tmp) } catch (e2) { } }
        R();
    } else {
        if (D.users.some(u => u.email == em)) { done(); return alert('อีเมลนี้มีบัญชีอยู่แล้ว') }
        D.users.push({ id: Date.now(), name, email: em, pw, role: 'tenant', room: n, tel, cs: D2T0(s), ce: x ? D2T0(x) : undefined, mcp: 1 });
        lg('เพิ่มผู้เช่า ห้อง ' + n); save();
        if (file) { CPR = n; const dt = new DataTransfer(); dt.items.add(file); const tmp = document.createElement('input'); tmp.type = 'file'; tmp.files = dt.files; cpf(tmp) }
        R();
    }
    atfDone({ n, name, em, pw, s, x });
}

// ---------- สรุปบัญชีที่สร้าง + คัดลอกส่งให้ผู้เช่า ----------
function atfDone(o) {
    const url = (D.set.url || location.href.split('#')[0].split('?')[0]);
    const txt = `${D.set.name || 'T&T Mansion'} — บัญชีผู้เช่าห้อง ${o.n}\nชื่อ: ${o.name}\nเว็บ: ${url}\nอีเมลเข้าสู่ระบบ: ${o.em}\nรหัสผ่านเริ่มต้น: ${o.pw}\n\nกรุณาเปลี่ยนรหัสผ่านเป็นของคุณเองที่เมนู "โปรไฟล์" หลังเข้าสู่ระบบครั้งแรก`;
    ATF_TXT = txt;
    mo(`<h3>✓ สร้างบัญชีผู้เช่าแล้ว</h3><small class="mu">ห้อง ${o.n} · สัญญาเริ่ม ${dt(o.s)}${o.x ? ' ถึง ' + dt(o.x) : ' (ไม่กำหนดวันสิ้นสุด)'}</small>
    <div class="atf-cred">
      <div><small class="mu">ชื่อผู้เช่า</small><b>${e(o.name)}</b></div>
      <div><small class="mu">อีเมลเข้าสู่ระบบ</small><b>${e(o.em)}</b></div>
      <div><small class="mu">รหัสผ่านเริ่มต้น</small><b class="atf-mono">${e(o.pw)}</b></div>
    </div>
    <div class="note" style="margin-top:12px">ส่งข้อมูลนี้ให้ผู้เช่า (เช่น ทาง LINE) · เมื่อผู้เช่าเข้าสู่ระบบ ระบบจะแจ้งเตือนให้เปลี่ยนรหัสผ่านเป็นของตัวเอง</div>
    <div class="acts" style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;margin-top:14px">
      <button class="b b2" onclick="cm()">ปิด</button>
      <button class="b" onclick="atfCopy(this)">คัดลอกข้อมูลส่งผู้เช่า</button>
    </div>`);
}
var ATF_TXT = '';
async function atfCopy(b) {
    try { await navigator.clipboard.writeText(ATF_TXT); b.textContent = '✓ คัดลอกแล้ว' }
    catch (x) { prompt('คัดลอกข้อความนี้ส่งให้ผู้เช่า', ATF_TXT) }
}

// ปุ่ม "+ เพิ่มผู้เช่า" (หน้าผู้เช่า) → เปิดฟอร์มใหม่
at0 = function () { const f = atfRooms(); if (!f.length) return alert('ไม่มีห้องว่างสำหรับเพิ่มผู้เช่า'); atf(f[0].n) };

// ---------- แจ้งเตือนให้เปลี่ยนรหัสผ่าน (ผู้เช่าที่ใช้รหัสผ่านเริ่มต้นจากแอดมิน) ----------
var PWN = false, PWN_SHOWN = false, PWN_PATCHED = false;
function pwnPatch() {
    // เมื่อเปลี่ยนรหัสผ่านสำเร็จ (หน้าโปรไฟล์ หรือ ลิงก์รีเซ็ต) ให้ล้างธงแจ้งเตือนในบัญชีด้วย
    if (PWN_PATCHED || !SBON || !SBX.cl) return; PWN_PATCHED = true;
    const a = SBX.cl.auth, uu = a.updateUser.bind(a);
    a.updateUser = async (attrs, opt) => {
        if (attrs && attrs.password) attrs = Object.assign({}, attrs, { data: Object.assign({}, attrs.data || {}, { must_change_pw: false }) });
        const r = await uu(attrs, opt);
        if (!r.error && attrs && attrs.password) { PWN = false; document.querySelectorAll('.pwn').forEach(x => x.remove()) }
        return r;
    };
}
async function pwnCheck() {
    if (!U || U.role != 'tenant') { PWN = false; return }
    if (SBON) { try { pwnPatch(); const { data } = await SBX.cl.auth.getUser(); PWN = !!(data && data.user && data.user.user_metadata && data.user.user_metadata.must_change_pw) } catch (x) { PWN = false } }
    else PWN = !!U.mcp;
    if (PWN) { pwnBanner(); if (!PWN_SHOWN) { PWN_SHOWN = true; setTimeout(pwnModal, 500) } }
}
function pwnModal() {
    if (!PWN || !U) return;
    if (getComputedStyle($('#mo')).display != 'none') return;
    mo(`<div class="pwn-ico">🔐</div><h3 style="text-align:center">อย่าลืมเปลี่ยนรหัสผ่าน</h3>
    <p class="mu" style="text-align:center;margin:8px 0 0">คุณกำลังใช้รหัสผ่านเริ่มต้นที่ผู้ดูแลตั้งให้<br>เพื่อความปลอดภัยของบัญชี กรุณาเปลี่ยนเป็นรหัสผ่านของคุณเองที่หน้า <b>โปรไฟล์</b></p>
    <div class="acts" style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:16px">
      <button class="b b2" onclick="cm()">ไว้ทีหลัง</button>
      <button class="b" onclick="cm();pwnGo()">เปลี่ยนรหัสผ่านตอนนี้</button>
    </div>`);
}
function pwnGo() { go('prof'); setTimeout(() => { const el = $('#p_o'); if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.focus({ preventScroll: true }) } }, 150) }
function pwnBanner() {
    if (!PWN || !U || U.role != 'tenant' || P == 'prof') return;
    const mn = document.querySelector('.mn'); if (!mn || mn.querySelector('.pwn')) return;
    const h = mn.querySelector(':scope > h2'); if (!h) return;
    const d = document.createElement('div'); d.className = 'note pwn';
    d.innerHTML = '🔐 คุณยังใช้รหัสผ่านเริ่มต้นจากผู้ดูแล — อย่าลืมเปลี่ยนรหัสผ่านเป็นของคุณเอง <button class="b sm" onclick="pwnGo()">เปลี่ยนรหัสผ่าน</button>';
    const sub = h.nextElementSibling && h.nextElementSibling.matches('p,small,.mu') ? h.nextElementSibling : h;
    sub.after(d);
}
// ตรวจทุกครั้งที่เข้าสู่ระบบ
const _enter0 = enter;
enter = function (u, pg2, how) { const r = _enter0(u, pg2, how); PWN_SHOWN = false; pwnCheck(); return r };
// เติมแถบแจ้งเตือนทุกครั้งที่วาดหน้าใหม่
new MutationObserver(() => { if (PWN) pwnBanner() }).observe(document.getElementById('app'), { childList: true, subtree: true });
// โหมดทดลอง: เปลี่ยนรหัสผ่านสำเร็จ → ล้างธง
if (!SBON && typeof pc == 'function') { const _pc0 = pc; pc = function () { const before = U && U.pw; _pc0(); if (U && U.pw != before) { U.mcp = 0; save(); PWN = false; document.querySelectorAll('.pwn').forEach(x => x.remove()) } } }
