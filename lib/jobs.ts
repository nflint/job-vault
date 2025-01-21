import { supabase } from './supabase'
import type { Job } from '@/types'

export const jobsService = {
  async list() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('user_id', user.id)
      .order('date_saved', { ascending: false })

    if (error) throw error
    return data as Job[]
  },

  async create(job: Omit<Job, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'date_saved'>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('jobs')
      .insert([{ ...job, user_id: user.id }])
      .select()
      .single()

    if (error) throw error
    return data as Job
  },

  async update(id: number, updates: Partial<Omit<Job, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('jobs')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id) // Ensure users can only update their own jobs
      .select()
      .single()

    if (error) throw error
    return data as Job
  },

  async delete(id: number) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id) // Ensure users can only delete their own jobs

    if (error) throw error
  }
} 