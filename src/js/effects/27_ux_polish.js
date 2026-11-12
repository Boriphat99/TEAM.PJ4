/* 27_ux_polish.js — ปรับความลื่นและใช้งานง่าย (ไม่เปลี่ยนการทำงานของระบบ)
   1) เปลี่ยนหน้าแล้วเลื่อนขึ้นบนสุด + เฟดเข้าหน้าใหม่ (เฉพาะตอนเปลี่ยนหน้า ไม่ใช่ตอนข้อมูลอัปเดต)
   2) เมนูล่างบนมือถือ: เลื่อนให้เมนูที่เลือกอยู่กลางจอเสมอ
   3) กด Esc เพื่อปิดหน้าต่างป๊อปอัป
   4) กันการกดปุ่มซ้ำเร็วๆ (ดับเบิลแทป) เช่น อนุมัติ/ออกบิล/ส่งสลิป ซ้ำสองครั้ง
   5) ใส่ป้ายชื่อ (aria-label) ให้ปุ่มที่มีแต่ไอคอน เพื่อโปรแกรมอ่านหน้าจอ
   6) แป้นพิมพ์ตัวเลขบนมือถือสำหรับช่องเลขมิเตอร์/จำนวนเงิน/เบอร์โทร
   7) โหลดตัวสร้างรูปใบเสร็จ (html2canvas) เมื่อกด "บันทึกรูปใบเสร็จ" เท่านั้น ทำให้เปิดเว็บเร็วขึ้น */

(function () {
  const app = document.getElementById('app');
  let lastP = typeof P != 'undefined' ? P : null,
    lastU = null;

  // ---------- 1) + 2) หลังวาดหน้าใหม่ ----------
  function afterRender() {
    const curU = U && U.id;
    const pageChanged = P !== lastP || curU !== lastU;
    if (pageChanged) {
      lastP = P;
      lastU = curU;
      if (getComputedStyle(document.getElementById('mo')).display == 'none' && !location.hash) {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
      const mn = app.querySelector('.mn') || app.firstElementChild;
      if (mn && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        mn.classList.remove('pg-in');
        void mn.offsetWidth;
        mn.classList.add('pg-in');
      }
    }
    centerNav(pageChanged);
    labelIcons();
    numericInputs();
  }
  function centerNav(smooth) {
    if (innerWidth > 800) return;
    const sb = app.querySelector('.sb'),
      on = sb && sb.querySelector('.nv.on');
    if (!sb || !on || sb.scrollWidth <= sb.clientWidth) return;
    const target = on.offsetLeft - (sb.clientWidth - on.offsetWidth) / 2;
    sb.scrollTo({ left: Math.max(0, target), behavior: smooth ? 'smooth' : 'instant' });
  }
  let raf = 0;
  new MutationObserver(() => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(afterRender);
  }).observe(app, { childList: true });
  addEventListener('resize', () => centerNav(false), { passive: true });

  // ---------- 3) Esc ปิดหน้าต่าง ----------
  document.addEventListener('keydown', ev => {
    if (ev.key != 'Escape') return;
    const mo = document.getElementById('mo');
    if (mo && getComputedStyle(mo).display != 'none') {
      ev.preventDefault();
      cm();
    }
  });

  // ---------- 4) กันกดซ้ำ ----------
  const lastClick = new WeakMap();
  document.addEventListener(
    'click',
    ev => {
      const b = ev.target.closest && ev.target.closest('button.b, .b[onclick]');
      if (!b || b.closest('.seg, .fl, .tabs')) return;
      const now = Date.now(),
        t = lastClick.get(b) || 0;
      if (now - t < 700) {
        ev.stopPropagation();
        ev.preventDefault();
        return;
      }
      lastClick.set(b, now);
    },
    true
  );

  // ---------- 5) ป้ายชื่อปุ่มไอคอน ----------
  function labelIcons() {
    app.querySelectorAll('[data-tip]:not([aria-label])').forEach(el => {
      if (!(el.innerText || '').trim() || el.matches('.thm, .lo, .me, .sbt, .nv'))
        el.setAttribute('aria-label', el.getAttribute('data-tip'));
    });
    app
      .querySelectorAll('.top .lo:not([aria-label])')
      .forEach(el => el.setAttribute('aria-label', 'ออกจากระบบ'));
  }

  // ---------- 6) แป้นตัวเลข ----------
  function numericInputs() {
    document
      .querySelectorAll('input[type=number]:not([inputmode])')
      .forEach(i => i.setAttribute('inputmode', i.step && i.step != '1' ? 'decimal' : 'numeric'));
    document
      .querySelectorAll('input[type=tel]:not([inputmode])')
      .forEach(i => i.setAttribute('inputmode', 'tel'));
    document.querySelectorAll('input[type=email]:not([inputmode])').forEach(i => {
      i.setAttribute('inputmode', 'email');
      i.setAttribute('autocapitalize', 'off');
    });
  }
  new MutationObserver(() => {
    numericInputs();
  }).observe(document.getElementById('mc'), { childList: true });

  // ---------- 7) โหลด html2canvas เมื่อจำเป็น ----------
  let h2c = null;
  // html2canvas 1.4.1 อ่านสีแบบใหม่ (color-mix / color()) ของดีไซน์ไม่ได้ จะหยุดทำงานกลางคัน
  // ใบเสร็จ/ใบแจ้งหนี้ใช้สไตล์ในตัว (inline) อยู่แล้ว จึงถอดสไตล์ชีตของเว็บออกจาก "สำเนา" ที่ใช้ถ่ายรูป เหลือแค่ฟอนต์
  function wrapH2C() {
    const o = window.html2canvas;
    if (!o || o.__ttm) return;
    const w = function (el, opt) {
      opt = Object.assign({}, opt);
      const user = opt.onclone;
      opt.onclone = function (doc, cel) {
        doc.querySelectorAll('style, link[rel=stylesheet]').forEach(n => {
          if (!/fonts\.googleapis|fontsource/.test(n.href || '')) n.remove();
        });
        const st = doc.createElement('style');
        st.textContent =
          'html,body{background:#fff!important;color:#0f172a}*{box-shadow:none!important;text-shadow:none!important}' +
          ".doc,.doc *{font-family:'Noto Sans Thai','IBM Plex Sans Thai',Tahoma,sans-serif!important}" +
          '.pl{display:inline-block;padding:3px 10px;border-radius:999px;font-weight:600;font-size:12px}' +
          '.pl.g{color:#0e7a4b;background:#e9f6ef}.pl.y{color:#8f5f00;background:#fcf4dd}.pl.r{color:#a8122c;background:#fbecee}.pl.p{color:#5f2ba0;background:#f2ecfb}';
        doc.head.appendChild(st);
        if (user) return user(doc, cel);
      };
      return o(el, opt);
    };
    w.__ttm = 1;
    window.html2canvas = w;
  }
  window.loadH2C = function () {
    if (window.html2canvas) {
      wrapH2C();
      return Promise.resolve();
    }
    if (h2c) return h2c;
    h2c = new Promise((ok, no) => {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      s.onload = () => {
        wrapH2C();
        ok();
      };
      s.onerror = () => {
        h2c = null;
        no(new Error('load'));
      };
      document.head.appendChild(s);
    });
    return h2c;
  };
  if (typeof si == 'function') {
    const _si = si;
    si = async function (id) {
      if (!window.html2canvas) tt('กำลังเตรียมรูปใบเสร็จ…');
      try {
        await loadH2C();
      } catch (x) {
        return alert('โหลดตัวสร้างรูปไม่สำเร็จ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองใหม่');
      }
      return _si(id);
    };
  }
  // โหลดล่วงหน้าแบบเงียบๆ ตอนเครื่องว่าง เพื่อให้กดบันทึกใบเสร็จได้ทันที
  (window.requestIdleCallback || (f => setTimeout(f, 4000)))(
    () => {
      if (U) loadH2C().catch(() => {});
    },
    { timeout: 8000 }
  );

  afterRender();
})();

/* จำตำแหน่งที่กดล่าสุด ให้การสลับธีมขยายเป็นวงกลมออกจากปุ่มที่กด (ดู 25_premium.css หมวด 30) */
(function () {
  const r = document.documentElement;
  document.addEventListener(
    'pointerdown',
    e => {
      const x = e.clientX,
        y = e.clientY,
        rad = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      r.style.setProperty('--vt-x', x + 'px');
      r.style.setProperty('--vt-y', y + 'px');
      r.style.setProperty('--vt-r', Math.ceil(rad) + 'px');
    },
    { capture: true, passive: true }
  );
})();
