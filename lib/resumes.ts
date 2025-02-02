import { supabase } from './supabase'
import type { Resume, ResumeSection, ResumeItem, ResumeExport } from '@/types'
import { handleClientError } from './error-handling'

class ResumeService {
  async list(): Promise<Resume[]> {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('id, name, description, template, font_family, font_size, line_spacing, margin_size, ranking, user_id, created_at, updated_at')
        .order('updated_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(handleClientError(error, 'RESUME_LIST'))
    }
  }

  async get(id: string): Promise<Resume & { sections: ResumeSection[] }> {
    try {
      // Get resume
      const { data: resume, error: resumeError } = await supabase
        .from('resumes')
        .select('id, name, description, template, font_family, font_size, line_spacing, margin_size, ranking, user_id, created_at, updated_at')
        .eq('id', id)
        .single()

      if (resumeError) throw resumeError

      // Get sections
      const { data: sections, error: sectionsError } = await supabase
        .from('resume_sections')
        .select('*')
        .eq('resume_id', id)
        .order('order_index')

      if (sectionsError) throw sectionsError

      return {
        ...resume,
        sections: sections || []
      }
    } catch (error) {
      throw new Error(handleClientError(error, 'RESUME_GET'))
    }
  }

  async create(resume: Omit<Resume, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Resume> {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      if (!user) {
        throw new Error('User not authenticated')
      }

      // Create resume
      const { data, error } = await supabase
        .from('resumes')
        .insert([{ ...resume, user_id: user.id }])
        .select()
        .maybeSingle()

      if (error) throw error
      if (!data) {
        throw new Error('No resume data returned after creation')
      }
      return data
    } catch (error) {
      throw new Error(handleClientError(error, 'RESUME_CREATE'))
    }
  }

  async update(id: string, updates: Partial<Omit<Resume, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<Resume> {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(handleClientError(error, 'RESUME_UPDATE'))
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      throw new Error(handleClientError(error, 'RESUME_DELETE'))
    }
  }

  // Section methods
  async createSection(section: Omit<ResumeSection, 'id' | 'created_at' | 'updated_at'>): Promise<ResumeSection> {
    try {
      const { data, error } = await supabase
        .from('resume_sections')
        .insert([section])
        .select()
        .maybeSingle()

      if (error) throw error
      if (!data) {
        throw new Error('No section data returned after creation')
      }
      return data
    } catch (error) {
      throw new Error(handleClientError(error, 'RESUME_SECTION_CREATE'))
    }
  }

  async updateSection(id: string, updates: Partial<Omit<ResumeSection, 'id' | 'resume_id' | 'created_at' | 'updated_at'>>): Promise<ResumeSection> {
    try {
      const { data, error } = await supabase
        .from('resume_sections')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(handleClientError(error, 'RESUME_SECTION_UPDATE'))
    }
  }

  async deleteSection(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('resume_sections')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      throw new Error(handleClientError(error, 'RESUME_SECTION_DELETE'))
    }
  }

  // Item methods
  async createItem(item: Omit<ResumeItem, 'id' | 'created_at' | 'updated_at'>): Promise<ResumeItem> {
    try {
      const { data, error } = await supabase
        .from('resume_items')
        .insert([item])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(handleClientError(error, 'RESUME_ITEM_CREATE'))
    }
  }

  async updateItem(id: string, updates: Partial<Omit<ResumeItem, 'id' | 'section_id' | 'created_at' | 'updated_at'>>): Promise<ResumeItem> {
    try {
      const { data, error } = await supabase
        .from('resume_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(handleClientError(error, 'RESUME_ITEM_UPDATE'))
    }
  }

  async deleteItem(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('resume_items')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      throw new Error(handleClientError(error, 'RESUME_ITEM_DELETE'))
    }
  }

  // Export methods
  async createExport(resumeExport: Omit<ResumeExport, 'id' | 'created_at'>): Promise<ResumeExport> {
    try {
      const { data, error } = await supabase
        .from('resume_exports')
        .insert([resumeExport])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(handleClientError(error, 'RESUME_EXPORT_CREATE'))
    }
  }

  async getExports(resumeId: string): Promise<ResumeExport[]> {
    try {
      const { data, error } = await supabase
        .from('resume_exports')
        .select('*')
        .eq('resume_id', resumeId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      throw new Error(handleClientError(error, 'RESUME_EXPORT_LIST'))
    }
  }
}

export const resumeService = new ResumeService() 