import { supabase } from './supabase'
import { handleClientError, ErrorCodes, type ErrorResult } from './error-handling'
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

      if (error) {
        const errorResult = handleClientError(error, ErrorCodes.AUTH_SIGN_IN)
        throw Object.assign(new Error(errorResult.message), { errorResult })
      }

      if (!data.user) throw new Error('No user data returned')

      return {
        id: data.user.id,
        email: data.user.email,
        created_at: data.user.created_at,
      }
    } catch (error) {
      if (error instanceof Error && 'errorResult' in error) {
        throw error // Re-throw errors we've already handled
      }
      const errorResult = handleClientError(error, ErrorCodes.AUTH_SIGN_IN)
      throw Object.assign(new Error(errorResult.message), { errorResult })
    }
  }

  // ... rest of the existing methods ...
}

export const authService = new AuthService() 