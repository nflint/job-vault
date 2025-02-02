# Resume Management System Requirements

## 1. Core Features
### Resume Management
- [ ] Resume creation and editing
- [ ] Resume versioning
- [ ] Star rating system
- [ ] Resume duplication (copy functionality)
- [ ] Resume deletion with confirmation
- [ ] Export to PDF and DOCX formats
- [ ] Loading states and error handling

### Resume Data Structure
```typescript
interface Resume {
  id: string
  user_id: string
  history_id: string  // Reference to professional history
  name: string
  description?: string
  template: string
  font_family: string
  font_size: number
  line_spacing: number
  margin_size: number
  ranking: number
  created_at: string
  updated_at: string
}

interface ResumeSection {
  id: string
  resume_id: string
  type: 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'custom'
  title: string
  content?: string
  order_index: number
  created_at: string
  updated_at: string
}

interface ResumeItem {
  id: string
  section_id: string
  item_type: 'experience' | 'education' | 'skill' | 'project' | 'certification'
  item_id: string
  custom_description?: string
  order_index: number
  created_at: string
  updated_at: string
}

interface ResumeExport {
  id: string
  resume_id: string
  format: 'pdf' | 'docx'
  file_path: string
  version: number
  created_at: string
}
```

## 2. Database Schema

```sql
-- Resume Management Tables
create table resumes (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users not null,
    history_id uuid references professional_histories on delete cascade not null,
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

-- Resume Sections table for organizing content
create table resume_sections (
    id uuid primary key default uuid_generate_v4(),
    resume_id uuid references resumes on delete cascade not null,
    type text not null check (type in ('summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'custom')),
    title text not null,
    content text,
    order_index integer not null,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Resume Items table for mapping professional history items to resume sections
create table resume_items (
    id uuid primary key default uuid_generate_v4(),
    section_id uuid references resume_sections on delete cascade not null,
    item_type text not null check (type in ('experience', 'education', 'skill', 'project', 'certification')),
    item_id uuid not null,
    custom_description text,
    order_index integer not null,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Resume Exports table for tracking generated files
create table resume_exports (
    id uuid primary key default uuid_generate_v4(),
    resume_id uuid references resumes on delete cascade not null,
    format text not null check (format in ('pdf', 'docx')),
    file_path text not null,
    version integer not null,
    created_at timestamptz default now()
);

-- Indexes
create index on resumes (user_id);
create index on resumes (history_id);
create index on resume_sections (resume_id);
create index on resume_items (section_id);
create index on resume_exports (resume_id);

-- Update timestamp triggers
create trigger update_resumes_timestamp before update
    on resumes for each row execute function update_updated_at_column();
create trigger update_resume_sections_timestamp before update
    on resume_sections for each row execute function update_updated_at_column();
create trigger update_resume_items_timestamp before update
    on resume_items for each row execute function update_updated_at_column();
```

## 3. Security & Access Control

### Row Level Security Policies
```sql
-- Resume table policies
create policy "Users can view their own resumes"
on resumes for select
to authenticated
using (user_id = auth.uid());

create policy "Users can create their own resumes"
on resumes for insert
to authenticated
with check (user_id = auth.uid());

create policy "Users can update their own resumes"
on resumes for update
to authenticated
using (user_id = auth.uid());

create policy "Users can delete their own resumes"
on resumes for delete
to authenticated
using (user_id = auth.uid());

-- Similar policies for resume_sections, resume_items, and resume_exports
```

## 4. Integration Points

### Professional History Integration
- Resume content is sourced from professional history data
- Changes to professional history should be reflected in resumes
- Resume items can have custom descriptions that override source content

### Export System Integration
- PDF generation using pdf-lib
- DOCX generation using docx.js
- File storage system (e.g., S3 or similar) for exported files
- Version tracking for exports

## 5. UI Components
### Resume Builder
- [ ] Template selection
- [ ] Section management
- [ ] Content editor with formatting
- [ ] Preview mode
- [ ] Export options

### Resume List
- [ ] Interactive data table with sortable columns
- [ ] Star rating display
- [ ] Version tracking
- [ ] Quick actions (duplicate, delete, export)
- [ ] Loading skeletons
- [ ] Error notifications

## Notes
- Resume system builds on top of professional history data
- All text content should support rich text formatting
- Export system should handle various paper sizes and formats
- Template system should be extensible
- Version control for both content and exports 