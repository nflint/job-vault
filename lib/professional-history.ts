import { supabase } from './supabase'
import type { 
  ProfessionalHistory,
  WorkExperience,
  Education,
  Project,
  Skill,
  Achievement,
  AchievementMetric,
  SkillContext,
  Certification
} from '@/types'
import { supabase as defaultSupabase } from './supabase'
import type { SupabaseClient } from '@supabase/supabase-js'

// Professional History
/**
 *
 * @param userId
 */
export async function getProfessionalHistory(userId: string) {
  console.log('Getting professional history for user:', userId)
  const { data, error } = await supabase
    .from('professional_histories')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Error getting professional history:', error)
    if (error.code === 'PGRST116') {
      // No rows returned - this is expected for new users
      throw new Error('No professional history found')
    }
    throw error
  }

  if (!data) {
    console.error('No data returned from professional history query')
    throw new Error('No professional history found')
  }

  console.log('Found professional history:', data)
  return data as ProfessionalHistory
}

/**
 *
 * @param userId
 */
export async function createProfessionalHistory(userId: string) {
  console.log('Creating professional history for user:', userId)
  const { data, error } = await supabase
    .from('professional_histories')
    .insert([{ 
      user_id: userId, 
      is_complete: false,
      last_updated: new Date().toISOString()
    }])
    .select()
    .single()

  if (error) {
    console.error('Error creating professional history:', error)
    throw error
  }

  if (!data) {
    console.error('No data returned from create professional history')
    throw new Error('Failed to create professional history')
  }

  console.log('Created professional history:', data)
  return data as ProfessionalHistory
}

// Work Experience
/**
 *
 * @param historyId
 */
export async function getWorkExperiences(historyId: string) {
  const { data, error } = await supabase
    .from('work_experiences')
    .select(`
      *,
      achievements (
        *,
        achievement_metrics (*)
      )
    `)
    .eq('history_id', historyId)
    .order('start_date', { ascending: false })

  if (error) throw error
  return data as (WorkExperience & { achievements: (Achievement & { achievement_metrics: AchievementMetric[] })[] })[]
}

/**
 *
 * @param experience
 */
export async function createWorkExperience(experience: Omit<WorkExperience, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('work_experiences')
    .insert([experience])
    .select()
    .single()

  if (error) throw error
  return data as WorkExperience
}

/**
 *
 * @param id
 * @param experience
 */
export async function updateWorkExperience(id: string, experience: Partial<WorkExperience>) {
  const { data, error } = await supabase
    .from('work_experiences')
    .update(experience)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as WorkExperience
}

/**
 *
 * @param id
 */
export async function deleteWorkExperience(id: string) {
  const { error } = await supabase
    .from('work_experiences')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Education
/**
 *
 * @param historyId
 */
export async function getEducation(historyId: string): Promise<Education[]> {
  console.log('Fetching education for history:', historyId)
  const { data, error } = await supabase
    .from("education")
    .select("*")
    .eq("history_id", historyId)
    .order("start_date", { ascending: false })

  if (error) {
    console.error("Error fetching education:", error)
    throw error
  }

  console.log('Education data:', data)
  return data || []
}

/**
 *
 * @param education
 */
export async function createEducation(education: Omit<Education, "id" | "created_at">): Promise<Education> {
  const { data, error } = await supabase
    .from("education")
    .insert([education])
    .select()
    .single()

  if (error) {
    console.error("Error creating education:", error)
    throw error
  }

  return data
}

/**
 *
 * @param id
 * @param education
 */
export async function updateEducation(id: string, education: Partial<Education>): Promise<Education> {
  const { data, error } = await supabase
    .from("education")
    .update(education)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating education:", error)
    throw error
  }

  return data
}

/**
 *
 * @param id
 */
export async function deleteEducation(id: string): Promise<void> {
  const { error } = await supabase
    .from("education")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error deleting education:", error)
    throw error
  }
}

// Projects
/**
 *
 * @param historyId
 */
export async function getProjects(historyId: string): Promise<Project[]> {
  console.log('Fetching projects for history:', historyId)
  
  // Log authentication status
  const { data: { user } } = await supabase.auth.getUser()
  console.log('Current user:', user?.id)
  
  // First verify the professional history exists
  const { data: history, error: historyError } = await supabase
    .from('professional_histories')
    .select('*')
    .eq('id', historyId)
    .single()
    
  console.log('Professional history check:', { history, error: historyError })

  const { data, error } = await supabase
    .from("projects")
    .select(`
      *,
      project_metrics (*)
    `)
    .eq("history_id", historyId)
    .order("start_date", { ascending: false })

  if (error) {
    console.error("Error fetching projects:", error)
    throw error
  }

  console.log('Raw projects data:', data)
  
  // Check if data is properly structured
  if (data) {
    data.forEach((project, index) => {
      console.log(`Project ${index + 1}:`, {
        id: project.id,
        name: project.name,
        technologies: project.technologies,
        history_id: project.history_id
      })
    })
  }

  return data || []
}

/**
 *
 * @param project
 * @param client
 */
export async function createProject(
  project: Omit<Project, "id" | "created_at" | "updated_at">,
  client: SupabaseClient = defaultSupabase
): Promise<Project> {
  const { data, error } = await client
    .from("projects")
    .insert([{
      ...project,
      updated_at: new Date().toISOString()
    }])
    .select()
    .single()

  if (error) {
    console.error("Error creating project:", error)
    throw error
  }

  return data
}

/**
 *
 * @param id
 * @param project
 */
export async function updateProject(id: string, project: Partial<Project>): Promise<Project> {
  const { data, error } = await supabase
    .from("projects")
    .update({
      ...project,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating project:", error)
    throw error
  }

  return data
}

/**
 *
 * @param id
 */
export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error deleting project:", error)
    throw error
  }
}

// Skills
/**
 *
 * @param historyId
 */
export async function getSkills(historyId: string) {
  const { data, error } = await supabase
    .from('skills')
    .select(`
      *,
      skill_contexts (*)
    `)
    .eq('history_id', historyId)
    .order('name')

  if (error) throw error
  return data as (Skill & { skill_contexts: SkillContext[] })[]
}

/**
 *
 * @param skill
 */
export async function createSkill(skill: Omit<Skill, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('skills')
    .insert([skill])
    .select()
    .single()

  if (error) throw error
  return data as Skill
}

/**
 *
 * @param id
 * @param skill
 */
export async function updateSkill(id: string, skill: Partial<Skill>) {
  const { data, error } = await supabase
    .from('skills')
    .update(skill)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Skill
}

/**
 *
 * @param id
 */
export async function deleteSkill(id: string) {
  const { error } = await supabase
    .from('skills')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Achievements
/**
 *
 * @param achievement
 */
export async function createAchievement(achievement: Omit<Achievement, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('achievements')
    .insert([achievement])
    .select()
    .single()

  if (error) throw error
  return data as Achievement
}

/**
 *
 * @param id
 * @param achievement
 */
export async function updateAchievement(id: string, achievement: Partial<Achievement>) {
  const { data, error } = await supabase
    .from('achievements')
    .update(achievement)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Achievement
}

/**
 *
 * @param id
 */
export async function deleteAchievement(id: string) {
  const { error } = await supabase
    .from('achievements')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Achievement Metrics
/**
 *
 * @param metric
 */
export async function createAchievementMetric(metric: Omit<AchievementMetric, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('achievement_metrics')
    .insert([metric])
    .select()
    .single()

  if (error) throw error
  return data as AchievementMetric
}

/**
 *
 * @param id
 */
export async function deleteAchievementMetric(id: string) {
  const { error } = await supabase
    .from('achievement_metrics')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Certifications
/**
 *
 * @param historyId
 */
export async function getCertifications(historyId: string): Promise<Certification[]> {
  console.log('Fetching certifications for history:', historyId)
  
  // Log authentication status
  const { data: { user } } = await supabase.auth.getUser()
  console.log('Current user:', user?.id)
  
  // First verify the professional history exists
  const { data: history, error: historyError } = await supabase
    .from('professional_histories')
    .select('*')
    .eq('id', historyId)
    .single()
    
  console.log('Professional history check:', { history, error: historyError })

  const { data, error } = await supabase
    .from("certifications")
    .select("*")
    .eq("history_id", historyId)
    .order("issue_date", { ascending: false })

  if (error) {
    console.error("Error fetching certifications:", error)
    throw error
  }

  console.log('Raw certifications data:', data)
  
  // Check if data is properly structured
  if (data) {
    data.forEach((cert, index) => {
      console.log(`Certification ${index + 1}:`, {
        id: cert.id,
        name: cert.name,
        issuer: cert.issuer,
        history_id: cert.history_id
      })
    })
  }

  return data || []
}

/**
 *
 * @param certification
 * @param client
 */
export async function createCertification(
  certification: Omit<Certification, "id" | "created_at" | "updated_at">,
  client: SupabaseClient = defaultSupabase
): Promise<Certification> {
  const { data, error } = await client
    .from("certifications")
    .insert([certification])
    .select()
    .single()

  if (error) {
    console.error("Error creating certification:", error)
    throw error
  }

  return data
}

/**
 *
 * @param id
 * @param certification
 * @param client
 */
export async function updateCertification(
  id: string,
  certification: Partial<Certification>,
  client: SupabaseClient = defaultSupabase
): Promise<Certification> {
  const { data, error } = await client
    .from("certifications")
    .update({
      ...certification,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating certification:", error)
    throw error
  }

  return data
}

/**
 *
 * @param id
 * @param client
 */
export async function deleteCertification(
  id: string,
  client: SupabaseClient = defaultSupabase
): Promise<void> {
  const { error } = await client
    .from("certifications")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error deleting certification:", error)
    throw error
  }
} 