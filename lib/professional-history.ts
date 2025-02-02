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
import { handleClientError } from './error-handling'

// Professional History
export async function getProfessionalHistory(userId: string, client = supabase): Promise<ProfessionalHistory | null> {
  try {
    const { data: history, error } = await client
      .from('professional_histories')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) throw error
    return history
  } catch (error) {
    throw new Error(handleClientError(error, 'HISTORY_GET'))
  }
}

export async function createProfessionalHistory(data: Partial<ProfessionalHistory>, client = supabase): Promise<ProfessionalHistory> {
  try {
    const { data: history, error } = await client
      .from('professional_histories')
      .insert([data])
      .select()
      .single()

    if (error) throw error
    return history
  } catch (error) {
    throw new Error(handleClientError(error, 'HISTORY_CREATE'))
  }
}

// Work Experience
export async function getWorkExperiences(historyId: string, client = supabase): Promise<WorkExperience[]> {
  try {
    const { data: experiences, error } = await client
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
    return experiences || []
  } catch (error) {
    throw new Error(handleClientError(error, 'EXPERIENCE_LIST'))
  }
}

export async function createWorkExperience(data: Partial<WorkExperience>, client = supabase): Promise<WorkExperience> {
  try {
    const { data: experience, error } = await client
      .from('work_experiences')
      .insert([data])
      .select()
      .single()

    if (error) throw error
    return experience
  } catch (error) {
    throw new Error(handleClientError(error, 'EXPERIENCE_CREATE'))
  }
}

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

export async function deleteWorkExperience(id: string) {
  const { error } = await supabase
    .from('work_experiences')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Education
export async function getEducation(historyId: string, client = supabase): Promise<Education[]> {
  try {
    const { data: education, error } = await client
      .from('education')
      .select('*')
      .eq('history_id', historyId)
      .order('start_date', { ascending: false })

    if (error) throw error
    return education || []
  } catch (error) {
    throw new Error(handleClientError(error, 'EDUCATION_LIST'))
  }
}

export async function createEducation(data: Partial<Education>, client = supabase): Promise<Education> {
  try {
    const { data: education, error } = await client
      .from('education')
      .insert([data])
      .select()
      .single()

    if (error) throw error
    return education
  } catch (error) {
    throw new Error(handleClientError(error, 'EDUCATION_CREATE'))
  }
}

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
export async function getProjects(historyId: string, client = supabase): Promise<Project[]> {
  try {
    const { data: projects, error } = await client
      .from('projects')
      .select('*')
      .eq('history_id', historyId)
      .order('start_date', { ascending: false })

    if (error) throw error
    return projects || []
  } catch (error) {
    throw new Error(handleClientError(error, 'PROJECT_LIST'))
  }
}

export async function createProject(data: Partial<Project>, client = supabase): Promise<Project> {
  try {
    const { data: project, error } = await client
      .from('projects')
      .insert([data])
      .select()
      .single()

    if (error) throw error
    return project
  } catch (error) {
    throw new Error(handleClientError(error, 'PROJECT_CREATE'))
  }
}

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
export async function getSkills(historyId: string, client = supabase): Promise<Skill[]> {
  try {
    const { data: skills, error } = await client
      .from('skills')
      .select(`
        *,
        skill_contexts (*)
      `)
      .eq('history_id', historyId)
      .order('name')

    if (error) throw error
    return skills || []
  } catch (error) {
    throw new Error(handleClientError(error, 'SKILL_LIST'))
  }
}

export async function createSkill(data: Partial<Skill>, client = supabase): Promise<Skill> {
  try {
    const { data: skill, error } = await client
      .from('skills')
      .insert([data])
      .select()
      .single()

    if (error) throw error
    return skill
  } catch (error) {
    throw new Error(handleClientError(error, 'SKILL_CREATE'))
  }
}

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

export async function deleteSkill(id: string) {
  const { error } = await supabase
    .from('skills')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Achievements
export async function createAchievement(achievement: Omit<Achievement, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('achievements')
    .insert([achievement])
    .select()
    .single()

  if (error) throw error
  return data as Achievement
}

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

export async function deleteAchievement(id: string) {
  const { error } = await supabase
    .from('achievements')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Achievement Metrics
export async function createAchievementMetric(metric: Omit<AchievementMetric, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('achievement_metrics')
    .insert([metric])
    .select()
    .single()

  if (error) throw error
  return data as AchievementMetric
}

export async function deleteAchievementMetric(id: string) {
  const { error } = await supabase
    .from('achievement_metrics')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Certifications
export async function getCertifications(historyId: string, client = supabase): Promise<Certification[]> {
  try {
    const { data: certifications, error } = await client
      .from('certifications')
      .select('*')
      .eq('history_id', historyId)
      .order('issue_date', { ascending: false })

    if (error) throw error
    return certifications || []
  } catch (error) {
    throw new Error(handleClientError(error, 'CERTIFICATION_LIST'))
  }
}

export async function createCertification(data: Partial<Certification>, client = supabase): Promise<Certification> {
  try {
    const { data: certification, error } = await client
      .from('certifications')
      .insert([data])
      .select()
      .single()

    if (error) throw error
    return certification
  } catch (error) {
    throw new Error(handleClientError(error, 'CERTIFICATION_CREATE'))
  }
}

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