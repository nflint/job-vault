```SQL 
-- Enable required extensions
create extension if not exists "vector";
create extension if not exists "uuid-ossp";

-- Professional History table
create table professional_histories (
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
create table work_experiences (
    id uuid primary key default uuid_generate_v4(),
    history_id uuid references professional_histories on delete cascade not null,
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
create table achievements (
    id uuid primary key default uuid_generate_v4(),
    experience_id uuid references work_experiences on delete cascade,
    description text not null,
    impact_score float,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Achievement Metrics table
create table achievement_metrics (
    id uuid primary key default uuid_generate_v4(),
    achievement_id uuid references achievements on delete cascade not null,
    value numeric not null,
    unit text not null,
    description text,
    created_at timestamptz default now()
);

-- Education table
create table education (
    id uuid primary key default uuid_generate_v4(),
    history_id uuid references professional_histories on delete cascade not null,
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
create table projects (
    id uuid primary key default uuid_generate_v4(),
    history_id uuid references professional_histories on delete cascade not null,
    education_id uuid references education on delete set null,
    experience_id uuid references work_experiences on delete set null,
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
create table project_metrics (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid references projects on delete cascade not null,
    key text not null,
    value text not null,
    created_at timestamptz default now()
);

-- Skills table
create table skills (
    id uuid primary key default uuid_generate_v4(),
    history_id uuid references professional_histories on delete cascade not null,
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
create table skill_contexts (
    id uuid primary key default uuid_generate_v4(),
    skill_id uuid references skills on delete cascade not null,
    experience_id uuid references work_experiences on delete cascade,
    usage_description text,
    proficiency_at_time integer check (proficiency_at_time between 1 and 5),
    duration_months integer,
    created_at timestamptz default now()
);

-- Indexes
create index on work_experiences using ivfflat (content_embedding vector_cosine_ops) with (lists = 100);
create index on education using ivfflat (content_embedding vector_cosine_ops) with (lists = 100);
create index on projects using ivfflat (content_embedding vector_cosine_ops) with (lists = 100);

-- Update timestamp function
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Update timestamp triggers
create trigger update_professional_histories_timestamp before update
    on professional_histories for each row execute function update_updated_at_column();
create trigger update_work_experiences_timestamp before update
    on work_experiences for each row execute function update_updated_at_column();
create trigger update_achievements_timestamp before update
    on achievements for each row execute function update_updated_at_column();
create trigger update_education_timestamp before update
    on education for each row execute function update_updated_at_column();
create trigger update_skills_timestamp before update
    on skills for each row execute function update_updated_at_column();-- Enable required extensions
create extension if not exists "vector";
create extension if not exists "uuid-ossp";

-- Professional History table
create table professional_histories (
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
create table work_experiences (
    id uuid primary key default uuid_generate_v4(),
    history_id uuid references professional_histories on delete cascade not null,
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
create table achievements (
    id uuid primary key default uuid_generate_v4(),
    experience_id uuid references work_experiences on delete cascade,
    description text not null,
    impact_score float,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Achievement Metrics table
create table achievement_metrics (
    id uuid primary key default uuid_generate_v4(),
    achievement_id uuid references achievements on delete cascade not null,
    value numeric not null,
    unit text not null,
    description text,
    created_at timestamptz default now()
);

-- Education table
create table education (
    id uuid primary key default uuid_generate_v4(),
    history_id uuid references professional_histories on delete cascade not null,
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
create table projects (
    id uuid primary key default uuid_generate_v4(),
    history_id uuid references professional_histories on delete cascade not null,
    education_id uuid references education on delete set null,
    experience_id uuid references work_experiences on delete set null,
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
create table project_metrics (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid references projects on delete cascade not null,
    key text not null,
    value text not null,
    created_at timestamptz default now()
);

-- Skills table
create table skills (
    id uuid primary key default uuid_generate_v4(),
    history_id uuid references professional_histories on delete cascade not null,
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
create table skill_contexts (
    id uuid primary key default uuid_generate_v4(),
    skill_id uuid references skills on delete cascade not null,
    experience_id uuid references work_experiences on delete cascade,
    usage_description text,
    proficiency_at_time integer check (proficiency_at_time between 1 and 5),
    duration_months integer,
    created_at timestamptz default now()
);

-- Indexes
create index on work_experiences using ivfflat (content_embedding vector_cosine_ops) with (lists = 100);
create index on education using ivfflat (content_embedding vector_cosine_ops) with (lists = 100);
create index on projects using ivfflat (content_embedding vector_cosine_ops) with (lists = 100);

-- Update timestamp function
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Update timestamp triggers
create trigger update_professional_histories_timestamp before update
    on professional_histories for each row execute function update_updated_at_column();
create trigger update_work_experiences_timestamp before update
    on work_experiences for each row execute function update_updated_at_column();
create trigger update_achievements_timestamp before update
    on achievements for each row execute function update_updated_at_column();
create trigger update_education_timestamp before update
    on education for each row execute function update_updated_at_column();
create trigger update_skills_timestamp before update
    on skills for each row execute function update_updated_at_column();
```

Here is the logic required for the edge function. 

```ts
// supabase/functions/linkedin-import/index.ts

import { serve } from 'https://deno.fresh.dev/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

interface LinkedInProfile {
  positions: Array<{
    companyName: string
    title: string
    startDate: { month: number; year: number }
    endDate?: { month: number; year: number }
    description?: string
    location?: string
  }>
  education: Array<{
    schoolName: string
    degreeName: string
    fieldOfStudy: string
    startDate: { year: number }
    endDate?: { year: number }
  }>
  skills: Array<{
    name: string
    endorsements?: number
  }>
}

serve(async (req) => {
  try {
    const { linkedinData, userId } = await req.json()
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Start a transaction
    const { data: history, error: historyError } = await supabase
      .from('professional_histories')
      .upsert({
        user_id: userId,
        linkedin_import_date: new Date().toISOString(),
        linkedin_data: linkedinData,
        is_complete: true
      })
      .select('id')
      .single()

    if (historyError) throw historyError

    // Import work experiences
    const workExperiences = linkedinData.positions.map((position) => ({
      history_id: history.id,
      source: 'linkedin_import',
      import_date: new Date().toISOString(),
      company: position.companyName,
      title: position.title,
      location: position.location,
      start_date: new Date(position.startDate.year, position.startDate.month - 1).toISOString(),
      end_date: position.endDate 
        ? new Date(position.endDate.year, position.endDate.month - 1).toISOString()
        : null,
      description: position.description || ''
    }))

    const { error: experienceError } = await supabase
      .from('work_experiences')
      .upsert(workExperiences)

    if (experienceError) throw experienceError

    // Import education
    const education = linkedinData.education.map((edu) => ({
      history_id: history.id,
      source: 'linkedin_import',
      institution: edu.schoolName,
      degree: edu.degreeName,
      field: edu.fieldOfStudy,
      start_date: new Date(edu.startDate.year, 0).toISOString(),
      end_date: edu.endDate ? new Date(edu.endDate.year, 0).toISOString() : null
    }))

    const { error: educationError } = await supabase
      .from('education')
      .upsert(education)

    if (educationError) throw educationError

    // Import skills
    const skills = linkedinData.skills.map((skill) => ({
      history_id: history.id,
      name: skill.name,
      source: 'linkedin_import',
      category: 'uncategorized', // Could be enhanced with AI categorization
      endorsement_count: skill.endorsements || 0
    }))

    const { error: skillsError } = await supabase
      .from('skills')
      .upsert(skills)

    if (skillsError) throw skillsError

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'LinkedIn data imported successfully'
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})
```