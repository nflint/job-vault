import { supabase } from './supabase'
import { handleClientError, ErrorCodes } from './error-handling'
import type { Job, JobStatus } from '@/types'

class JobsService {
  async list(): Promise<Job[]> {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        const errorResult = handleClientError(error, ErrorCodes.JOB_LIST)
        throw Object.assign(new Error(errorResult.message), { errorResult })
      }

      return data || []
    } catch (error) {
      if (error instanceof Error && 'errorResult' in error) {
        throw error // Re-throw already handled errors
      }
      const errorResult = handleClientError(error, ErrorCodes.JOB_LIST)
      throw Object.assign(new Error(errorResult.message), { errorResult })
    }
  }

  async get(id: number) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) throw error
    return data as Job
  }

  async create(job: Omit<Job, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'date_saved'>) {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) {
        const errorResult = handleClientError(userError, ErrorCodes.JOB_CREATE)
        throw Object.assign(new Error(errorResult.message), { errorResult })
      }
      if (!user) {
        const errorResult = handleClientError(new Error('Unauthorized'), ErrorCodes.JOB_CREATE)
        throw Object.assign(new Error(errorResult.message), { errorResult })
      }

      const { data, error } = await supabase
        .from('jobs')
        .insert([{
          ...job,
          user_id: user.id,
          date_saved: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) {
        const errorResult = handleClientError(error, ErrorCodes.JOB_CREATE)
        throw Object.assign(new Error(errorResult.message), { errorResult })
      }

      if (!data) {
        const errorResult = handleClientError(new Error('No data returned from insert'), ErrorCodes.JOB_CREATE)
        throw Object.assign(new Error(errorResult.message), { errorResult })
      }

      return data
    } catch (error) {
      if (error instanceof Error && 'errorResult' in error) {
        throw error // Re-throw already handled errors
      }
      const errorResult = handleClientError(error, ErrorCodes.JOB_CREATE)
      throw Object.assign(new Error(errorResult.message), { errorResult })
    }
  }

  async update(id: string, updates: Partial<Omit<Job, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        const errorResult = handleClientError(error, ErrorCodes.JOB_UPDATE)
        throw Object.assign(new Error(errorResult.message), { errorResult })
      }

      if (!data) {
        const errorResult = handleClientError(new Error('Job not found'), ErrorCodes.JOB_UPDATE)
        throw Object.assign(new Error(errorResult.message), { errorResult })
      }

      return data
    } catch (error) {
      if (error instanceof Error && 'errorResult' in error) {
        throw error // Re-throw already handled errors
      }
      const errorResult = handleClientError(error, ErrorCodes.JOB_UPDATE)
      throw Object.assign(new Error(errorResult.message), { errorResult })
    }
  }

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id)

      if (error) {
        const errorResult = handleClientError(error, ErrorCodes.JOB_DELETE)
        throw Object.assign(new Error(errorResult.message), { errorResult })
      }
    } catch (error) {
      if (error instanceof Error && 'errorResult' in error) {
        throw error // Re-throw already handled errors
      }
      const errorResult = handleClientError(error, ErrorCodes.JOB_DELETE)
      throw Object.assign(new Error(errorResult.message), { errorResult })
    }
  }
}

export const jobsService = new JobsService() 