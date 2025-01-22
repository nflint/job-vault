-- Create certifications table
create table public.certifications (
    id uuid primary key default uuid_generate_v4(),
    history_id uuid references public.professional_histories on delete cascade not null,
    source text check (source in ('linkedin_import', 'manual')) not null default 'manual',
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

-- Add RLS policies
create policy "Users can view their certifications"
on public.certifications for select
to authenticated
using (history_id in (
    select id from public.professional_histories
    where user_id = auth.uid()
));

create policy "Users can insert their certifications"
on public.certifications for insert
to authenticated
with check (history_id in (
    select id from public.professional_histories
    where user_id = auth.uid()
));

create policy "Users can update their certifications"
on public.certifications for update
to authenticated
using (history_id in (
    select id from public.professional_histories
    where user_id = auth.uid()
));

create policy "Users can delete their certifications"
on public.certifications for delete
to authenticated
using (history_id in (
    select id from public.professional_histories
    where user_id = auth.uid()
));

-- Add updated_at trigger
create trigger update_certifications_updated_at
    before update on public.certifications
    for each row
    execute function public.update_updated_at_column(); 