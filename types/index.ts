export interface Job {
  id: number
  user_id: string
  position: string
  company: string
  max_salary?: string
  location?: string
  status: JobStatus
  rating: number
  date_saved: string
  deadline: string | null
  date_applied: string | null
  follow_up: string | null
  description?: string
  created_at: string
  updated_at: string
}

export type JobStatus = 
  | "BOOKMARKED"
  | "APPLYING"
  | "APPLIED"
  | "INTERVIEWING"
  | "NEGOTIATING"
  | "ACCEPTED"

export interface ProfessionalHistory {
  id: string
  user_id: string
  is_complete: boolean
  linkedin_import_date?: string
  linkedin_profile_id?: string
  linkedin_data?: any
  content_embedding?: number[]
  created_at: string
  updated_at: string
}

export interface WorkExperience {
  id: string
  history_id: string
  source: 'linkedin_import' | 'manual'
  import_date?: string
  company: string
  title: string
  location?: string
  employment_type?: string
  start_date: string
  end_date?: string
  description: string
  technologies: string[]
  content_embedding?: number[]
  created_at: string
  updated_at: string
}

export interface Achievement {
  id: string
  experience_id: string
  description: string
  impact_score?: number
  created_at: string
  updated_at: string
}

export interface AchievementMetric {
  id: string
  achievement_id: string
  value: number
  unit: string
  description?: string
  created_at: string
}

export interface Education {
  id: string
  history_id: string
  source: 'linkedin_import' | 'manual'
  institution: string
  degree: string
  field: string
  start_date: string
  end_date?: string
  gpa?: number
  achievements: string[]
  content_embedding?: number[]
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  history_id: string
  education_id?: string
  experience_id?: string
  source: 'linkedin_import' | 'manual'
  name: string
  description?: string
  technologies: string[]
  url?: string
  start_date?: string
  end_date?: string
  content_embedding?: number[]
  created_at: string
  updated_at: string
}

export interface ProjectMetric {
  id: string
  project_id: string
  key: string
  value: string
  created_at: string
}

export interface Skill {
  id: string
  history_id: string
  name: string
  category: string
  source: 'linkedin_import' | 'manual' | 'extracted'
  proficiency?: number
  years_experience?: number
  last_used_date?: string
  endorsement_count: number
  created_at: string
  updated_at: string
}

export interface SkillContext {
  id: string
  skill_id: string
  experience_id: string
  usage_description: string
  proficiency_at_time: number
  duration_months: number
  created_at: string
}

export interface ImpactMetric {
  category: 'revenue' | 'efficiency' | 'scale' | 'quality' | 'other'
  value: number
  unit: string
  description: string
  confidence_score: number
}

export interface Certification {
  id: string
  history_id: string
  source: 'linkedin_import' | 'manual'
  name: string
  issuer: string
  issue_date: string
  expiration_date?: string | null
  credential_id?: string | null
  credential_url?: string | null
  created_at: string
  updated_at: string
}

// Resume Management Types
export interface Resume {
  id: string
  user_id: string
  history_id: string
  name: string
  description?: string
  template: string
  font_family: string
  font_size: string
  line_spacing: string
  margin_size: string
  ranking: number
  created_at: string
  updated_at: string
}

export type ResumeSectionType = 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'custom'

export interface ResumeSection {
  id: string
  resume_id: string
  type: ResumeSectionType
  title: string
  content?: string
  order_index: number
  created_at: string
  updated_at: string
}

export type ResumeItemType = 'experience' | 'education' | 'skill' | 'project' | 'certification'

export interface ResumeItem {
  id: string
  section_id: string
  item_type: ResumeItemType
  item_id: string
  custom_description?: string
  order_index: number
  created_at: string
  updated_at: string
}

export interface ResumeExport {
  id: string
  resume_id: string
  format: 'pdf' | 'docx'
  file_path: string
  version: number
  created_at: string
} 