// build.js — รวมไฟล์ใน src/ เป็นไฟล์ขึ้นเว็บที่รากของ repo: index.html, style.css, script.js และโฟลเดอร์ static/
// ใช้งาน:  node build.js      (หรือ  npm run build)
// ลำดับการรวมอ่านจากแท็กใน src/index.html เรียงจากบนลงล่าง จึงเรียงลำดับ/เพิ่มไฟล์ได้ที่ index.html ที่เดียว
const fs = require('fs'), path = require('path');
const SRC = path.join(__dirname, 'src'), OUT = __dirname;  // GitHub Pages เสิร์ฟจากรากของ repo — build ลงที่นี่โดยตรง
const html = fs.readFileSync(path.join(SRC, 'index.html'), 'utf8');
const pick = (re) => [...html.matchAll(re)].map((m) => m[1]);
const css = pick(/<link rel="stylesheet" href="(?!https?:)([^"]+)">/g);
const js = pick(/<script src="(?!https?:)([^"]+)"><\/script>/g);
const cat = (files) => files.map((f) => {
  const p = path.join(SRC, f);
  if (!fs.existsSync(p)) throw new Error('ไม่พบไฟล์ที่อ้างใน index.html: ' + f);
  return fs.readFileSync(p, 'utf8') + '\n';
}).join('');
// ลบเฉพาะไฟล์ผลลัพธ์ของ build เท่านั้น (ห้ามลบทั้งโฟลเดอร์ เพราะ OUT คือรากของ repo)
for (const f of ['style.css', 'script.js']) fs.rmSync(path.join(OUT, f), { force: true });
fs.rmSync(path.join(OUT, 'static'), { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const CSS = cat(css), JS = cat(js);
fs.writeFileSync(path.join(OUT, 'style.css'), CSS);
fs.writeFileSync(path.join(OUT, 'script.js'), JS);
// เลขเวอร์ชันจากเนื้อหาไฟล์ (?v=...) — มือถือจะโหลดไฟล์ใหม่ทันทีที่อัปเดต ไม่ค้างเวอร์ชันเก่าในแคช
const ver = require('crypto').createHash('sha1').update(CSS + JS).digest('hex').slice(0, 8);
// คัดลอกไฟล์ประกอบ (ไอคอนแอป, manifest) จาก src/static → static/
const ST = path.join(SRC, 'static');
if (fs.existsSync(ST)) { fs.mkdirSync(path.join(OUT, 'static'), { recursive: true }); for (const f of fs.readdirSync(ST)) fs.copyFileSync(path.join(ST, f), path.join(OUT, 'static', f)) }
let out = html
  .replace(/(\s*<link rel="stylesheet" href="(?!https?:)[^"]+">)+/, '\n    <link rel="stylesheet" href="style.css?v=' + ver + '">')
  .replace(/(\s*<script src="(?!https?:)[^"]+"><\/script>)+/, '\n    <script src="script.js?v=' + ver + '"></script>')
  .replace(/<!-- (CSS|JS):[^>]*-->\s*/g, '');
fs.writeFileSync(path.join(OUT, 'index.html'), out);
console.log(`build สำเร็จ: CSS ${css.length} ไฟล์ + JS ${js.length} ไฟล์ -> style.css, script.js, index.html`);
console.log('เวอร์ชัน ' + ver + ' · commit/อัปโหลด index.html, style.css, script.js และโฟลเดอร์ static/ ขึ้น GitHub ได้เลย');
