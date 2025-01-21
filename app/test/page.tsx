'use client'

import { useEffect, useState } from 'react'
import { jobsService } from '@/lib/jobs'
import { supabase } from '@/lib/supabase'
import type { Job } from '@/types'

export default function TestPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    // Check auth status
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) {
        loadJobs()
      }
    })
  }, [])

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      setUser(data.user)
      loadJobs()
    } catch (err) {
      console.error('Error signing in:', err)
      setError(err instanceof Error ? err.message : 'Failed to sign in')
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error
      setError('Check your email for the confirmation link!')
    } catch (err) {
      console.error('Error signing up:', err)
      setError(err instanceof Error ? err.message : 'Failed to sign up')
    }
  }

  async function handleSignOut() {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setJobs([])
    } catch (err) {
      console.error('Error signing out:', err)
      setError(err instanceof Error ? err.message : 'Failed to sign out')
    }
  }

  async function loadJobs() {
    try {
      const data = await jobsService.list()
      setJobs(data)
      console.log('Jobs loaded:', data)
    } catch (err) {
      console.error('Error loading jobs:', err)
      setError(err instanceof Error ? err.message : 'Failed to load jobs')
    }
  }

  async function testCreateJob() {
    try {
      const newJob = await jobsService.create({
        position: 'Test Position',
        company: 'Test Company',
        max_salary: '100000',
        location: 'Remote',
        status: 'BOOKMARKED',
        deadline: null,
        date_applied: null,
        follow_up: null,
        excitement: 3
      })
      console.log('Job created:', newJob)
      loadJobs() // Reload the list
    } catch (err) {
      console.error('Error creating job:', err)
      setError(err instanceof Error ? err.message : 'Failed to create job')
    }
  }

  if (!user) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <h1 className="text-xl font-bold mb-4">Authentication</h1>
        
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={handleSignUp}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Sign Up
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Supabase Integration Test</h1>
        <button
          onClick={handleSignOut}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
      
      <div className="mb-4">
        <button 
          onClick={testCreateJob}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Test Job
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Current Jobs:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(jobs, null, 2)}
        </pre>
      </div>
    </div>
  )
} 