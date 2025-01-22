-- Create project_connections table first
create table if not exists public.project_connections (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid references public.projects(id) on delete cascade,
    connection_type text not null,  -- 'collaborator', 'mentor', etc.
    name text not null,
    title text,
    company text,
    linkedin_profile_url text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Add RLS policies if needed
alter table public.project_connections enable row level security;

-- Add indexes (only if they don't exist)
do $$
begin
    if not exists (
        select 1
        from pg_indexes
        where indexname = 'project_connections_project_id_idx'
    ) then
        create index project_connections_project_id_idx on public.project_connections(project_id);
    end if;
end $$;

-- Get the first user from auth.users table
do $$
declare
    test_user_id uuid;
    history_id_var uuid;
    experience_id uuid;
    achievement_id uuid;
    education_id uuid;
    project_id uuid;
    skill_id uuid;
begin
    -- Get specific user ID instead of querying auth.users
    test_user_id := '61590bfa-13c4-4cb6-804b-0f8a99c2984a'::uuid;
    
    -- Create professional history
    insert into public.professional_histories (user_id, is_complete)
    values (test_user_id, true)
    returning id into history_id_var;

    -- Work Experiences
    -- Experience 1: Current job
    insert into public.work_experiences (
        history_id, source, company, title, location, employment_type,
        start_date, description, technologies
    )
    values (
        history_id_var,
        'manual',
        'TechCorp Solutions',
        'Senior Software Engineer',
        'San Francisco, CA',
        'Full-time',
        '2021-06-01',
        'Leading development of cloud-native applications and microservices architecture. Mentoring junior developers and driving technical decisions.',
        array['React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'Kubernetes']
    )
    returning id into experience_id;

    -- Achievements for current job
    insert into public.achievements (experience_id, description, impact_score)
    values (experience_id, 'Led migration of monolithic application to microservices, reducing deployment time by 70%', 0.9)
    returning id into achievement_id;

    insert into public.achievement_metrics (achievement_id, value, unit, description)
    values 
        (achievement_id, 70, 'percent', 'Deployment time reduction'),
        (achievement_id, 35, 'percent', 'Infrastructure cost reduction');

    -- Experience 2: Previous job
    insert into public.work_experiences (
        history_id, source, company, title, location, employment_type,
        start_date, end_date, description, technologies
    )
    values (
        history_id_var,
        'manual',
        'DataDrive Inc',
        'Full Stack Developer',
        'Seattle, WA',
        'Full-time',
        '2019-03-01',
        '2021-05-31',
        'Developed and maintained data-intensive web applications. Implemented real-time analytics dashboard.',
        array['Python', 'Django', 'React', 'PostgreSQL', 'Redis']
    )
    returning id into experience_id;

    -- Achievements for previous job
    insert into public.achievements (experience_id, description, impact_score)
    values (experience_id, 'Implemented real-time analytics dashboard, processing 1M+ events daily', 0.85)
    returning id into achievement_id;

    insert into public.achievement_metrics (achievement_id, value, unit, description)
    values 
        (achievement_id, 1000000, 'events', 'Daily event processing'),
        (achievement_id, 99.9, 'percent', 'System uptime');

    -- Education
    insert into public.education (
        history_id, source, institution, degree, field,
        start_date, end_date, gpa, achievements
    )
    values (
        history_id_var,
        'manual',
        'University of Technology',
        'Bachelor of Science',
        'Computer Science',
        '2015-09-01',
        '2019-05-31',
        3.8,
        array['Dean''s List 2017-2019', 'Senior Project Award']
    )
    returning id into education_id;

    -- Projects
    -- Project 1: Work project
    insert into public.projects (
        history_id, experience_id, name, description,
        technologies, url, start_date, end_date
    )
    values (
        history_id_var,
        experience_id,
        'Real-time Analytics Platform',
        'Designed and implemented a real-time analytics platform processing millions of events daily',
        array['Python', 'Apache Kafka', 'Elasticsearch', 'React', 'D3.js'],
        'https://github.com/example/analytics-platform',
        '2020-01-01',
        '2021-03-31'
    )
    returning id into project_id;

    insert into public.project_metrics (project_id, key, value)
    values 
        (project_id, 'Daily Active Users', '50,000+'),
        (project_id, 'Data Processing', '5TB/day'),
        (project_id, 'System Uptime', '99.99%');

    -- Project 2: Personal project
    insert into public.projects (
        history_id, name, description,
        technologies, url, start_date, end_date
    )
    values (
        history_id_var,
        'Open Source Job Board',
        'Created an open-source job board platform with AI-powered job matching',
        array['Next.js', 'TypeScript', 'Supabase', 'OpenAI'],
        'https://github.com/example/job-board',
        '2022-06-01',
        '2022-12-31'
    )
    returning id into project_id;

    insert into public.project_metrics (project_id, key, value)
    values 
        (project_id, 'GitHub Stars', '500+'),
        (project_id, 'Monthly Users', '2,000+');

    -- Project Connections
    insert into public.project_connections (
        project_id,
        connection_type,
        name,
        title,
        company,
        linkedin_profile_url
    )
    values 
        (
            project_id,  -- This references the 'Open Source Job Board' project
            'collaborator',
            'Sarah Chen',
            'Senior Frontend Developer',
            'TechCorp Solutions',
            'https://linkedin.com/in/sarahchen'
        ),
        (
            project_id,
            'mentor',
            'Michael Rodriguez',
            'Technical Lead',
            'TechCorp Solutions',
            'https://linkedin.com/in/mrodriguez'
        );

    -- For the Analytics Platform project (need to store its project_id separately)
    with analytics_project as (
        select id from public.projects 
        where history_id = history_id_var 
        and name = 'Real-time Analytics Platform'
        limit 1
    )
    insert into public.project_connections (
        project_id,
        connection_type,
        name,
        title,
        company,
        linkedin_profile_url
    )
    select 
        analytics_project.id,
        unnest(array['collaborator', 'stakeholder', 'mentor'])::text as connection_type,
        unnest(array[
            'Alex Thompson',
            'Emily Martinez',
            'David Kim'
        ]) as name,
        unnest(array[
            'Data Engineer',
            'Product Manager',
            'Principal Architect'
        ]) as title,
        unnest(array[
            'DataDrive Inc',
            'DataDrive Inc',
            'DataDrive Inc'
        ]) as company,
        unnest(array[
            'https://linkedin.com/in/alexthompson',
            'https://linkedin.com/in/emilymartinez',
            'https://linkedin.com/in/davidkim'
        ]) as linkedin_profile_url
    from analytics_project;

    -- Certifications
    insert into public.certifications (
        history_id, source, name, issuer, issue_date,
        expiration_date, credential_id, credential_url
    )
    values 
        (
            history_id_var,
            'manual',
            'AWS Solutions Architect Associate',
            'Amazon Web Services',
            '2022-01-15',
            '2025-01-15',
            'AWS-SAA-12345',
            'https://aws.amazon.com/verification/12345'
        ),
        (
            history_id_var,
            'manual',
            'Professional Scrum Master I',
            'Scrum.org',
            '2021-06-01',
            null,  -- No expiration
            'PSM-I-1234567',
            'https://www.scrum.org/certificates/12345'
        ),
        (
            history_id_var,
            'manual',
            'MongoDB Developer Certification',
            'MongoDB University',
            '2023-03-01',
            '2026-03-01',
            'MDB-DEV-98765',
            'https://university.mongodb.com/certification/verify/98765'
        );

    -- Skills
    -- Technical Skills
    -- Insert first skill and capture its ID
    insert into public.skills (
        history_id, name, category, source,
        proficiency, years_experience, last_used_date, endorsement_count
    )
    values 
        (history_id_var, 'React', 'Frontend', 'manual', 5, 4, current_date, 15)
    returning id into skill_id;

    -- Insert remaining skills without capturing IDs
    insert into public.skills (
        history_id, name, category, source,
        proficiency, years_experience, last_used_date, endorsement_count
    )
    values 
        (history_id_var, 'TypeScript', 'Programming Languages', 'manual', 4, 3, current_date, 12),
        (history_id_var, 'Node.js', 'Backend', 'manual', 4, 4, current_date, 10),
        (history_id_var, 'Python', 'Programming Languages', 'manual', 4, 5, current_date, 8),
        (history_id_var, 'AWS', 'Cloud', 'manual', 4, 3, current_date, 7);

    -- Skill Contexts
    insert into public.skill_contexts (
        skill_id, experience_id, usage_description,
        proficiency_at_time, duration_months
    )
    values (
        skill_id,
        experience_id,
        'Used React with TypeScript to build complex data visualization dashboards',
        4,
        24
    );

    raise notice 'Successfully created test data for user %', test_user_id;
end;
$$; 