import { supabase } from './supabase'
import { handleClientError, ErrorCodes } from './error-handling'
import type { AuthChangeEvent, Session, AuthError } from '@supabase/supabase-js'

export interface AuthUser {
  id: string
  email?: string
  created_at?: string
}

class AuthService {
  async signIn(email: string, password: string): Promise<AuthUser> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (!data.user) throw new Error('No user data returned')

      return {
        id: data.user.id,
        email: data.user.email,
        created_at: data.user.created_at,
      }
    } catch (error) {
      throw new Error(handleClientError(error, ErrorCodes.AUTH_SIGN_IN))
    }
  }

  // ... rest of the existing methods ...
}

export const authService = new AuthService() 