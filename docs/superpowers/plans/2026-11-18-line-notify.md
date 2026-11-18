# LINE chatbot notifications Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tenants and admins get LINE messages for bills, reminders (day 3/6/10), receipts, rejected slips and new slips; admins get a "ติดตามหนี้ค้าง" page to send reminders manually.

**Architecture:** Postgres is the sender: AFTER triggers on invoices/payments and a daily pg_cron job call `notify_line(kind, invoice, payment)`, which posts via pg_net to Edge Function `line-notify` (internal secret from Vault). `line-notify` builds Thai text and calls LINE Push API with `LINE_CHANNEL_ACCESS_TOKEN`, logging every attempt to `notify_log`. Account linking: web asks RPC `line_link_code()` for a 6-digit code; the user types it to the OA chat; Edge Function `line-webhook` verifies `X-Line-Signature` with `LINE_CHANNEL_SECRET`, stores `line_links`, and replies.

**Tech Stack:** Supabase Postgres 17 (pg_net, pg_cron, supabase_vault), Supabase Edge Functions (Deno, supabase-js 2.45.4), LINE Messaging API, vanilla JS front end built by `build.js`.

**Spec:** `docs/superpowers/specs/2026-11-16-line-notify-design.md`

## Global Constraints
- Secrets `LINE_CHANNEL_ACCESS_TOKEN`, `LINE_CHANNEL_SECRET` are set by the user in Supabase; never read, print or commit them.
- Automatic kinds send at most once per (invoice, kind, recipient): `bill`, `due_soon`, `overdue`, `last_day`, `receipt`, `reject`, `slip`. `manual` may repeat.
- Reminder days are relative to `invoices.due_date` (Bangkok date): `due_soon` = due−2, `overdue` = due+1, `last_day` = due+5; only `status = 'unpaid'`.
- Cron at `0 2 * * *` UTC (09:00 Asia/Bangkok).
- Approval and receipt are one message (`receipt`), for cash and QR.
- Owner never receives messages; owner sees the debt page read-only.
- Store only LINE userId (no name/picture).
- Missing token → log `ok=false, error='no token'`, never throw into the caller's transaction (triggers must not block billing).

## Review Focus
1. LINE token not configured yet → issuing bills/approving still works; notify_log shows `no token`.
2. Same reminder fired twice (cron rerun) → only one message per (invoice, kind, recipient).
3. Code typed with spaces / expired / wrong code → bot replies with a clear Thai message, nothing linked.
4. One LINE account linked by two web users (or relink) → newest link wins, old row removed (line_user_id unique).
5. Tenant without LINE link → no error in web; debt page shows "ยังไม่เชื่อม LINE" and the per-room button is disabled.

---

### Task 1: Database objects
**Files:** Create `supabase/migrations/20261118_line_notify.sql` (applied via MCP)
**Produces:** tables `line_links(user_id uuid pk → users, line_user_id text unique, linked_at)`, `line_link_codes(code text pk, user_id uuid unique, expires_at)`, `notify_log(id bigserial, invoice_id uuid, payment_id uuid, kind text, to_user uuid, ok bool, error text, sent_at)`; RPC `line_link_code() returns text`, `line_unlink() returns void`, `line_remind(p_invoice uuid) returns void` (admin), `line_remind_overdue() returns int` (admin); internal `notify_line(kind text, invoice uuid, payment uuid)`; triggers `trg_line_invoice` (invoices AFTER INSERT → bill), `trg_line_payment` (payments AFTER INSERT/UPDATE OF verify_status → slip/receipt/reject); function `line_daily()` + cron job `line-daily`.
- [ ] Test in a rolled-back transaction: code is 6 digits, second call replaces the first; `line_unlink` deletes own row; tenant cannot read other users' links; inserting an invoice and approving a payment enqueue 2 rows in `net.http_request_queue`; `line_daily()` picks invoices whose due−2/due+1/due+5 = today.
- [ ] Apply migration; run the tests; commit SQL file.

### Task 2: Edge Function `line-notify`
**Files:** Create `supabase/functions/line-notify/index.ts` (verify_jwt=false)
**Consumes:** body `{kind, invoice_id?, payment_id?}`, header `x-notify-secret` = env `NOTIFY_SECRET`.
- [ ] Wrong/missing secret → 401. Unknown kind → 400. No token → log rows `no token`, return 200.
- [ ] Recipients: tenant of the invoice's contract (via tenants.user_id) for all kinds except `slip` → all admins. Skip recipients without `line_links`; skip if an ok row exists for auto kinds.
- [ ] Message text per kind includes room, month (Thai), amount, due date/fine, receipt no / reject reason, and `system_url`.
- [ ] Deploy; call via `net.http_post` with wrong secret → 401 logged in `net._http_response`.

### Task 3: Edge Function `line-webhook`
**Files:** Create `supabase/functions/line-webhook/index.ts` (verify_jwt=false)
- [ ] Bad signature → 401. `follow` → reply how to link. text `\d{6}` (spaces stripped) → match unexpired code → upsert link, delete code, reply "เชื่อมบัญชีสำเร็จ"; otherwise reply help. `unfollow` → delete link.
- [ ] Deploy; POST without signature via pg_net → 401.

### Task 4: Web — LINE card on profile + debt page
**Files:** Create `src/js/pages/shared/29_line.js`; Modify `src/index.html` (script), `src/js/pages/shared/17_help_news_contacts.js` (NVA adds `['debt','ติดตามหนี้ค้าง','⚑']`), `src/js/shell/18_shell_render_v2_helpers.js` (owner nav adds debt), `src/js/supabase/20_supabase_load_rows.js` (admin/owner load `line_links` user_id + latest `notify_log`), `src/js/i18n/03_i18n_dictionary.js`.
**Produces:** `D.lk` (Set of app user ids linked), `D.nl` (array `{inv, kind, ok, t}`), `pg.debt()`, `lnCode()`, `lnUnlink()`, `lnRemind(invId)`, `lnRemindAll()`.
- [ ] Debt page lists unpaid invoices with `late(i) > 0` sorted by days late desc: room, tenant, month (`mlab`), amount (`tot`), days late, LINE status, last reminder, buttons (admin only).
- [ ] Local demo mode: page works, LINE actions show "ใช้ได้เมื่อเชื่อมฐานข้อมูลจริง".
- [ ] Test script `tools/linepage.py`: page renders for admin/owner, buttons hidden for owner, profile shows LINE card, clickall 0 errors.

### Task 5: Verify, publish, hand-off
- [ ] clickall + scan; build; push via the user's PC (Claude's GitHub link has no access); verify live version.
- [ ] Give the user the webhook URL `https://hpliogcnsxtnrvuyykzd.supabase.co/functions/v1/line-webhook` and the phone test checklist.
