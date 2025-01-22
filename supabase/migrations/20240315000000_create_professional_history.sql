-- Enable required extensions
create extension if not exists "vector";
create extension if not exists "uuid-ossp";

-- Professional History table
create table public.professional_histories (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users not null,
    is_complete boolean default false,
    linkedin_import_date timestamptz,
    linkedin_profile_id text,
    linkedin_data jsonb,
    content_embedding vector(1536),
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Work Experience table
create table public.work_experiences (
    id uuid primary key default uuid_generate_v4(),
    history_id uuid references public.professional_histories on delete cascade not null,
    source text check (source in ('linkedin_import', 'manual')) not null,
    import_date timestamptz,
    company text not null,
    title text not null,
    location text,
    employment_type text,
    start_date date not null,
    end_date date,
    description text,
    technologies text[],
    content_embedding vector(1536),
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Achievements table
create table public.achievements (
    id uuid primary key default uuid_generate_v4(),
    experience_id uuid references public.work_experiences on delete cascade,
    description text not null,
    impact_score float,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Achievement Metrics table
create table public.achievement_metrics (
    id uuid primary key default uuid_generate_v4(),
    achievement_id uuid references public.achievements on delete cascade not null,
    value numeric not null,
    unit text not null,
    description text,
    created_at timestamptz default now()
);

-- Education table
create table public.education (
    id uuid primary key default uuid_generate_v4(),
    history_id uuid references public.professional_histories on delete cascade not null,
    source text check (source in ('linkedin_import', 'manual')) not null,
    institution text not null,
    degree text not null,
    field text not null,
    start_date date not null,
    end_date date,
    gpa numeric,
    achievements text[],
    content_embedding vector(1536),
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Projects table
create table public.projects (
    id uuid primary key default uuid_generate_v4(),
    history_id uuid references public.professional_histories on delete cascade not null,
    education_id uuid references public.education on delete set null,
    experience_id uuid references public.work_experiences on delete set null,
    name text not null,
    description text,
    technologies text[],
    url text,
    start_date date,
    end_date date,
    content_embedding vector(1536),
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Project Metrics table
create table public.project_metrics (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid references public.projects on delete cascade not null,
    key text not null,
    value text not null,
    created_at timestamptz default now()
);

-- Skills table
create table public.skills (
    id uuid primary key default uuid_generate_v4(),
    history_id uuid references public.professional_histories on delete cascade not null,
    name text not null,
    category text not null,
    source text check (source in ('linkedin_import', 'manual', 'extracted')) not null,
    proficiency integer check (proficiency between 1 and 5),
    years_experience numeric,
    last_used_date date,
    endorsement_count integer default 0,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Skill Contexts table
create table public.skill_contexts (
    id uuid primary key default uuid_generate_v4(),
    skill_id uuid references public.skills on delete cascade not null,
    experience_id uuid references public.work_experiences on delete cascade,
    usage_description text,
    proficiency_at_time integer check (proficiency_at_time between 1 and 5),
    duration_months integer,
    created_at timestamptz default now()
);

-- Update timestamp function
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Update timestamp triggers
create trigger update_professional_histories_timestamp before update
    on public.professional_histories for each row execute function public.update_updated_at_column();
create trigger update_work_experiences_timestamp before update
    on public.work_experiences for each row execute function public.update_updated_at_column();
create trigger update_achievements_timestamp before update
    on public.achievements for each row execute function public.update_updated_at_column();
create trigger update_education_timestamp before update
    on public.education for each row execute function public.update_updated_at_column();
create trigger update_skills_timestamp before update
    on public.skills for each row execute function public.update_updated_at_column();

-- Indexes
create index on public.work_experiences using ivfflat (content_embedding vector_cosine_ops) with (lists = 100);
create index on public.education using ivfflat (content_embedding vector_cosine_ops) with (lists = 100);
create index on public.projects using ivfflat (content_embedding vector_cosine_ops) with (lists = 100);

-- Enable RLS
alter table public.professional_histories enable row level security;
alter table public.work_experiences enable row level security;
alter table public.achievements enable row level security;
alter table public.achievement_metrics enable row level security;
alter table public.education enable row level security;
alter table public.projects enable row level security;
alter table public.project_metrics enable row level security;
alter table public.skills enable row level security;
alter table public.skill_contexts enable row level security;

-- Create security policies
create policy "Users can view their own professional history"
on public.professional_histories for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own professional history"
on public.professional_histories for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own professional history"
on public.professional_histories for update
to authenticated
using (auth.uid() = user_id);

-- Add RLS policies for related tables
create policy "Users can view their work experiences"
on public.work_experiences for select
to authenticated
using (history_id in (
    select id from public.professional_histories
    where user_id = auth.uid()
));

create policy "Users can insert their work experiences"
on public.work_experiences for insert
to authenticated
with check (history_id in (
    select id from public.professional_histories
    where user_id = auth.uid()
));

create policy "Users can update their work experiences"
on public.work_experiences for update
to authenticated
using (history_id in (
    select id from public.professional_histories
    where user_id = auth.uid()
));

create policy "Users can delete their work experiences"
on public.work_experiences for delete
to authenticated
using (history_id in (
    select id from public.professional_histories
    where user_id = auth.uid()
)); 