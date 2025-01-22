-- Insert test user's professional history
do $$
declare
    test_user_id uuid := '00000000-0000-0000-0000-000000000000'; -- Replace with actual test user ID
    history_id uuid;
    experience_id uuid;
    achievement_id uuid;
    education_id uuid;
    project_id uuid;
    skill_id uuid;
begin
    -- Create professional history
    insert into professional_histories (user_id, is_complete)
    values (test_user_id, true)
    returning id into history_id;

    -- Work Experiences
    -- Experience 1: Current job
    insert into work_experiences (
        history_id, source, company, title, location, employment_type,
        start_date, description, technologies
    )
    values (
        history_id,
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
    insert into achievements (experience_id, description, impact_score)
    values (experience_id, 'Led migration of monolithic application to microservices, reducing deployment time by 70%', 0.9)
    returning id into achievement_id;

    insert into achievement_metrics (achievement_id, value, unit, description)
    values 
        (achievement_id, 70, 'percent', 'Deployment time reduction'),
        (achievement_id, 35, 'percent', 'Infrastructure cost reduction');

    -- Experience 2: Previous job
    insert into work_experiences (
        history_id, source, company, title, location, employment_type,
        start_date, end_date, description, technologies
    )
    values (
        history_id,
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
    insert into achievements (experience_id, description, impact_score)
    values (experience_id, 'Implemented real-time analytics dashboard, processing 1M+ events daily', 0.85)
    returning id into achievement_id;

    insert into achievement_metrics (achievement_id, value, unit, description)
    values 
        (achievement_id, 1000000, 'events', 'Daily event processing'),
        (achievement_id, 99.9, 'percent', 'System uptime');

    -- Education
    insert into education (
        history_id, source, institution, degree, field,
        start_date, end_date, gpa, achievements
    )
    values (
        history_id,
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
    insert into projects (
        history_id, experience_id, name, description,
        technologies, url, start_date, end_date
    )
    values (
        history_id,
        experience_id,
        'Real-time Analytics Platform',
        'Designed and implemented a real-time analytics platform processing millions of events daily',
        array['Python', 'Apache Kafka', 'Elasticsearch', 'React', 'D3.js'],
        'https://github.com/example/analytics-platform',
        '2020-01-01',
        '2021-03-31'
    )
    returning id into project_id;

    insert into project_metrics (project_id, key, value)
    values 
        (project_id, 'Daily Active Users', '50,000+'),
        (project_id, 'Data Processing', '5TB/day'),
        (project_id, 'System Uptime', '99.99%');

    -- Project 2: Personal project
    insert into projects (
        history_id, name, description,
        technologies, url, start_date, end_date
    )
    values (
        history_id,
        'Open Source Job Board',
        'Created an open-source job board platform with AI-powered job matching',
        array['Next.js', 'TypeScript', 'Supabase', 'OpenAI'],
        'https://github.com/example/job-board',
        '2022-06-01',
        '2022-12-31'
    )
    returning id into project_id;

    insert into project_metrics (project_id, key, value)
    values 
        (project_id, 'GitHub Stars', '500+'),
        (project_id, 'Monthly Users', '2,000+');

    -- Skills
    -- Technical Skills
    insert into skills (
        history_id, name, category, source,
        proficiency, years_experience, last_used_date, endorsement_count
    )
    values 
        (history_id, 'React', 'Frontend', 'manual', 5, 4, current_date, 15),
        (history_id, 'TypeScript', 'Programming Languages', 'manual', 4, 3, current_date, 12),
        (history_id, 'Node.js', 'Backend', 'manual', 4, 4, current_date, 10),
        (history_id, 'Python', 'Programming Languages', 'manual', 4, 5, current_date, 8),
        (history_id, 'AWS', 'Cloud', 'manual', 4, 3, current_date, 7)
    returning id into skill_id;

    -- Skill Contexts
    insert into skill_contexts (
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
end;
$$; 