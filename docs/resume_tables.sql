-- Supabase schema
create table resumes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users,
  title text not null,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  base_template text,
  is_active boolean default true
);

create table resume_sections (
  id uuid default uuid_generate_v4() primary key,
  resume_id uuid references resumes on delete cascade,
  type text not null,
  title text not null,
  content jsonb,
  "order" int not null,
  created_at timestamptz default now()
);

create table resume_versions (
  id uuid default uuid_generate_v4() primary key,
  resume_id uuid references resumes on delete cascade,
  version_name text not null,
  created_at timestamptz default now(),
  notes text,
  content jsonb,
  is_current boolean default false
);