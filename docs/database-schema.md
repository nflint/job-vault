# Job Vault Database Schema

## Core Tables

### Professional Histories
Central table linking user's professional data
- `id` (uuid, PK): Unique identifier
- `user_id` (uuid, FK → users.id): Reference to auth user
- `is_complete` (boolean, default: false): Profile completion status
- `linkedin_import_date` (timestamptz): When LinkedIn data was last imported
- `linkedin_profile_id` (text): LinkedIn profile identifier
- `linkedin_data` (jsonb): Raw LinkedIn import data
- `content_embedding` (vector): Vector embedding for semantic search
- Timestamps: `created_at`, `updated_at`

### Work Experiences
Professional experience entries
- `id` (uuid, PK)
- `history_id` (uuid, FK → professional_histories.id)
- `source` (text): 'linkedin_import' or 'manual'
- `company`, `title` (text, required)
- `location`, `employment_type` (text)
- `start_date` (date, required), `end_date` (date)
- `description` (text)
- `technologies` (text[])
- `content_embedding` (vector)
- Timestamps: `created_at`, `updated_at`

### Education
Educational background
- `id` (uuid, PK)
- `history_id` (uuid, FK → professional_histories.id)
- `source` (text): 'linkedin_import' or 'manual'
- `institution`, `degree`, `field` (text, required)
- `start_date` (date, required), `end_date` (date)
- `gpa` (numeric)
- `achievements` (text[])
- `content_embedding` (vector)
- Timestamps: `created_at`, `updated_at`

### Projects
Professional and personal projects
- `id` (uuid, PK)
- `history_id` (uuid, FK → professional_histories.id)
- `education_id` (uuid, FK → education.id)
- `experience_id` (uuid, FK → work_experiences.id)
- `source` (text, default: 'manual')
- `name` (text, required)
- `description` (text)
- `technologies` (text[])
- `url` (text)
- `start_date`, `end_date` (date)
- `content_embedding` (vector)
- Timestamps: `created_at`, `updated_at`

### Skills
Professional skills and competencies
- `id` (uuid, PK)
- `history_id` (uuid, FK → professional_histories.id)
- `name`, `category` (text, required)
- `source` (text): 'linkedin_import', 'manual', or 'extracted'
- `proficiency` (integer, 1-5)
- `years_experience` (numeric)
- `last_used_date` (date)
- `endorsement_count` (integer, default: 0)
- Timestamps: `created_at`, `updated_at`

## Supporting Tables

### Achievements
Work experience achievements
- `id` (uuid, PK)
- `experience_id` (uuid, FK → work_experiences.id)
- `description` (text, required)
- `impact_score` (float)
- Timestamps: `created_at`, `updated_at`

### Achievement Metrics
Quantitative metrics for achievements
- `id` (uuid, PK)
- `achievement_id` (uuid, FK → achievements.id)
- `value` (numeric, required)
- `unit` (text, required)
- `description` (text)
- `created_at` (timestamptz)

### Project Metrics
Quantitative metrics for projects
- `id` (uuid, PK)
- `project_id` (uuid, FK → projects.id)
- `key`, `value` (text, required)
- `created_at` (timestamptz)

### Project Connections
People connected to projects
- `id` (uuid, PK)
- `project_id` (uuid, FK → projects.id)
- `connection_type`, `name` (text, required)
- `title`, `company` (text)
- `linkedin_profile_url` (text)
- Timestamps: `created_at`, `updated_at`

### Skill Contexts
Contextual information about skill usage
- `id` (uuid, PK)
- `skill_id` (uuid, FK → skills.id)
- `experience_id` (uuid, FK → work_experiences.id)
- `usage_description` (text)
- `proficiency_at_time` (integer)
- `duration_months` (integer)
- `created_at` (timestamptz)

### Certifications
Professional certifications
- `id` (uuid, PK)
- `history_id` (uuid, FK → professional_histories.id)
- `source`, `name`, `issuer` (text, required)
- `issue_date` (date, required)
- `expiration_date` (date)
- `credential_id`, `credential_url` (text)
- Timestamps: `created_at`, `updated_at`

### Jobs
Job applications and bookmarks
- `id` (bigint, PK)
- `user_id` (uuid, FK → users.id)
- `position`, `company` (text, required)
- `max_salary`, `location` (text)
- `status` (text, default: 'BOOKMARKED')
- `date_saved`, `deadline`, `date_applied`, `follow_up` (timestamptz)
- `rating` (integer, default: 0)
- Timestamps: `created_at`, `updated_at`

### Profiles
User profile information
- `id` (uuid, PK, FK → users.id)
- `first_name`, `last_name` (text)
- `job_title`, `industry` (text)
- `years_experience` (integer)
- `linkedin_url`, `github_url`, `portfolio_url` (text)
- `phone` (text)
- `preferred_currency` (text, default: 'USD')
- `timezone` (text, default: 'UTC')
- `email_notifications` (boolean, default: true)
- `avatar_url` (text)
- Timestamps: `created_at`, `updated_at` 