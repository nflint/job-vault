import { supabase } from './supabase'
import type { Job } from '@/types'

export const jobsService = {
  async list() {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Job[]
  },

  async get(id: number) {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Job
  },

  async create(job: Omit<Job, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'date_saved'>) {
    const { data, error } = await supabase
      .from('jobs')
      .insert([{ ...job, date_saved: new Date().toISOString() }])
      .select()
      .single()

    if (error) throw error
    return data as Job
  },

  async update(id: number, updates: Partial<Omit<Job, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) {
    const { data, error } = await supabase
      .from('jobs')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Job
  },

  async delete(id: number) {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
} 