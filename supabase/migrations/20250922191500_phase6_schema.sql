-- Phase 6: Backend API Development and Database Integration
-- Schema for documents, categories, processing, comments, annotations, compliance, settings, audit
-- Idempotent guards

create extension if not exists "uuid-ossp";

-- Departments enum for consistency (optional)
do $$ begin
  create type department_enum as enum ('Operations','Engineering','Finance','HR','Legal','Executive');
exception when duplicate_object then null; end $$;

-- Documents table
create table if not exists public.documents (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  source text, -- email, sharepoint, url, upload
  file_path text, -- storage path for the document
  file_type text, -- pdf, image, docx, xlsx
  language text, -- en, ml, mixed
  department text not null,
  category text, -- AI classified category
  tags text[] default '{}',
  priority text, -- Low/Medium/High/Urgent
  status text default 'new', -- new, processing, ready, archived
  created_by uuid references auth.users(id) on delete set null,
  assigned_to uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists documents_department_idx on public.documents (department);
create index if not exists documents_status_idx on public.documents (status);
create index if not exists documents_created_at_idx on public.documents (created_at desc);

-- Document categories (taxonomy)
create table if not exists public.document_categories (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  description text,
  created_at timestamptz not null default now()
);

-- Processing status timeline
create table if not exists public.document_processing_status (
  id uuid primary key default uuid_generate_v4(),
  document_id uuid not null references public.documents(id) on delete cascade,
  stage text not null, -- uploaded, ocr, ai_categorized, summarized, routed, failed
  status text not null, -- pending, in_progress, completed, error
  message text,
  created_at timestamptz not null default now()
);
create index if not exists dps_document_id_created_idx on public.document_processing_status (document_id, created_at desc);

-- Comments
create table if not exists public.comments (
  id uuid primary key default uuid_generate_v4(),
  document_id uuid not null references public.documents(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists comments_document_id_idx on public.comments (document_id, created_at desc);

-- Annotations
create table if not exists public.annotations (
  id uuid primary key default uuid_generate_v4(),
  document_id uuid not null references public.documents(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  page int,
  rect jsonb, -- {x,y,width,height}
  content text,
  created_at timestamptz not null default now()
);
create index if not exists annotations_document_id_idx on public.annotations (document_id);

-- Compliance tracking
create table if not exists public.compliance_tracking (
  id uuid primary key default uuid_generate_v4(),
  document_id uuid references public.documents(id) on delete set null,
  department text not null,
  title text not null,
  description text,
  due_date date not null,
  status text not null default 'pending', -- pending, in_progress, done, overdue
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists compliance_department_due_idx on public.compliance_tracking (department, due_date);

-- Department settings
create table if not exists public.department_settings (
  id uuid primary key default uuid_generate_v4(),
  department text unique not null,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Audit logs
create table if not exists public.audit_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity text not null,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);
create index if not exists audit_logs_created_at_idx on public.audit_logs (created_at desc);

-- Row Level Security
alter table public.documents enable row level security;
alter table public.document_processing_status enable row level security;
alter table public.comments enable row level security;
alter table public.annotations enable row level security;
alter table public.compliance_tracking enable row level security;
alter table public.department_settings enable row level security;
alter table public.audit_logs enable row level security;

-- Profiles table is assumed existing with department, role
-- Policies: Users can read documents in their department or created_by/assigned_to

create policy if not exists documents_select_policy on public.documents
for select using (
  exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid()
      and (
        p.department = documents.department or
        documents.created_by = auth.uid() or
        documents.assigned_to = auth.uid()
      )
  )
);

create policy if not exists documents_insert_policy on public.documents
for insert with check (
  exists (select 1 from public.profiles p where p.user_id = auth.uid())
);

create policy if not exists documents_update_policy on public.documents
for update using (
  exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid() and (
      p.role in ('Admin','Executive Director') or
      documents.created_by = auth.uid() or
      documents.assigned_to = auth.uid()
    )
  )
) with check (
  true
);

-- Comments/Annotations: visible if can see parent document
create policy if not exists comments_select_policy on public.comments
for select using (
  exists (select 1 from public.documents d where d.id = comments.document_id)
);
create policy if not exists comments_insert_policy on public.comments
for insert with check (auth.uid() is not null);

create policy if not exists annotations_select_policy on public.annotations
for select using (
  exists (select 1 from public.documents d where d.id = annotations.document_id)
);
create policy if not exists annotations_insert_policy on public.annotations
for insert with check (auth.uid() is not null);

-- Compliance: department-based
create policy if not exists compliance_select_policy on public.compliance_tracking
for select using (
  exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid() and p.department = compliance_tracking.department
  )
);
create policy if not exists compliance_write_policy on public.compliance_tracking
for all using (
  exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid() and (
      p.role in ('Admin','Executive Director','Finance Manager','Engineer','HR Officer','Legal Officer')
    )
  )
) with check (true);

-- Department settings readable by department; writable by Admin
create policy if not exists dept_settings_select on public.department_settings
for select using (
  exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid() and p.department = department_settings.department
  )
);
create policy if not exists dept_settings_admin on public.department_settings
for all using (
  exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid() and p.role = 'Admin'
  )
) with check (true);

-- Audit logs readable by Admin only
create policy if not exists audit_select_admin on public.audit_logs
for select using (
  exists (
    select 1 from public.profiles p where p.user_id = auth.uid() and p.role = 'Admin'
  )
);

-- Storage bucket for documents
insert into storage.buckets (id, name, public) values ('documents','documents', false)
on conflict (id) do nothing;

-- Storage policies for bucket 'documents'
create policy if not exists storage_documents_read on storage.objects
for select to authenticated using (
  bucket_id = 'documents' and (
    exists (
      select 1 from public.documents d
      where d.file_path = storage.objects.name and (
        exists (
          select 1 from public.profiles p
          where p.user_id = auth.uid() and (p.department = d.department or d.created_by = auth.uid() or d.assigned_to = auth.uid())
        )
      )
    )
  )
);

create policy if not exists storage_documents_write on storage.objects
for insert to authenticated with check (
  bucket_id = 'documents'
);

create policy if not exists storage_documents_delete on storage.objects
for delete to authenticated using (
  bucket_id = 'documents'
);

-- Realtime
-- (In Supabase dashboard, enable Realtime for tables: documents, comments, document_processing_status, compliance_tracking)


