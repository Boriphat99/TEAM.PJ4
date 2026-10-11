// Supabase Edge Function: send-email
// อ่านคิว public.email_queue (สถานะ pending ที่ถึงเวลา send_after) แล้วส่งอีเมลใบแจ้งหนี้/ใบเสร็จผ่าน Resend
//
// ตั้งค่า:   supabase secrets set RESEND_API_KEY=re_xxx MAIL_FROM="T&T Mansion <billing@yourdomain.com>"
// ติดตั้ง:   supabase functions deploy send-email
// เรียกใช้:  เว็บเรียกเองหลังผู้ดูแลออกบิล/อนุมัติชำระ (functions.invoke) หรือตั้ง pg_cron เรียกทุก 5 นาที
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });

const baht = (n: number) =>
  "฿" + Number(n || 0).toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const esc = (s: unknown) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
const monthTh = (ym: string) => {
  const [y, m] = ym.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("th-TH", { month: "long", year: "numeric" });
};
const dateTh = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" }) : "-";

// deno-lint-ignore no-explicit-any
async function build(sb: any, q: any) {
  const { data: inv, error } = await sb
    .from("invoices")
    .select("*, invoice_items(*), contracts(rooms(room_no), tenants(full_name))")
    .eq("id", q.invoice_id)
    .single();
  if (error || !inv) throw new Error("ไม่พบใบแจ้งหนี้");
  const { data: S } = await sb.from("app_settings").select("*").limit(1).single();
  const { data: pay } = await sb
    .from("payments").select("*").eq("invoice_id", inv.id).neq("verify_status", "rejected").maybeSingle();

  const dorm = S?.dorm_name || "T&T Mansion";
  const room = inv.contracts?.rooms?.room_no ?? "-";
  const name = inv.contracts?.tenants?.full_name ?? "";
  const items: { item_type: string; description: string | null; amount: number }[] = inv.invoice_items || [];
  const label: Record<string, string> = { rent: "ค่าเช่าห้อง", electricity: "ค่าไฟฟ้า", other: "ค่าใช้จ่ายเพิ่มเติม", fine: "ค่าปรับล่าช้า" };
  const order = ["rent", "electricity", "other", "fine"];
  const rows = order.flatMap((t) => items.filter((x) => x.item_type === t)).map((x) =>
    `<tr><td style="padding:8px 0;border-bottom:1px solid #eee">${esc(x.item_type === "other" && x.description ? x.description : label[x.item_type])}</td>` +
    `<td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">${baht(x.amount)}</td></tr>`).join("");
  const total = items.reduce((a, x) => a + Number(x.amount), 0);
  const isReceipt = q.kind === "receipt";
  const subject = (isReceipt ? "ใบเสร็จรับเงิน " : "ใบแจ้งหนี้ ") + monthTh(inv.billing_month) + " ห้อง " + room + " - " + dorm;

  const head = isReceipt ? "ใบเสร็จรับเงิน" : "ใบแจ้งหนี้ค่าบริการ";
  const accent = isReceipt ? "#16a34a" : "#dc2626";
  const meta = isReceipt
    ? `เลขที่ใบเสร็จ ${esc(pay?.receipt_no ?? "-")} · ชำระเมื่อ ${dateTh(pay?.paid_at ?? null)} · ช่องทาง ${pay?.payment_method === "cash" ? "เงินสด" : "PromptPay QR"}`
    : `ครบกำหนดชำระ ${dateTh(inv.due_date)} · เลขที่ ${esc(inv.code)}`;
  const foot = isReceipt
    ? "ขอบคุณที่ใช้บริการ"
    : `ชำระผ่าน PromptPay${S?.payee_name ? " (" + esc(S.payee_name) + ")" : ""} แล้วแนบสลิปที่ระบบ${S?.system_url ? ` <a href="${esc(S.system_url)}">${esc(S.system_url)}</a>` : ""}`;

  const html = `<div style="font-family:Tahoma,Arial,sans-serif;max-width:560px;margin:auto;color:#111">
  <div style="background:${accent};color:#fff;padding:18px 22px;border-radius:12px 12px 0 0">
    <div style="font-size:20px;font-weight:700">${esc(dorm)}</div><div>${head}</div></div>
  <div style="border:1px solid #eee;border-top:0;padding:20px 22px;border-radius:0 0 12px 12px">
    <p>เรียน คุณ${esc(name)} (ห้อง ${esc(room)})<br><span style="color:#666">รอบบิล ${monthTh(inv.billing_month)}</span></p>
    <table style="width:100%;border-collapse:collapse">${rows}
      <tr><td style="padding:12px 0;font-weight:700">ยอดสุทธิ</td><td style="padding:12px 0;text-align:right;font-weight:700;font-size:18px;color:${accent}">${baht(total)}</td></tr></table>
    <p style="color:#666;font-size:13px">${meta}</p><p style="font-size:13px">${foot}</p>
    ${S?.phone ? `<p style="color:#888;font-size:12px">ติดต่อ ${esc(S.phone)}</p>` : ""}</div></div>`;
  return { subject, html };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const key = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("MAIL_FROM") || "T&T Mansion <onboarding@resend.dev>";

  const { data: rows, error } = await sb
    .from("email_queue").select("*")
    .in("status", ["pending", "wait"]).lte("send_after", new Date().toISOString())
    .order("created_at").limit(20);
  if (error) return json({ error: error.message }, 500);

  let sent = 0, failed = 0;
  for (const q of rows ?? []) {
    try {
      if (!key) {
        await sb.from("email_queue").update({ status: "wait", error: "ยังไม่ได้ตั้งค่า RESEND_API_KEY" }).eq("id", q.id);
        continue;
      }
      const { subject, html } = await build(sb, q);
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from, to: [q.to_email], subject, html }),
      });
      if (!r.ok) throw new Error((await r.text()).slice(0, 200));
      await sb.from("email_queue").update({ status: "sent", error: null, subject, sent_at: new Date().toISOString(), attempts: q.attempts + 1 }).eq("id", q.id);
      sent++;
    } catch (e) {
      failed++;
      await sb.from("email_queue").update({
        status: q.attempts + 1 >= 3 ? "failed" : "pending", error: String((e as Error).message ?? e).slice(0, 200),
        attempts: q.attempts + 1, send_after: new Date(Date.now() + 5 * 60_000).toISOString(),
      }).eq("id", q.id);
    }
  }
  return json({ processed: (rows ?? []).length, sent, failed });
});
