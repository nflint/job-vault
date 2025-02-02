-- Create Resume Management Tables
create table public.resumes (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users not null,
    history_id uuid references public.professional_histories on delete cascade not null,
    name text not null,
    description text,
    template text not null,
    font_family text default 'Arial',
    font_size numeric default 11,
    line_spacing numeric default 1.15,
    margin_size numeric default 1.0,
    ranking integer default 0,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table public.resume_sections (
    id uuid primary key default uuid_generate_v4(),
    resume_id uuid references public.resumes on delete cascade not null,
    type text not null check (type in ('summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'custom')),
    title text not null,
    content text,
    order_index integer not null,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table public.resume_items (
    id uuid primary key default uuid_generate_v4(),
    section_id uuid references public.resume_sections on delete cascade not null,
    item_type text not null check (item_type in ('experience', 'education', 'skill', 'project', 'certification')),
    item_id uuid not null,
    custom_description text,
    order_index integer not null,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table public.resume_exports (
    id uuid primary key default uuid_generate_v4(),
    resume_id uuid references public.resumes on delete cascade not null,
    format text not null check (format in ('pdf', 'docx')),
    file_path text not null,
    version integer not null,
    created_at timestamptz default now()
);

-- Create indexes
create index idx_resumes_user_id on public.resumes (user_id);
create index idx_resumes_history_id on public.resumes (history_id);
create index idx_resume_sections_resume_id on public.resume_sections (resume_id);
create index idx_resume_items_section_id on public.resume_items (section_id);
create index idx_resume_exports_resume_id on public.resume_exports (resume_id);

-- Create triggers for updating timestamps
create trigger update_resumes_timestamp before update
    on public.resumes for each row execute function public.update_updated_at_column();

create trigger update_resume_sections_timestamp before update
    on public.resume_sections for each row execute function public.update_updated_at_column();

create trigger update_resume_items_timestamp before update
    on public.resume_items for each row execute function public.update_updated_at_column();

-- Enable Row Level Security
alter table public.resumes enable row level security;
alter table public.resume_sections enable row level security;
alter table public.resume_items enable row level security;
alter table public.resume_exports enable row level security;

-- Create RLS policies for resumes
create policy "Users can view their own resumes"
on public.resumes for select
to authenticated
using (user_id = auth.uid());

create policy "Users can create their own resumes"
on public.resumes for insert
to authenticated
with check (user_id = auth.uid());

create policy "Users can update their own resumes"
on public.resumes for update
to authenticated
using (user_id = auth.uid());

create policy "Users can delete their own resumes"
on public.resumes for delete
to authenticated
using (user_id = auth.uid());

-- Create RLS policies for resume sections
create policy "Users can view their resume sections"
on public.resume_sections for select
to authenticated
using (resume_id in (
    select id from public.resumes
    where user_id = auth.uid()
));

create policy "Users can create their resume sections"
on public.resume_sections for insert
to authenticated
with check (resume_id in (
    select id from public.resumes
    where user_id = auth.uid()
));

create policy "Users can update their resume sections"
on public.resume_sections for update
to authenticated
using (resume_id in (
    select id from public.resumes
    where user_id = auth.uid()
));

create policy "Users can delete their resume sections"
on public.resume_sections for delete
to authenticated
using (resume_id in (
    select id from public.resumes
    where user_id = auth.uid()
));

-- Create RLS policies for resume items
create policy "Users can view their resume items"
on public.resume_items for select
to authenticated
using (section_id in (
    select id from public.resume_sections
    where resume_id in (
        select id from public.resumes
        where user_id = auth.uid()
    )
));

create policy "Users can create their resume items"
on public.resume_items for insert
to authenticated
with check (section_id in (
    select id from public.resume_sections
    where resume_id in (
        select id from public.resumes
        where user_id = auth.uid()
    )
));

create policy "Users can update their resume items"
on public.resume_items for update
to authenticated
using (section_id in (
    select id from public.resume_sections
    where resume_id in (
        select id from public.resumes
        where user_id = auth.uid()
    )
));

create policy "Users can delete their resume items"
on public.resume_items for delete
to authenticated
using (section_id in (
    select id from public.resume_sections
    where resume_id in (
        select id from public.resumes
        where user_id = auth.uid()
    )
));

-- Create RLS policies for resume exports
create policy "Users can view their resume exports"
on public.resume_exports for select
to authenticated
using (resume_id in (
    select id from public.resumes
    where user_id = auth.uid()
));

create policy "Users can create their resume exports"
on public.resume_exports for insert
to authenticated
with check (resume_id in (
    select id from public.resumes
    where user_id = auth.uid()
));

create policy "Users can delete their resume exports"
on public.resume_exports for delete
to authenticated
using (resume_id in (
    select id from public.resumes
    where user_id = auth.uid()
)); 