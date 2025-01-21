'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function SignUpPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isResetMode, setIsResetMode] = useState(searchParams.get('reset') === 'true')
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Check if user is already authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/jobs')
      } else {
        setLoading(false)
      }
    })
  }, [router])

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' })
      return
    }
    
    setIsSubmitting(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
      setMessage({ 
        type: 'success', 
        text: 'Check your email for the confirmation link!'
      })
      // Redirect to login after successful signup
      setTimeout(() => router.push('/login'), 2000)
    } catch (err) {
      console.error('Error signing up:', err)
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to sign up'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handlePasswordReset(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      })
      if (error) throw error
      setMessage({
        type: 'success',
        text: 'Password reset instructions sent to your email!'
      })
    } catch (err) {
      console.error('Error resetting password:', err)
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to send reset instructions'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading state while checking auth
  if (loading) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-500/10 via-pink-500/5 to-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-400 bg-clip-text text-transparent">
            {isResetMode ? 'Reset Password' : 'Create your account'}
          </h2>
          <p className="text-center text-sm text-muted-foreground mb-2">
            Start tracking your job search journey today - completely free, forever! We believe everyone deserves access to great tools.
          </p>
          
        </div>

        <form className="mt-8 space-y-6" onSubmit={isResetMode ? handlePasswordReset : handleSignUp}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-purple-500/20 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-purple-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            
            {!isResetMode && (
              <>
                <div className="relative">
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-purple-500/20 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-pink-500 focus:z-10 sm:text-sm pr-10"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-purple-500"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <div className="relative">
                  <label htmlFor="confirm-password" className="sr-only">
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-purple-500/20 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-purple-500 focus:border-pink-500 focus:z-10 sm:text-sm pr-10"
                    placeholder="Confirm Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-purple-500"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </>
            )}
          </div>

          {message && (
            <div className={`rounded-md p-4 ${
              message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          <div>
            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
            >
              {isSubmitting ? 'Processing...' : isResetMode ? 'Send reset instructions' : 'Sign up'}
            </Button>
          </div>

          {!isResetMode && (
            <div className="text-center">
              <p className="mb-2">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-purple-500 hover:text-pink-500">
                  Sign in
                </Link>
              </p>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsResetMode(true)}
                className="font-medium hover:text-purple-500"
              >
                Forgot your password?
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
} 