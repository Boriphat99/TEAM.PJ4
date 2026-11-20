/* 30_refine_motion.js — ความลื่นตอนใช้งาน (ไม่เปลี่ยนการทำงาน)
   · ตัวเลขสรุปในหน้า (.k / .big) นับขึ้นสั้น ๆ เฉพาะตอนเปิดหน้าใหม่ ไม่เล่นซ้ำตอนข้อมูลอัปเดต
   ผู้ใช้ที่ตั้งค่าลดการเคลื่อนไหวในเครื่อง จะไม่เห็นภาพเคลื่อนไหว */
(() => {
  const calm = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const countUp = () => {
    if (calm()) return;
    document.querySelectorAll('#app .mn .k, #app .mn .big').forEach(el => {
      if (el.children.length) return;
      const t = el.textContent,
        m = t.match(/^(\D*?)(\d[\d,]*(?:\.\d+)?)(\D*)$/);
      if (!m) return;
      const v = +m[2].replace(/,/g, '');
      if (!(v >= 2)) return;
      const dec = (m[2].split('.')[1] || '').length,
        f = n =>
          n.toLocaleString('en-US', {
            minimumFractionDigits: dec,
            maximumFractionDigits: dec,
            useGrouping: m[2].includes(','),
          }),
        d = 650;
      let t0 = 0;
      const step = now => {
        if (!el.isConnected) return;
        if (!t0) t0 = now; // เริ่มนับจากเฟรมแรกจริง (กันค่าเวลาก่อนเริ่มทำให้ตัวเลขติดลบ)
        const k = Math.min(1, Math.max(0, (now - t0) / d)),
          z = 1 - Math.pow(1 - k, 3);
        el.textContent = k < 1 ? m[1] + f(v * z) + m[3] : t;
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      // กันกรณีแท็บอยู่เบื้องหลังแล้วภาพเคลื่อนไหวหยุดกลางทาง: คืนค่าจริงเสมอ
      setTimeout(() => {
        if (el.isConnected) el.textContent = t;
      }, d + 150);
    });
  };
  const R_ = R;
  let lastP = null;
  // eslint-disable-next-line no-global-assign
  R = function () {
    const r = R_.apply(this, arguments);
    try {
      if (!U) lastP = null;
      else if (P !== lastP) {
        lastP = P;
        countUp();
      }
    } catch (x) {}
    return r;
  };
})();
