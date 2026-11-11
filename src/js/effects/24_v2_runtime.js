/* 24_v2_runtime.js — V2 runtime เอฟเฟกต์เสริมฝั่งหน้าเว็บ
   (แยกมาจาก script.js บรรทัด 1580-1625; โหลดเรียงตามเลขหน้าชื่อไฟล์ใน index.html) */
/* ===== V2 runtime (เอฟเฟกต์เสริมฝั่งหน้าเว็บ) — ห่อ try/catch ถ้าขัดข้องหน้าเว็บยังทำงานตามเดิม ===== */
(function () {
  try {
    const RM = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches),
      body = document.body;
    // 1) แถบบนเปลี่ยนรูปแบบเมื่อเลื่อน + ปุ่มกลับขึ้นบน
    const up = document.createElement('button');
    up.className = 'totop np';
    up.type = 'button';
    up.innerHTML = IC.top;
    up.setAttribute('aria-label', 'Back to top');
    up.onclick = () => window.scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' });
    body.appendChild(up);
    let sf = 0;
    const onScroll = () => {
      if (sf) return;
      sf = requestAnimationFrame(() => {
        sf = 0;
        const y = window.scrollY;
        document.querySelectorAll('.top').forEach(t => t.classList.toggle('is-scrolled', y > 8));
        up.classList.toggle('show', y > 420);
        up.dataset.tip = T2('กลับขึ้นด้านบน');
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    // 2) เนื้อหาส่วนล่างค่อยๆ ปรากฏเมื่อเลื่อนมาถึง (เฉพาะส่วนที่อยู่นอกจอตอนเรนเดอร์)
    const io =
      'IntersectionObserver' in window && !RM
        ? new IntersectionObserver(
            es =>
              es.forEach(en => {
                if (en.isIntersecting) {
                  en.target.classList.add('in');
                  io.unobserve(en.target);
                }
              }),
            { rootMargin: '0px 0px -6% 0px' }
          )
        : null;
    const reveal = () => {
      if (!io) return;
      document
        .querySelectorAll('#app .mn>*:not(.top):not(h2):not(p),#app .dg3b>.cd')
        .forEach(el => {
          if (el.dataset.rv) return;
          el.dataset.rv = '1';
          if (el.getBoundingClientRect().top > innerHeight * 0.92) {
            el.classList.add('rv');
            io.observe(el);
          }
        });
    };
    // 3) คำอธิบายสั้นๆ ของตัวเลขสถิติ (tooltip)
    const TIPS = [
      [
        'รายได้เดือนนี้',
        'Revenue this month',
        'ยอดรวมใบเรียกเก็บที่ชำระแล้วของรอบบิลปัจจุบัน',
        'Total of paid invoices in the current billing cycle',
      ],
      [
        'ยังไม่ชำระ',
        'Unpaid',
        'ใบเรียกเก็บที่ผู้เช่ายังไม่แจ้งชำระ',
        'Invoices the tenant has not paid yet',
      ],
      [
        'ผิดนัดชำระ',
        'Overdue',
        'ใบเรียกเก็บที่เกินวันที่ 10 ของเดือนถัดไปและยังไม่ชำระ',
        'Unpaid invoices past the 10th of the following month',
      ],
      [
        'อัตราการเข้าพัก',
        'Occupancy rate',
        'สัดส่วนห้องที่มีผู้เช่าต่อห้องทั้งหมด',
        'Share of rooms with a tenant out of all rooms',
      ],
      ['ห้องทั้งหมด', 'Total rooms', 'จำนวนห้องพักทั้งหมดในระบบ', 'All rooms in the system'],
      [
        'เดือนที่แล้ว',
        'Last month',
        'รายได้ที่ชำระแล้วของรอบบิลก่อนหน้า',
        'Paid revenue of the previous billing cycle',
      ],
      [
        'รวมทั้งปี',
        'Year to date',
        'รายได้ที่ชำระแล้วสะสมตั้งแต่ต้นปี',
        'Paid revenue accumulated since January',
      ],
      [
        'เทียบเดือนก่อน',
        'Vs last month',
        'เปอร์เซ็นต์การเปลี่ยนแปลงของรายได้เทียบกับเดือนก่อน',
        'Percentage change in revenue vs last month',
      ],
    ];
    const tips = () => {
      const en = LANG == 'en';
      document.querySelectorAll('#app small.mu,#app .mu,#app h3').forEach(el => {
        if (el.dataset.tp || el.children.length > 1) return;
        const t = el.textContent.trim(),
          r = TIPS.find(x => t === x[0] || t === x[1]);
        if (r) {
          el.dataset.tp = '1';
          const c = el.closest('.cd,div') || el;
          c.title = en ? r[3] : r[2];
        }
      });
    };
    // 4) ตรวจข้อมูลแบบเรียลไทม์ใต้ช่องกรอก (อีเมล เบอร์โทร รหัสผ่านใหม่)
    const RULES = {
      em: [v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'รูปแบบอีเมลไม่ถูกต้อง'],
      ae: [v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'รูปแบบอีเมลไม่ถูกต้อง'],
      p_e: [v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'รูปแบบอีเมลไม่ถูกต้อง'],
      at: [v => !v || /^[0-9+\-\s]{9,15}$/.test(v), 'เบอร์โทรไม่ถูกต้อง'],
      p_t: [v => !v || /^[0-9+\-\s]{9,15}$/.test(v), 'เบอร์โทรไม่ถูกต้อง'],
      ap: [v => v.length >= 6, 'รหัสผ่านอย่างน้อย 6 ตัว'],
    };
    const mark = el => {
      const r = RULES[el.id];
      if (!r) return;
      const v = el.value.trim(),
        ok = el.id == 'em' ? !v || r[0](v) : r[0](v),
        host = el.closest('.fi') || el;
      let m = host.nextElementSibling;
      if (!(m && m.classList.contains('fld-msg'))) {
        m = null;
      }
      el.classList.toggle('is-invalid', !ok && (v !== '' || el.dataset.t));
      el.classList.toggle('is-valid', ok && v !== '');
      if (!ok && (v !== '' || el.dataset.t)) {
        if (!m) {
          m = document.createElement('div');
          m.className = 'fld-msg';
          host.after(m);
        }
        m.textContent = T2(r[1]);
      } else if (m) m.remove();
    };
    document.addEventListener('input', e => {
      const el = e.target;
      if (el && el.id && RULES[el.id]) {
        el.dataset.t = el.dataset.t || (el.value.length > 0 ? '1' : '');
        mark(el);
      }
    });
    document.addEventListener('focusout', e => {
      const el = e.target;
      if (el && el.id && RULES[el.id] && el.value !== '') {
        el.dataset.t = '1';
        mark(el);
      }
    });
    // 5) แถบความคืบหน้าด้านบน: แสดงเฉพาะตอนมีการโหลด/บันทึกข้อมูลจริงเท่านั้น
    let bz = 0,
      bt = 0;
    const busy = d => {
      bz += d;
      clearTimeout(bt);
      if (bz > 0) body.classList.add('is-busy');
      else bt = setTimeout(() => body.classList.remove('is-busy'), 250);
    };
    ['sbLoad', 'sbPush'].forEach(n => {
      const f = window[n];
      if (typeof f !== 'function' || f.__bz) return;
      const w = async function (...a) {
        busy(1);
        try {
          return await f.apply(this, a);
        } finally {
          busy(-1);
        }
      };
      w.__bz = 1;
      window[n] = w;
    });
    // เรียกซ้ำทุกครั้งที่หน้าถูกวาดใหม่
    const after = () => {
      reveal();
      tips();
      onScroll();
      syncThemeUI && syncThemeUI();
    };
    const app = document.querySelector('#app');
    if (app)
      new MutationObserver(() => {
        requestAnimationFrame(after);
      }).observe(app, { childList: true });
    after();
  } catch (x) {
    try {
      console.warn('V2 runtime:', x);
    } catch (y) {}
  }
})();
