import { supabase } from './supabase'
import type { Resume, ResumeSection, ResumeItem, ResumeExport } from '@/types'

class ResumeService {
  async list(): Promise<Resume[]> {
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .order('updated_at', { ascending: false })

    if (error) throw error
    return data
  }

  async get(id: string): Promise<Resume & { sections: (ResumeSection & { items: ResumeItem[] })[] }> {
    // Get resume
    const { data: resume, error: resumeError } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', id)
      .single()

    if (resumeError) throw resumeError

    // Get sections with items
    const { data: sections, error: sectionsError } = await supabase
      .from('resume_sections')
      .select(`
        *,
        items:resume_items(*)
      `)
      .eq('resume_id', id)
      .order('order_index')

    if (sectionsError) throw sectionsError

    return {
      ...resume,
      sections: sections || []
    }
  }

  async create(resume: Omit<Resume, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Resume> {
    const { data, error } = await supabase
      .from('resumes')
      .insert([resume])
      .select()
      .single()

    if (error) throw error
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
      .single()

    if (error) throw error
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