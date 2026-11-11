/* 05_supabase_config.js — ค่าเชื่อมต่อ Supabase (SB_CFG, SBON)
   (แยกมาจาก script.js บรรทัด 682-689; โหลดเรียงตามเลขหน้าชื่อไฟล์ใน index.html) */
// ================= ตั้งค่าการเชื่อมต่อ Supabase =================
// ใส่ Project URL และ anon public key (Dashboard > Project Settings > API) ถ้าเว้นว่างไว้ เว็บจะทำงานแบบเก็บข้อมูลในเบราว์เซอร์ (โหมดทดลอง)
// หรือกำหนดค่า window.TTM_SB = {url:'https://xxxx.supabase.co', key:'eyJ...'} ในแท็กสคริปต์ก่อนหน้าไฟล์นี้
const SB_CFG = window.TTM_SB || {
    url: 'https://hpliogcnsxtnrvuyykzd.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwbGlvZ2Nuc3h0bnJ2dXl5a3pkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2ODEyMTMsImV4cCI6MjEwNzI1NzIxM30.DZSHUiux5-7ZOFAd26rKql7boEC7W7OqVhnmlekXPwo',
  },
  SBON = !!(SB_CFG.url && SB_CFG.key);
