import { supabase } from './supabase'
import type { Resume, ResumeSection, ResumeItem, ResumeExport } from '@/types'

class ResumeService {
  async list(): Promise<Resume[]> {
    const { data, error } = await supabase
      .from('resumes')
      .select('id, name, description, template, font_family, font_size, line_spacing, margin_size, ranking, user_id, created_at, updated_at')
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error listing resumes:', error)
      throw error
    }
    return data
  }

  async get(id: string): Promise<Resume & { sections: ResumeSection[] }> {
    // Get resume
    const { data: resume, error: resumeError } = await supabase
      .from('resumes')
      .select('id, name, description, template, font_family, font_size, line_spacing, margin_size, ranking, user_id, created_at, updated_at')
      .eq('id', id)
      .single()

    if (resumeError) {
      console.error('Error getting resume:', resumeError)
      throw resumeError
    }

    // Get sections
    const { data: sections, error: sectionsError } = await supabase
      .from('resume_sections')
      .select('*')
      .eq('resume_id', id)
      .order('order_index')

    if (sectionsError) {
      console.error('Error getting resume sections:', sectionsError)
      throw sectionsError
    }

    return {
      ...resume,
      sections: sections || []
    }
  }

  async create(resume: Omit<Resume, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Resume> {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) {
      console.error('Error getting user:', userError)
      throw userError
    }
    if (!user) {
      throw new Error('User not authenticated')
    }

    // Log the exact data being sent
    const resumeData = {
      ...resume,
      user_id: user.id
    }
    console.log('Sending resume data to Supabase:', resumeData)
    console.log('Data types:', {
      font_size: typeof resumeData.font_size,
      line_spacing: typeof resumeData.line_spacing,
      margin_size: typeof resumeData.margin_size,
      ranking: typeof resumeData.ranking
    })

    // Create resume
    const { data, error } = await supabase
      .from('resumes')
      .insert([resumeData])
      .select('id, name, description, template, font_family, font_size, line_spacing, margin_size, ranking, user_id, created_at, updated_at')
      .maybeSingle()

    if (error) {
      console.error('Error creating resume:', error)
      throw error
    }
    if (!data) {
      throw new Error('No resume data returned after creation')
    }
    return data
  }

  async update(id: string, updates: Partial<Omit<Resume, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<Resume> {
    const { data, error } = await supabase
      .from('resumes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('resumes')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Section methods
  async createSection(section: Omit<ResumeSection, 'id' | 'created_at' | 'updated_at'>): Promise<ResumeSection> {
    const { data, error } = await supabase
      .from('resume_sections')
      .insert([section])
      .select()
      .maybeSingle()

    if (error) {
      console.error('Error creating section:', error)
      throw error
    }
    if (!data) {
      throw new Error('No section data returned after creation')
    }
    return data
  }

  async updateSection(id: string, updates: Partial<Omit<ResumeSection, 'id' | 'resume_id' | 'created_at' | 'updated_at'>>): Promise<ResumeSection> {
    const { data, error } = await supabase
      .from('resume_sections')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteSection(id: string): Promise<void> {
    const { error } = await supabase
      .from('resume_sections')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Item methods
  async createItem(item: Omit<ResumeItem, 'id' | 'created_at' | 'updated_at'>): Promise<ResumeItem> {
    const { data, error } = await supabase
      .from('resume_items')
      .insert([item])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateItem(id: string, updates: Partial<Omit<ResumeItem, 'id' | 'section_id' | 'created_at' | 'updated_at'>>): Promise<ResumeItem> {
    const { data, error } = await supabase
      .from('resume_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('resume_items')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Export methods
  async createExport(resumeExport: Omit<ResumeExport, 'id' | 'created_at'>): Promise<ResumeExport> {
    const { data, error } = await supabase
      .from('resume_exports')
      .insert([resumeExport])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getExports(resumeId: string): Promise<ResumeExport[]> {
    const { data, error } = await supabase
      .from('resume_exports')
      .select('*')
      .eq('resume_id', resumeId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }
}

export const resumeService = new ResumeService() 