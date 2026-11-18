-- แยก LINE 2 ช่อง: line_id = LINE ติดต่อสอบถาม (เดิม), line_bot_id = บอทแจ้งเตือน (Bot basic ID)
alter table public.app_settings add column if not exists line_bot_id text;
update public.app_settings set line_bot_id = '@130kmbel' where line_bot_id is null;
