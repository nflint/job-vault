-- Add source field to projects table
alter table public.projects 
add column if not exists source text check (source in ('linkedin_import', 'manual')) not null default 'manual';

-- Update existing records to have 'manual' as source
update public.projects set source = 'manual' where source is null; 