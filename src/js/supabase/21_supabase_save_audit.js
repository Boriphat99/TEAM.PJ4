/* 21_supabase_save_audit.js — Supabase: บันทึกกลับ (insert/update) และ audit log
   (แยกมาจาก script.js บรรทัด 1390-1416; โหลดเรียงตามเลขหน้าชื่อไฟล์ใน index.html) */
// ---------- บันทึกกลับ: เทียบกับสถานะล่าสุดที่โหลดมา แล้ว insert/update/ลบ เฉพาะส่วนที่เปลี่ยน ----------
const sbFlush=()=>{clearTimeout(SBX.t);return SBX.q=SBX.q.then(sbPush).catch(er=>tt('⚠ บันทึกไม่สำเร็จ: '+(er.message||er)))};
function sbSync(){clearTimeout(SBX.t);SBX.t=setTimeout(()=>{SBX.q=SBX.q.then(sbPush).catch(er=>tt('⚠ บันทึกไม่สำเร็จ: '+(er.message||er)))},250)}
async function sbPush(){
 if(!U||!SBX.cl)return;sbPrep();
 const c=SBX.cl,now=sbRows(),old=SBX.snap,ad=U.role=='admin';let mailTrig=false,payChg=false;
 const ok=(t,k)=>ad||(t=='users'?k==SBX.uid:t=='tenants'?k==U._tid:t=='support_tickets'?now[t][k].author_id==SBX.uid:false);
 const sel=(b,t,k)=>{if(t=='invoice_items'){const[a,y]=k.split(':');return b.eq('invoice_id',a).eq('item_type',y)}return b.eq('id',k)};
 const upd=async(t,k,row)=>{const r=await sel(c.from(t).update(row),t,k);if(r.error)throw r.error};
 if(ad)for(const u of D.users)if(u._oldc){const r=await c.from('contracts').update({status:'ended',moved_out_at:new Date().toISOString()}).eq('id',u._oldc);if(r.error)throw r.error;u._oldc=null}
 for(const t of SB_ORD){
  const nr=now[t]||{},or=old[t]||{};let ks=Object.keys(nr);
  if(t=='contracts')ks.sort((a,b)=>(nr[a].status=='ended'?0:1)-(nr[b].status=='ended'?0:1));
  for(const k of ks){if(!ok(t,k))continue;const row=nr[k];
   if(!(k in or)){if(t=='users'||t=='tenants')continue;
    const r=await c.from(t).insert(row);if(r.error){if(r.error.code=='23505')await upd(t,k,row);else throw r.error}
    if(t=='invoices')mailTrig=true;if(t=='payments')payChg=true}
   else if(JSON.stringify(or[k])!==JSON.stringify(row)){await upd(t,k,row);if(t=='payments'){payChg=true;if(row.verify_status=='approved')mailTrig=true}}}
  if(ad)for(const k in or){if(k in nr)continue;
   if(t=='payments'){const v=D.inv.find(x=>x._pid==k);await upd(t,k,{verify_status:'rejected',reject_reason:(v&&v._rjr)||null});payChg=true;if(v){delete v._pid;delete v._rjr}}
   else if(t=='invoice_items'){const[a,y]=k.split(':'),r=await c.from(t).delete().eq('invoice_id',a).eq('item_type',y);if(r.error)throw r.error}
   else if(t=='news'){const r=await c.from(t).delete().eq('id',k);if(r.error)throw r.error}}}
 SBX.snap=sbRows();
 if(payChg&&ad)setTimeout(()=>{if(U)sbRefresh()},1200); // โหลดเลขใบเสร็จที่ฐานข้อมูลออกให้
 if(mailTrig&&ad)c.functions.invoke('resend-email',{body:{sweep:true}}).then(()=>setTimeout(()=>{if(U)sbRefresh()},3000)).catch(()=>{});
}
function sbAudit(a){if(SBX.cl&&SBX.uid&&U)SBX.cl.from('audit_logs').insert({actor_id:SBX.uid,actor_name:U.name,action:a}).then(()=>{})}
