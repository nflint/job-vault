-- Create certifications table first
create table if not exists public.certifications (
    id uuid primary key default uuid_generate_v4(),
    history_id uuid references public.professional_histories on delete cascade not null,
    source text check (source in ('linkedin_import', 'manual')) not null,
    name text not null,
    issuer text not null,
    issue_date date not null,
    expiration_date date,
    credential_id text,
    credential_url text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Enable RLS
alter table public.certifications enable row level security;

-- Now the cleanup script
do $$
begin
    -- Delete all records for the test user
    delete from public.project_connections;
    delete from public.project_metrics;
    delete from public.projects;
    delete from public.skill_contexts;
    delete from public.skills;
    delete from public.achievement_metrics;
    delete from public.achievements;
    delete from public.work_experiences;
    delete from public.education;
    delete from public.certifications;
    delete from public.professional_histories where user_id = '61590bfa-13c4-4cb6-804b-0f8a99c2984a';

    raise notice 'Successfully deleted all test data';
end;
$$; 