import { supabase } from './supabase'
import type { 
  ProfessionalHistory,
  WorkExperience,
  Education,
  Project,
  Skill,
  Achievement,
  AchievementMetric,
  SkillContext
} from '@/types'

// Professional History
export async function getProfessionalHistory(userId: string) {
  const { data, error } = await supabase
    .from('professional_histories')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) throw error
  return data as ProfessionalHistory
}

export async function createProfessionalHistory(userId: string) {
  const { data, error } = await supabase
    .from('professional_histories')
    .insert([{ user_id: userId, is_complete: false }])
    .select()
    .single()

  if (error) throw error
  return data as ProfessionalHistory
}

// Work Experience
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

export async function createWorkExperience(experience: Omit<WorkExperience, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('work_experiences')
    .insert([experience])
    .select()
    .single()

  if (error) throw error
  return data as WorkExperience
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
export async function getEducation(historyId: string) {
  const { data, error } = await supabase
    .from('education')
    .select('*')
    .eq('history_id', historyId)
    .order('start_date', { ascending: false })

  if (error) throw error
  return data as Education[]
}

export async function createEducation(education: Omit<Education, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('education')
    .insert([education])
    .select()
    .single()

  if (error) throw error
  return data as Education
}

export async function updateEducation(id: string, education: Partial<Education>) {
  const { data, error } = await supabase
    .from('education')
    .update(education)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Education
}

export async function deleteEducation(id: string) {
  const { error } = await supabase
    .from('education')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Projects
export async function getProjects(historyId: string) {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_metrics (*)
    `)
    .eq('history_id', historyId)
    .order('start_date', { ascending: false })

  if (error) throw error
  return data as Project[]
}

export async function createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('projects')
    .insert([project])
    .select()
    .single()

  if (error) throw error
  return data as Project
}

export async function updateProject(id: string, project: Partial<Project>) {
  const { data, error } = await supabase
    .from('projects')
    .update(project)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Project
}

export async function deleteProject(id: string) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Skills
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

export async function createSkill(skill: Omit<Skill, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('skills')
    .insert([skill])
    .select()
    .single()

  if (error) throw error
  return data as Skill
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