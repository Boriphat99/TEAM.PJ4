/* 23_ui_polish_effects.js — เอฟเฟกต์เสริม (UI polish) ไม่แตะลอจิกเดิม
   (แยกมาจาก script.js บรรทัด 1525-1579; โหลดเรียงตามเลขหน้าชื่อไฟล์ใน index.html) */
/* ===== UI POLISH LAYER (เอฟเฟกต์เสริม) — ไม่แตะลอจิกเดิม ถ้าส่วนนี้ขัดข้อง หน้าเว็บยังทำงานตามเดิม ===== */
(function () {
  try {
    const RM = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches),
      body = document.body;
    body.classList.add('ttm-js');
    let lastKey = null,
      enterT = 0,
      sched = 0;
    const pageKey = () => {
      try {
        return P + '|' + (U ? U.role : '');
      } catch (x) {
        return '';
      }
    };
    const fmt = (v, d) =>
      v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
    const mem = {};
    // นับตัวเลขสถิติ: จบด้วยข้อความเดิมของระบบเสมอ (ตัวเลขจริงไม่ถูกเปลี่ยน)
    const animate = (el, pre, a, b, d, suf, raw) => {
      const t0 = performance.now(),
        T = 650;
      el.dataset.cuA = '1';
      const step = now => {
        if (!el.isConnected) return;
        const p = Math.min(1, (now - t0) / T),
          k = 1 - Math.pow(1 - p, 3);
        if (p < 1) {
          el.textContent = pre + fmt(a + (b - a) * k, d) + suf;
          requestAnimationFrame(step);
        } else {
          el.textContent = raw;
          setTimeout(() => {
            delete el.dataset.cuA;
          }, 0);
        }
      };
      requestAnimationFrame(step);
    };
    const counts = () => {
      let idx = 0;
      document.querySelectorAll('#app .k,#app .big').forEach(el => {
        const i = idx++;
        if (el.dataset.cu || el.children.length) return;
        el.dataset.cu = '1';
        const raw = el.textContent,
          m = /^([^\d\-]*)(-?\d{1,3}(?:,\d{3})+(?:\.\d+)?|-?\d+(?:\.\d+)?)([^\d]*)$/.exec(
            raw.trim()
          );
        if (!m) return;
        const n = parseFloat(m[2].replace(/,/g, ''));
        if (!isFinite(n)) return;
        const key = lastKey + '#' + i,
          prev = mem[key];
        mem[key] = n;
        const from = prev === undefined ? 0 : prev;
        if (RM || from === n) return;
        animate(el, m[1], from, n, (m[2].split('.')[1] || '').length, m[3], raw);
      });
    };
    const tick = () => {
      const k = pageKey();
      if (k !== lastKey) {
        lastKey = k;
        if (!RM) {
          body.classList.add('ttm-enter');
          clearTimeout(enterT);
          enterT = setTimeout(() => body.classList.remove('ttm-enter'), 1000);
        }
      }
      counts();
    };
    const app = document.querySelector('#app');
    if (app)
      new MutationObserver(recs => {
        if (sched || recs.every(r => r.target.dataset && r.target.dataset.cuA)) return;
        sched = requestAnimationFrame(() => {
          sched = 0;
          tick();
        });
      }).observe(app, { childList: true, subtree: true });
    // Toast: เปลี่ยน ✓ / ⚠ นำหน้าข้อความ เป็นไอคอนวงกลม
    new MutationObserver(recs =>
      recs.forEach(r =>
        r.addedNodes.forEach(n => {
          if (n.nodeType !== 1 || !n.classList.contains('ts')) return;
          const t = n.textContent,
            m = /^\s*([✓⚠])\s*/.exec(t);
          if (m) {
            n.dataset.k = m[1] === '✓' ? 'ok' : 'er';
            n.textContent = t.replace(/^\s*[✓⚠]\s*/, '');
          }
        })
      )
    ).observe(body, { childList: true });
    // Ripple เมื่อกดปุ่ม
    document.addEventListener(
      'pointerdown',
      e => {
        if (RM) return;
        const b = e.target.closest && e.target.closest('.b,.hb');
        if (!b || b.disabled || b.dataset.busy) return;
        const r = b.getBoundingClientRect(),
          s = Math.max(r.width, r.height) * 2;
        if (getComputedStyle(b).position === 'static') b.classList.add('ttm-rel');
        let c = [...b.children].find(x => x.classList && x.classList.contains('rpc'));
        if (!c) {
          c = document.createElement('span');
          c.className = 'rpc';
          b.appendChild(c);
        }
        const rp = document.createElement('span');
        rp.className = 'rp';
        rp.style.cssText =
          'width:' +
          s +
          'px;height:' +
          s +
          'px;left:' +
          (e.clientX - r.left - s / 2) +
          'px;top:' +
          (e.clientY - r.top - s / 2) +
          'px';
        c.appendChild(rp);
        setTimeout(() => rp.remove(), 600);
      },
      { passive: true }
    );
    // กันกดซ้ำ: ปุ่มที่เรียกฟังก์ชัน async จะถูกล็อกและหมุนจนกว่าจะทำงานเสร็จ (ฟังก์ชันเดิมทำงานเหมือนเดิมทุกอย่าง)
    let cur = null;
    document.addEventListener(
      'click',
      e => {
        const b = e.target.closest && e.target.closest('button[onclick],a.b[onclick]');
        if (!b) return;
        if (b.dataset.busy) {
          e.stopImmediatePropagation();
          e.preventDefault();
          return;
        }
        const m = /^\s*([A-Za-z_$][\w$]*)\s*\(/.exec(b.getAttribute('onclick') || '');
        if (!m) return;
        const n = m[1],
          f = window[n];
        if (typeof f !== 'function') return;
        if (!f.__ttm) {
          if (f.constructor.name !== 'AsyncFunction') return;
          const w = async function (...a) {
            const btn = cur;
            cur = null;
            if (btn) {
              btn.dataset.busy = '1';
              btn.classList.add('is-loading');
            }
            try {
              return await f.apply(this, a);
            } finally {
              if (btn) {
                delete btn.dataset.busy;
                btn.classList.remove('is-loading');
              }
            }
          };
          w.__ttm = 1;
          window[n] = w;
        }
        cur = b;
        setTimeout(() => {
          if (cur === b) cur = null;
        }, 0);
      },
      true
    );
    tick();
  } catch (x) {
    try {
      console.warn('UI polish layer:', x);
    } catch (y) {}
  }
})();
