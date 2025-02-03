'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

/**
 *
 */
function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Get the hash fragment from the URL
    const hashFragment = window.location.hash
    
    // Check if this is a recovery (password reset) flow
    if (hashFragment && hashFragment.includes('type=recovery')) {
      // Remove the hash and get the access token
      const accessToken = hashFragment
        .substring(1)
        .split('&')
        .find(param => param.startsWith('access_token='))
        ?.split('=')[1]

      if (accessToken) {
        // Set the access token in Supabase
        supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: '',
        })
        // Redirect to password reset page
        router.push('/reset-password')
      } else {
        router.push('/login')
      }
    } else {
      // Handle normal sign-in callback
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          router.push('/jobs')
        } else {
          router.push('/login')
        }
      })
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-500/10 via-pink-500/5 to-background">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-400 bg-clip-text text-transparent">
          Processing...
        </h2>
        <p className="text-muted-foreground">Please wait while we redirect you.</p>
      </div>
    </div>
  )
}

/**
 *
 */
export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-500/10 via-pink-500/5 to-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-400 bg-clip-text text-transparent">
            Loading...
          </h2>
          <p className="text-muted-foreground">Please wait...</p>
        </div>
      </div>
    }>
      <AuthCallback />
    </Suspense>
  )
} 