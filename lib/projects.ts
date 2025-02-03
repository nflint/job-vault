import { supabase } from '@/lib/supabase'
import type { Project } from '@/types'
import { handleClientError } from '@/lib/error-handling'

class ProjectsService {
  async list(): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      return data || []
    } catch (error) {
      const errorResult = handleClientError(error)
      const enhancedError = new Error(errorResult.message) as Error & { errorResult: typeof errorResult }
      enhancedError.errorResult = errorResult
      throw enhancedError
    }
  }

  async create(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([project])
        .select()
        .single()

      if (error) throw error
      if (!data) throw new Error('Failed to create project')

      return data
    } catch (error) {
      const errorResult = handleClientError(error)
      const enhancedError = new Error(errorResult.message) as Error & { errorResult: typeof errorResult }
      enhancedError.errorResult = errorResult
      throw enhancedError
    }
  }

  async update(id: string, project: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>): Promise<Project> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(project)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      if (!data) throw new Error('Project not found')

      return data
    } catch (error) {
      const errorResult = handleClientError(error)
      const enhancedError = new Error(errorResult.message) as Error & { errorResult: typeof errorResult }
      enhancedError.errorResult = errorResult
      throw enhancedError
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      const errorResult = handleClientError(error)
      const enhancedError = new Error(errorResult.message) as Error & { errorResult: typeof errorResult }
      enhancedError.errorResult = errorResult
      throw enhancedError
    }
  }
}

export const projectsService = new ProjectsService()