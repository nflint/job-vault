export interface Job {
  id: number
  user_id: string
  position: string
  company: string
  max_salary: string | null
  location: string | null
  status: JobStatus
  date_saved: string
  deadline: string | null
  date_applied: string | null
  follow_up: string | null
  excitement: number
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