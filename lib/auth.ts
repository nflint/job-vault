import { supabase } from './supabase'
import { handleClientError } from './error-handling'
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
        // Handle specific auth error cases
        const authError = error as AuthError
        switch (authError.message) {
          case 'Invalid login credentials':
            throw new Error('The email or password you entered is incorrect')
          case 'Email not confirmed':
            throw new Error('Please verify your email address before signing in')
          case 'Invalid email or password':
            throw new Error('The email or password you entered is incorrect')
          case 'Too many requests':
            throw new Error('Too many login attempts. Please try again later')
          case 'Email link is invalid or has expired':
            throw new Error('Your login link has expired. Please request a new one')
          default:
            throw error
        }
      }

      if (!data.user) throw new Error('No user data returned')

      return {
        id: data.user.id,
        email: data.user.email,
        created_at: data.user.created_at,
      }
    } catch (error) {
      // If it's already a handled error (from our switch case), pass it through
      if (error instanceof Error && error.message !== error.toString()) {
        throw error
      }
      // Otherwise, use the generic handler
      throw new Error(handleClientError(error, 'AUTH_SIGN_IN'))
    }
  }

  async signUp(email: string, password: string): Promise<{ user: AuthUser | null; confirmationRequired: boolean }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      return {
        user: data.user ? {
          id: data.user.id,
          email: data.user.email,
          created_at: data.user.created_at,
        } : null,
        confirmationRequired: !data.session,
      }
    } catch (error) {
      throw new Error(handleClientError(error, 'AUTH_SIGN_UP'))
    }
  }

  async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      throw new Error(handleClientError(error, 'AUTH_SIGN_OUT'))
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      if (error) throw error
    } catch (error) {
      throw new Error(handleClientError(error, 'AUTH_RESET_PASSWORD'))
    }
  }

  async updatePassword(newPassword: string): Promise<void> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })
      if (error) throw error
    } catch (error) {
      throw new Error(handleClientError(error, 'AUTH_UPDATE_PASSWORD'))
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      
      return user ? {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
      } : null
    } catch (error) {
      throw new Error(handleClientError(error, 'AUTH_GET_CURRENT_USER'))
    }
  }

  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      return session
    } catch (error) {
      throw new Error(handleClientError(error, 'AUTH_GET_SESSION'))
    }
  }

  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(callback)
      return subscription
    } catch (error) {
      throw new Error(handleClientError(error, 'AUTH_STATE_CHANGE'))
    }
  }
}

export const authService = new AuthService() 