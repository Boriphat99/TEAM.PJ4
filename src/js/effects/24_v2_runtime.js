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
    up.setAttribute('aria-label', 'กลับขึ้นด้านบน');
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
        'ใบเรียกเก็บที่เลยวันครบกำหนดมาเกิน 5 วันและยังไม่ชำระ',
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
      at: [v => !v || TELOK(v), 'เบอร์โทรไม่ถูกต้อง'],
      af_t: [v => !v || TELOK(v), 'เบอร์โทรไม่ถูกต้อง'],
      f_t: [v => !v || TELOK(v), 'เบอร์โทรไม่ถูกต้อง'],
      p_t: [v => !v || TELOK(v), 'เบอร์โทรไม่ถูกต้อง'],
      ap: [v => !pwBad(v), 'รหัสผ่านอย่างน้อย 8 ตัว มีตัวอักษรและตัวเลข'],
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
    // 4) หน้าต้อนรับ: ลูกเล่นตอนเลื่อน (การ์ดโผล่ทีละใบ ตัวเลขนับขึ้น เส้นขั้นตอน ภาพเอียง)
    const apFx = () => {
      const root = document.querySelector('.apl');
      if (!root || root.dataset.fx) return;
      root.dataset.fx = '1';
      if (RM || !('IntersectionObserver' in window)) return;
      document.documentElement.classList.add('ap-js');
      // ตัวเลขนับขึ้นจาก 0 (คงคำนำหน้า/ต่อท้าย เช่น ฿)
      const count = b => {
        if (!b) return;
        const t0 = b.textContent,
          m = t0.match(/^(\D*)([\d,]+)(.*)$/);
        if (!m) return;
        const n = +m[2].replace(/,/g, ''),
          st = performance.now(),
          dur = 1100;
        const f = now => {
          const k = Math.min(1, (now - st) / dur),
            v = Math.round(n * (1 - Math.pow(1 - k, 3)));
          b.textContent = m[1] + v.toLocaleString('en-US') + m[3];
          if (k < 1) requestAnimationFrame(f);
          else b.textContent = t0;
        };
        requestAnimationFrame(f);
      };
      root.querySelectorAll('.ap-r').forEach(el => {
        const sib = [...el.parentElement.children].filter(x => x.classList.contains('ap-r'));
        el.style.setProperty('--d', Math.min(sib.indexOf(el), 6) * 90 + 'ms');
        if (el.matches('.ap-sec h2')) el.classList.add('ap-fxh');
      });
      const ob = new IntersectionObserver(
        es =>
          es.forEach(en => {
            if (!en.isIntersecting) return;
            const el = en.target;
            ob.unobserve(el);
            if (el.matches('.ap-ol')) return el.classList.add('ap-line');
            el.classList.add('ap-on');
            if (el.matches('.ap-st > div')) count(el.querySelector('b'));
            // เล่นจบแล้วคืนสไตล์ปกติ (ให้เอฟเฟกต์ตอนชี้เมาส์ทำงานตามเดิม)
            setTimeout(
              () => {
                el.classList.remove('ap-r', 'ap-on');
                el.classList.add('ap-done');
              },
              1600 + (parseFloat(el.style.getPropertyValue('--d')) || 0)
            );
          }),
        { rootMargin: '0px 0px -10% 0px', threshold: 0.12 }
      );
      root.querySelectorAll('.ap-r, .ap-ol').forEach(el => ob.observe(el));
      apTilt();
      // 4) หัวข้อใหญ่: บรรทัดแรกโผล่ทีละคำ แล้วบรรทัดสีปาดเข้ามา
      const h1 = root.querySelector('.ap-hero h1');
      if (h1) {
        const seg =
          window.Intl && Intl.Segmenter ? new Intl.Segmenter(document.documentElement.lang || 'th', { granularity: 'word' }) : null;
        let k = 0;
        [...h1.childNodes].forEach(n => {
          if (n.nodeType != 3 || !n.textContent.trim()) return;
          const parts = seg ? [...seg.segment(n.textContent)].map(x => x.segment) : n.textContent.split(/(\s+)/),
            fr = document.createDocumentFragment();
          parts.forEach(t => {
            if (!t.trim()) return fr.appendChild(document.createTextNode(t));
            const sp = document.createElement('span');
            sp.className = 'ap-w';
            sp.textContent = t;
            sp.style.setProperty('--d', 120 + k++ * 110 + 'ms');
            fr.appendChild(sp);
          });
          n.replaceWith(fr);
        });
        const em = h1.querySelector('em');
        if (em) {
          em.classList.add('ap-wipe');
          em.style.setProperty('--d', 200 + k * 110 + 'ms');
        }
      }
      // 3) แถบระยะการเลื่อน
      const nav = root.querySelector('.ap-nav');
      if (nav && !nav.querySelector('.ap-prog')) {
        const pr = document.createElement('i');
        pr.className = 'ap-prog';
        nav.appendChild(pr);
      }
      apScroll();
      // 2) การ์ดเอียงตามเมาส์ (เฉพาะอุปกรณ์ที่มีเมาส์)
      if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const sel = '.ap-tile, .ap-ol li, .ap-st > div';
        root.addEventListener('pointermove', ev => {
          const c = ev.target.closest && ev.target.closest(sel);
          if (!c || c.classList.contains('ap-r')) return;
          const r = c.getBoundingClientRect(),
            x = (ev.clientX - r.left) / r.width,
            y = (ev.clientY - r.top) / r.height;
          c.style.setProperty('--ry', ((x - 0.5) * 12).toFixed(2) + 'deg');
          c.style.setProperty('--rx', ((0.5 - y) * 10).toFixed(2) + 'deg');
          c.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
          c.style.setProperty('--my', (y * 100).toFixed(1) + '%');
          c.classList.add('ap-tl');
        });
        root.addEventListener('pointerout', ev => {
          const c = ev.target.closest && ev.target.closest(sel);
          if (c && !c.contains(ev.relatedTarget)) c.classList.remove('ap-tl');
        });
      }
      // 7) จอตัวอย่างระบบเลื่อนให้ดูเอง (หยุดเมื่อชี้เมาส์ หรือเมื่อเลื่อนหน้าผ่านไปแล้ว)
      const box = root.querySelector('.ap-dev .pvx');
      if (box) {
        let vis = true,
          hov = false,
          dir = 1,
          wait = performance.now() + 1800,
          last = performance.now();
        new IntersectionObserver(es => (vis = es[0].isIntersecting)).observe(box);
        box.addEventListener('pointerenter', () => (hov = true));
        box.addEventListener('pointerleave', () => (hov = false));
        const step = now => {
          if (!box.isConnected) return;
          const dt = Math.min(64, now - last);
          last = now;
          const max = box.scrollHeight - box.clientHeight;
          if (vis && !hov && max > 0 && now > wait) {
            box.scrollTop += dir * dt * (dir > 0 ? 0.045 : 0.16);
            if (dir > 0 && box.scrollTop >= max - 1) (dir = -1), (wait = now + 1600);
            else if (dir < 0 && box.scrollTop <= 0) (dir = 1), (wait = now + 2200);
          }
          requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    };
    // 3) + 6) แถบระยะการเลื่อน และไฮไลต์เมนูตามส่วนที่กำลังดู
    const apScroll = () => {
      const root = document.querySelector('.apl');
      if (!root) return;
      const de = document.documentElement,
        p = Math.max(0, Math.min(1, scrollY / Math.max(1, de.scrollHeight - innerHeight))),
        pr = root.querySelector('.ap-prog');
      if (pr) pr.style.setProperty('--p', p.toFixed(4));
      const ln = root.querySelectorAll('.ap-links a'),
        y = scrollY + innerHeight * 0.4,
        top = id => {
          const el = document.getElementById(id);
          return el ? el.getBoundingClientRect().top + scrollY : 1e9;
        };
      const on = p > 0.98 || y >= top('hst') ? 2 : y >= top('hf') ? 1 : 0;
      ln.forEach((a, i) => a.classList.toggle('on', i == on));
    };
    // ภาพตัวอย่างระบบเอียง ~14° ตอนอยู่บนสุด แล้วค่อยๆ ตั้งตรงเมื่อเลื่อนลง
    let apTk = 0;
    const apTilt = () => {
      apTk = 0;
      const w = document.querySelector('html.ap-js .apl .ap-dev .pvw');
      if (!w) return;
      const k = Math.max(0, Math.min(1, 1 - scrollY / (innerHeight * 0.55)));
      w.style.setProperty('--tilt', (k * 14).toFixed(2) + 'deg');
      w.style.setProperty('--sc', (1 - k * 0.06).toFixed(3));
    };
    window.addEventListener(
      'scroll',
      () => {
        if (!apTk)
          apTk = requestAnimationFrame(() => {
            apTilt();
            apScroll();
          });
      },
      { passive: true }
    );
    // เรียกซ้ำทุกครั้งที่หน้าถูกวาดใหม่
    const after = () => {
      reveal();
      apFx();
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
