-- Add AI fields to documents
alter table public.documents add column if not exists ai_summary text;
alter table public.documents add column if not exists ai_key_insights text[];

-- Optional index for text search later
create index if not exists documents_ai_summary_gin on public.documents using gin (to_tsvector('english', coalesce(ai_summary,'')));


