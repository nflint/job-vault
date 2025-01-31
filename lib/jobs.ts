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
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Job[]
  },

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
  },

  async create(job: Omit<Job, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'date_saved'>) {
    try {
      console.log('1. Starting job creation...')
      
      let user;
      try {
        const auth = await supabase.auth.getUser()
        console.log('2. Auth response:', auth)
        user = auth.data.user
      } catch (authError) {
        console.error('2a. Auth error:', authError)
        throw new Error('Authentication failed')
      }

      if (!user) {
        console.error('3. No user found in auth response')
        throw new Error('Not authenticated')
      }
      console.log('4. User authenticated:', user.id)

      const jobData = { 
        ...job, 
        user_id: user.id,
        date_saved: new Date().toISOString() 
      }
      console.log('5. Prepared job data:', jobData)

      let response;
      try {
        response = await supabase
          .from('jobs')
          .insert([jobData])
          .select()
          .single()
        console.log('6. Supabase response:', response)
      } catch (insertError) {
        console.error('6a. Insert error:', insertError)
        throw new Error('Database insert failed')
      }

      if (response.error) {
        console.error('7. Supabase error:', {
          message: response.error.message,
          details: response.error.details,
          hint: response.error.hint,
          code: response.error.code
        })
        throw new Error(`Database error: ${response.error.message}`)
      }

      if (!response.data) {
        console.error('8. No data returned from insert')
        throw new Error('No data returned from insert')
      }

      console.log('9. Job created successfully:', response.data)
      return response.data as Job
    } catch (error) {
      console.error('10. Final error in create job:', error)
      throw error
    }
  },

  async update(id: number, updates: Partial<Omit<Job, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('jobs')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
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
      .eq('user_id', user.id)

    if (error) throw error
  }
} 