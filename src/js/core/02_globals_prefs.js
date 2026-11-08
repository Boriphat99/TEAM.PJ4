/* 02_globals_prefs.js — ไอคอนผู้ใช้, ตัวแปรภาษา/ธีม/ค่าตั้งส่วนตัว (LANG, THEME, PF)
   (แยกมาจาก script.js บรรทัด 5-11; โหลดเรียงตามเลขหน้าชื่อไฟล์ใน index.html) */
        const PI = '<svg viewBox="0 0 24 24" width="1.05em" height="1.05em" fill="currentColor" style="vertical-align:-.15em"><circle cx="12" cy="7.5" r="4.2"/><path d="M3.5 21.5c0-4.9 3.8-8.3 8.5-8.3s8.5 3.4 8.5 8.3z"/></svg>';
        let LANG = 'th',
            THEME = (()=>{try{return localStorage.getItem('ttm_theme')||'light'}catch(x){return'light'}})(),
            PF = {};
        try {
            PF = JSON.parse(localStorage.getItem('ttm_pf') || '{}')
        } catch (x) {}
