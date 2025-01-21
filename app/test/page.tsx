'use client'

import { useEffect, useState } from 'react'
import { jobsService } from '@/lib/jobs'
import { supabase } from '@/lib/supabase'
import type { Job } from '@/types'

export default function TestPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Check auth status
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) {
        loadJobs()
      }
    })
  }, [])

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
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Not authenticated</h1>
        <p>Please sign in to test the jobs functionality.</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Supabase Integration Test</h1>
      
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