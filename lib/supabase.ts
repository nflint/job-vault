import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'job-vault-auth',
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'job-vault'
    }
  },
  db: {
    schema: 'public'
  }
})

// Add middleware to handle auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event)
  if (event === 'SIGNED_IN') {
    console.log('User signed in:', session?.user)
    console.log('Session:', session)
  } else if (event === 'SIGNED_OUT') {
    console.log('User signed out')
  } else if (event === 'TOKEN_REFRESHED') {
    console.log('Token refreshed')
  }
}) 