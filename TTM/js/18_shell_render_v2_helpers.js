/* 18_shell_render_v2_helpers.js — โครงหน้า R(), ชุดไอคอน SVG, สลับธีม/เมนู, skeleton
   (แยกมาจาก script.js บรรทัด 1249-1292; โหลดเรียงตามเลขหน้าชื่อไฟล์ใน index.html) */
// ---- shell ----
function R(){const o=document.querySelector('.sb'),l=o?o.scrollLeft:0;if(P=='met')document.querySelectorAll('#app input[id^=m],#app input[id^=x]').forEach(i=>{if(/^(m|x|xn)\d+$/.test(i.id))MV[PER+i.id]=i.value});R0();mbl();if(P=='met')Object.keys(MV).forEach(k=>{if(k.startsWith(PER)){const i=document.getElementById(k.slice(PER.length));if(i&&i.value===''&&MV[k]!==''){i.value=MV[k];const n=+k.slice(PER.length).replace(/^\D+/,'');if(n&&document.getElementById('u'+n))lv(n)}}});const n=document.querySelector('.sb');if(n){n.scrollLeft=l;const t=n.querySelector('.nv.on');if(t){const A=n.getBoundingClientRect(),B=t.getBoundingClientRect();if(B.left<A.left+8)n.scrollLeft-=A.left+8-B.left;else if(B.right>A.right-8)n.scrollLeft+=B.right-(A.right-8)}}}

// ===== V2 (ปรับดีไซน์): ชุดไอคอน SVG เดียวกัน + ตัวช่วยธีม/ภาษา/เมนู/สถานะโหลด — ไม่แตะลอจิกธุรกิจเดิม =====
const SV=(p,c)=>`<svg${c?` class="${c}"`:''} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const IC={
 dash:SV('<rect x="3" y="3" width="7" height="9" rx="1.6"/><rect x="14" y="3" width="7" height="5" rx="1.6"/><rect x="14" y="12" width="7" height="9" rx="1.6"/><rect x="3" y="16" width="7" height="5" rx="1.6"/>'),
 rooms:SV('<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v10h13V10"/><path d="M10 20v-5h4v5"/>'),
 ten:SV('<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><path d="M16 5.2a3.2 3.2 0 0 1 0 5.6M18.2 14.9c1.9.7 3.3 2.3 3.3 5.1"/>'),
 con:SV('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>'),
 met:SV('<path d="M4 18a8 8 0 1 1 16 0"/><path d="m12 18 4-6"/><circle cx="12" cy="18" r="1.2" fill="currentColor"/>'),
 pay:SV('<rect x="2.5" y="5" width="19" height="14" rx="2.6"/><path d="M2.5 10h19M6.5 15h4"/>'),
 rep:SV('<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>'),
 set:SV('<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>'),
 help:SV('<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1.1 1-1.1 1.8M12 17h.01"/>'),
 news:SV('<path d="M4 5h13v14a1 1 0 0 0 1 1H6a2 2 0 0 1-2-2z"/><path d="M17 9h3v9a2 2 0 0 1-2 2M8 9h5M8 13h5M8 17h3"/>'),
 prof:SV('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5"/>'),
 my:SV('<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>'),
 hist:SV('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>'),
 out:SV('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>'),
 mail:SV('<rect x="3" y="5" width="18" height="14" rx="2.4"/><path d="m3.5 7 8.5 6 8.5-6"/>'),
 key:SV('<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M16 7l3 3M14 9l2 2"/>'),
 lock:SV('<rect x="4.5" y="10.5" width="15" height="10" rx="2.4"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>'),
 chev:SV('<path d="m15 18-6-6 6-6"/>'),
 top:SV('<path d="m6 15 6-6 6 6"/>'),
 sun:SV('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>','s'),
 moon:SV('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>','m')
};
const IG={'⌂':IC.rooms,'▥':IC.con,'◔':IC.met,'▤':IC.my,'฿':IC.pay,'☰':IC.rep,'✉':IC.mail,'🔑':IC.key,'🔒':IC.lock};
const T2=s=>LANG=='en'?tl(s):s;
const THB=()=>`<button class="thm" type="button" onclick="toggleTheme()" aria-label="Theme" data-tip="${T2('สลับธีม')}">${IC.sun}${IC.moon}</button>`;
const TGL=c=>`<span class="tgl ${c||''}"><span class="seg"><span class="${LANG=='th'?'on':''}" onclick="setPf('lang','th')">TH</span><span class="${LANG=='en'?'on':''}" onclick="setPf('lang','en')">EN</span></span>${THB()}</span>`;
function applyTheme(v){THEME=v;const r=document.documentElement;r.classList.add('theme-anim');r.dataset.theme=v;try{localStorage.setItem('ttm_theme',v)}catch(x){}syncThemeUI();clearTimeout(applyTheme.t);applyTheme.t=setTimeout(()=>r.classList.remove('theme-anim'),500)}
function toggleTheme(){applyTheme(THEME=='dark'?'light':'dark')}
function syncThemeUI(){const dk=THEME=='dark';document.querySelectorAll('.tsw').forEach(el=>{el.classList.toggle('on',dk);el.setAttribute('onclick',"setPf('theme','"+(dk?'light':'dark')+"')");const b=el.previousElementSibling;if(b&&b.tagName=='B')b.textContent=dk?'โหมดกลางคืน':'โหมดกลางวัน'});document.querySelectorAll('.thm').forEach(b=>b.setAttribute('aria-pressed',dk))}
function toggleSb(){const m=document.documentElement.classList.toggle('sb-mini');try{localStorage.setItem('ttm_sb',m?'1':'0')}catch(x){}}
function snapForm(){const a=document.activeElement,s={y:window.scrollY,f:[],a:a&&a.id?{id:a.id,s:a.selectionStart,e:a.selectionEnd}:null};document.querySelectorAll('#app input,#app textarea,#app select').forEach(el=>{if(el.id&&el.type!='file')s.f.push([el.id,el.type=='checkbox'||el.type=='radio'?el.checked:el.value])});return s}
function restoreForm(s){s.f.forEach(([id,v])=>{const el=document.getElementById(id);if(!el)return;if(el.type=='checkbox'||el.type=='radio'){el.checked=v}else if(el.value!==v)el.value=v});window.scrollTo(0,s.y);if(s.a){const el=document.getElementById(s.a.id);if(el){el.focus({preventScroll:true});try{el.setSelectionRange(s.a.s,s.a.e)}catch(x){}}}}
function skel(){const a=$('#app');if(!a)return;a.innerHTML=`<div class="app"><div class="sb np sk-sb"><i class="sk sk-logo"></i>${'<i class="sk sk-nv"></i>'.repeat(7)}</div><div class="mn"><div class="sk sk-top"></div><div class="sk sk-h"></div><div class="dg3"><div class="cd sk"></div><div class="cd sk"></div><div class="cd sk"></div></div><div class="cd sk" style="height:240px"></div></div></div>`}
function R0(){const a=$('#app');if(!U){if(!['home','login','forgot','recover'].includes(P))P='home';a.innerHTML={home,login,reg,forgot,recover}[P]();if(P=='home')lp();a.onpointermove=e=>{a.style.setProperty('--mx',(e.clientX/innerWidth*2-1).toFixed(3));a.style.setProperty('--my',(e.clientY/innerHeight*2-1).toFixed(3))};return}
 a.onpointermove=null;a.style.removeProperty('--mx');a.style.removeProperty('--my');
 const ad=U.role=='admin',ow=U.role=='owner',nv=ow?[['dash','แดชบอร์ด','▦'],['rooms','ห้องพัก','⌂'],['con','สัญญาเช่า','▥'],['rep','รายงาน','☰'],['help','ช่วยเหลือ','◍'],['news','ข่าวสาร','▣'],['prof','โปรไฟล์','◉']]:ad?NVA:[['my','ใบแจ้งหนี้ของฉัน','▤'],['hist','ประวัติ & ใบเสร็จ','☰'],['con','สัญญาเช่า','▥'],['help','ช่วยเหลือ','◍'],['news','ข่าวสาร','▣'],['prof','โปรไฟล์','◉']];
 if(!nv.some(n=>n[0]==P))P=nv[0][0];
 a.innerHTML=`<div class="app"><div class="sb np"><div class="logo" style="margin-bottom:14px"><img class="lgi" src="${LG}" alt=""><div>T&T MANSION<br><small class="ac">PAYMENT SYSTEM</small></div></div>${nv.map(n=>`<div class="nv ${P==n[0]?'on':''}" onclick="go('${n[0]}')" data-tip="${T2(n[1])}"><i>${IC[n[0]]||n[2]}</i><span>${n[1]}</span></div>`).join('')}<button class="sbt np" type="button" onclick="toggleSb()" data-tip="${T2('ย่อ/ขยายเมนู')}">${IC.chev}<span>ย่อเมนู</span></button></div><div class="mn${ow?' ro':''}"><div class="top np">${ad?`<input placeholder="ค้นหาห้อง ผู้เช่า หรือเลขที่บิล (กด Enter)" value="${e(Q)}" onkeydown="if(event.key=='Enter'){Q=this.value;F='all';go('pay')}">`:'<span style="flex:1"></span>'}<span class="me" onclick="go('prof')" data-tip="${T2('โปรไฟล์ของฉัน')}">${av(U,36)}<b>${e(U.name)}</b></span>${THB()}<span class="seg"><span class="${LANG=='th'?'on':''}" onclick="setPf('lang','th')">TH</span><span class="${LANG=='en'?'on':''}" onclick="setPf('lang','en')">EN</span></span><button class="b b2 sm lo" onclick="out()" data-tip="${T2('ออกจากระบบ')}">${IC.out}<span class="lbl">ออกจากระบบ</span></button></div>${pg[P]()}<p class="mu np" style="text-align:center;font-size:11px;margin:28px 0 0">เวอร์ชันระบบ ${APP_V}</p></div></div>`}
