/* 25_slip_viewer.js — ดูสลิปโอนเงินที่ผู้เช่าส่งมา (รูปจริงจาก Storage) สำหรับเจ้าของ ผู้ดูแล และผู้เช่า
   - vsl(id): หน้าต่างแสดงรูปสลิป + ยอด วันที่แจ้ง สถานะ และปุ่มไปใบแจ้งหนี้/ใบเสร็จ
   - slipSrc(i): คืน URL ของรูปสลิป (โหมดทดลอง = data URL, โหมด Supabase = signed URL อายุ 1 ชม. เก็บแคชไว้)
   - fillSlips(): ใส่รูปย่อสลิปในตาราง (img.slt[data-sid]) แบบขอ URL ทีเดียวทั้งชุด
   โหลดเป็นไฟล์ JS สุดท้าย จึงแทนที่ vs() เดิม (ที่ใช้ใน หน้ารับชำระเงิน/ประวัติ) ให้ใช้หน้าต่างใหม่นี้ด้วย */
const SLIPC = {};
async function slipSrc(i) {
    const p = i && i.slip;
    if (!p) return null;
    if (/^data:|^https?:/.test(p)) return p;
    const c = SLIPC[p];
    if (c && c.exp > Date.now()) return c.url;
    if (!SBON || !SBX.cl) return null;
    const r = await SBX.cl.storage.from('slips').createSignedUrl(p, 3600);
    const url = r && r.data && r.data.signedUrl;
    if (url) SLIPC[p] = { url, exp: Date.now() + 55 * 60e3 };
    return url || null;
}
async function fillSlips() {
    const imgs = [...document.querySelectorAll('img.slt[data-sid]:not([src])')];
    if (!imgs.length) return;
    const need = [];
    for (const im of imgs) {
        const i = gi(im.dataset.sid), p = i && i.slip;
        if (!p) continue;
        if (/^data:|^https?:/.test(p)) { im.src = p; continue }
        const c = SLIPC[p];
        if (c && c.exp > Date.now()) { im.src = c.url; continue }
        need.push([im, p]);
    }
    if (!need.length || !SBON || !SBX.cl) return;
    try {
        const paths = [...new Set(need.map(x => x[1]))];
        const r = await SBX.cl.storage.from('slips').createSignedUrls(paths, 3600);
        const m = {};
        ((r && r.data) || []).forEach(x => { if (x.signedUrl) { m[x.path] = x.signedUrl; SLIPC[x.path] = { url: x.signedUrl, exp: Date.now() + 55 * 60e3 } } });
        need.forEach(([im, p]) => { if (m[p]) im.src = m[p]; else im.classList.add('slt-x') });
    } catch (x) { need.forEach(([im]) => im.classList.add('slt-x')) }
}
async function vsl(id) {
    const i = gi(id);
    if (!i) return;
    const u = tu(i) || {}, mt = i.mt == 'qr' ? 'PromptPay QR' : i.mt == 'cash' ? 'เงินสด (เคาน์เตอร์)' : '-';
    const info = `<div class="slv-info">
        <div><small class="mu">ห้อง</small><b>${e(i.room)}</b></div>
        <div><small class="mu">ผู้เช่า</small><b>${e(u.name || '-')}</b></div>
        <div><small class="mu">รอบบิล</small><b>${mon(i.per)}</b></div>
        <div><small class="mu">ยอดที่แจ้งชำระ</small><b class="ac">฿${fm(tot(i))}</b></div>
        <div><small class="mu">ช่องทาง</small><b>${mt}</b></div>
        <div><small class="mu">วันที่แจ้งชำระ</small><b>${i.sub ? dt(i.sub) : '-'}</b></div>
        <div><small class="mu">สถานะ</small>${pill(i)}</div>
    </div>`;
    const btns = `<div class="np acts" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px">
        <button class="b b2" onclick="vi('${id}')">ใบแจ้งหนี้</button>
        ${i.s == 'paid' ? `<button class="b b2" onclick="rc('${id}')">ใบเสร็จ</button>` : ''}
        ${U && U.role == 'admin' && i.s == 'pending' && typeof ap == 'function' ? `<button class="b" onclick="cm();ap('${id}')">อนุมัติ</button>` : ''}
        <button class="b" onclick="cm()">ปิด</button></div>`;
    const body = i.slip
        ? `<div class="slv-img"><div class="slv-ld">กำลังโหลดรูปสลิป…</div><img id="slvimg" alt="สลิปโอนเงินห้อง ${e(i.room)}" style="display:none"></div>`
        : `<div class="slv-none">${i.mt == 'cash' ? '💵 ชำระเป็นเงินสดที่เคาน์เตอร์ — ไม่มีสลิปโอนเงิน' : 'ผู้เช่ายังไม่ได้ส่งสลิปโอนเงินสำหรับบิลนี้'}</div>`;
    mo(`<h3>สลิปโอนเงินที่ผู้เช่าส่งมา</h3><small class="mu">${e(i.id)}</small>${body}${info}${btns}`);
    if (innerWidth > 800) $('#mc').style.maxWidth = '520px';
    if (!i.slip) return;
    const src = await slipSrc(i), im = $('#slvimg'), ld = document.querySelector('.slv-ld');
    if (!im) return;
    if (!src) { if (ld) ld.textContent = 'เปิดรูปสลิปไม่สำเร็จ'; return }
    im.onload = () => { if (ld) ld.remove(); im.style.display = 'block' };
    im.onerror = () => { if (ld) ld.textContent = 'เปิดรูปสลิปไม่สำเร็จ' };
    im.onclick = () => window.open(src, '_blank');
    im.src = src;
}
// ใช้หน้าต่างใหม่แทน vs() เดิมทุกที่ (หน้ารับชำระเงินของผู้ดูแล, ประวัติของผู้เช่า, รายงานของเจ้าของ)
vs = vsl;
// เติมรูปย่อสลิปหลังวาดหน้าใหม่ทุกครั้ง
new MutationObserver(() => { if (document.querySelector('img.slt[data-sid]:not([src])')) fillSlips() })
    .observe(document.getElementById('app'), { childList: true, subtree: true });
