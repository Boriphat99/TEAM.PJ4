/* 04_i18n_apply_prefs.js — ใช้ภาษา/ธีม/ค่าตั้งส่วนตัวกับหน้าเว็บ (applyPf, setPf)
   (แยกมาจาก script.js บรรทัด 657-681; โหลดเรียงตามเลขหน้าชื่อไฟล์ใน index.html) */
        new MutationObserver(l => {
            if (LANG != 'en') return;
            l.forEach(m => m.type == 'characterData' ? tlN(m.target) : m.addedNodes.forEach(tlN))
        }).observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
        const applyPf = u => {
            const p = (u && u.pf) || PF;
            LANG = p.lang || 'th';
            document.documentElement.dataset.theme = THEME;
            document.documentElement.lang = LANG
        };

        function setPf(k, v) {
            if (k == 'theme') { applyTheme(v); return }
            const snap = snapForm();
            if (U) { U.pf = Object.assign({}, U.pf || PF, { [k]: v }); PF = U.pf; save() }
            else PF = Object.assign({}, PF, { [k]: v });
            try { localStorage.setItem('ttm_pf', JSON.stringify(PF)) } catch (x) {}
            applyPf(U);
            R();
            restoreForm(snap)
        }
