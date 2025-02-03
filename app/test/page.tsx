"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { resumeService } from "@/lib/resumes"
import { jobsService } from "@/lib/jobs"
import { supabase } from "@/lib/supabase"
import type { ResumeSectionType, Job } from "@/types"

const SAMPLE_RESUME = {
  name: "Full Stack Developer Resume",
  description: "Resume focused on full-stack development experience",
  template: "modern",
  font_family: "inter",
  font_size: 12,
  line_spacing: 1.5,
  margin_size: 1,
  ranking: 5,
  sections: [
    {
      type: "summary" as ResumeSectionType,
      title: "Professional Summary",
      content: "Experienced full-stack developer with a strong background in building scalable web applications using modern technologies. Proven track record of delivering high-quality solutions and leading development teams.",
      order_index: 0
    },
    {
      type: "experience" as ResumeSectionType,
      title: "Work Experience",
      content: `Senior Full Stack Developer | TechCorp Inc.
Jan 2020 - Present
• Led development of microservices architecture using Node.js and React
• Improved application performance by 40% through optimization
• Mentored junior developers and implemented code review processes

Full Stack Developer | WebSolutions Ltd
Jun 2017 - Dec 2019
• Developed and maintained multiple client projects using MERN stack
• Implemented CI/CD pipelines reducing deployment time by 60%
• Collaborated with UX team to improve user experience`,
      order_index: 1
    },
    {
      type: "skills" as ResumeSectionType,
      title: "Technical Skills",
      content: `Languages: JavaScript (ES6+), TypeScript, Python, SQL
Frontend: React, Next.js, Vue.js, HTML5, CSS3, Tailwind
Backend: Node.js, Express, Django, PostgreSQL, MongoDB
Tools: Git, Docker, AWS, CI/CD, Jest, Cypress`,
      order_index: 2
    },
    {
      type: "education" as ResumeSectionType,
      title: "Education",
      content: `Bachelor of Science in Computer Science
Tech University
2013 - 2017
• GPA: 3.8
• Relevant coursework: Data Structures, Algorithms, Web Development`,
      order_index: 3
    },
    {
      type: "projects" as ResumeSectionType,
      title: "Notable Projects",
      content: `E-commerce Platform Redesign
• Led team of 5 developers in complete platform overhaul
• Implemented headless CMS and modern frontend architecture
• Resulted in 25% increase in conversion rate

Real-time Analytics Dashboard
• Built scalable dashboard processing 1M+ events daily
• Utilized WebSocket for live updates and Redis for caching
• Reduced data processing latency by 70%`,
      order_index: 4
    },
    {
      type: "certifications" as ResumeSectionType,
      title: "Certifications",
      content: `AWS Certified Solutions Architect
Google Cloud Professional Developer
MongoDB Certified Developer`,
      order_index: 5
    }
  ]
}

const SAMPLE_JOB = {
  position: 'Senior Full Stack Developer',
  company: 'TechCorp Inc.',
  max_salary: '150000',
  location: 'Remote',
  status: 'BOOKMARKED' as const,
  rating: 5,
  deadline: null,
  date_applied: null,
  follow_up: null,
  description: 'Looking for an experienced full-stack developer to join our growing team.'
}

/**
 *
 */
export default function TestPage() {
  const [resumeLoading, setResumeLoading] = useState(false)
  const [jobLoading, setJobLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [user, setUser] = useState<any>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    // Check auth status
    console.log('Checking auth status...')
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error) {
        console.error('Auth error:', error)
        setError(error.message)
        return
      }
      console.log('Current user:', user)
      setUser(user)
      if (user) {
        loadJobs()
      }
    })

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session)
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  /**
   *
   */
  async function loadJobs() {
    try {
      const data = await jobsService.list()
      setJobs(data)
    } catch (err) {
      console.error('Error loading jobs:', err)
      setError(err instanceof Error ? err.message : 'Failed to load jobs')
    }
  }

  /**
   *
   * @param e
   */
  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    console.log('Attempting sign in with:', email)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      console.log('Sign in successful:', data)
      setUser(data.user)
      loadJobs()
    } catch (err) {
      console.error('Error signing in:', err)
      setError(err instanceof Error ? err.message : 'Failed to sign in')
    }
  }

  /**
   *
   * @param e
   */
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

  /**
   *
   */
  async function handleSignOut() {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setJobs([])
      setResult(null)
    } catch (err) {
      console.error('Error signing out:', err)
      setError(err instanceof Error ? err.message : 'Failed to sign out')
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Authentication</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">
                  Sign In
                </Button>
                <Button type="button" variant="outline" onClick={handleSignUp}>
                  Sign Up
                </Button>
              </div>
            </form>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  /**
   *
   */
  async function handleCreateSampleResume() {
    try {
      setResumeLoading(true)
      setError(null)
      setResult(null)

      console.log('Starting resume creation...')
      console.log('Current user:', user)
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      // Check auth session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session) {
        console.error('Session error:', sessionError)
        throw new Error('No valid session found')
      }
      console.log('Current session:', {
        accessToken: session.access_token ? 'present' : 'missing',
        user: session.user,
        expiresAt: session.expires_at
      })

      // Extract sections from sample data
      const { sections, ...resumeData } = SAMPLE_RESUME

      // Create resume
      console.log('Creating resume with data:', {
        ...resumeData,
        user_id: user.id
      })
      const resume = await resumeService.create(resumeData).catch(err => {
        console.error('Error in resumeService.create:', err)
        if (err.message.includes('duplicate key')) {
          throw new Error('A resume with this name already exists')
        }
        throw err
      })
      console.log('Resume created:', resume)

      // Create sections
      console.log('Creating sections...')
      const createdSections = []
      for (const section of sections) {
        console.log('Creating section:', {
          ...section,
          resume_id: resume.id
        })
        const createdSection = await resumeService.createSection({
          ...section,
          resume_id: resume.id
        }).catch(err => {
          console.error('Error creating section:', err)
          throw err
        })
        console.log('Section created:', createdSection)
        createdSections.push(createdSection)
      }
      console.log('All sections created:', createdSections)

      setResult({ 
        message: 'Sample resume created successfully', 
        resume,
        sections: createdSections
      })
    } catch (err) {
      console.error('Error creating sample resume:', err)
      if (err instanceof Error) {
        console.error('Error details:', {
          message: err.message,
          stack: err.stack,
          name: err.name
        })
      }
      setError(err instanceof Error ? err.message : 'Failed to create sample resume')
    } finally {
      setResumeLoading(false)
    }
  }

  /**
   *
   */
  async function handleCreateSampleJob() {
    try {
      setJobLoading(true)
      setError(null)
      setResult(null)

      const job = await jobsService.create(SAMPLE_JOB)
      const updatedJobs = await jobsService.list()
      setJobs(updatedJobs)
      setResult({ message: 'Sample job created successfully', job })
    } catch (err) {
      console.error('Error creating sample job:', err)
      setError(err instanceof Error ? err.message : 'Failed to create sample job')
    } finally {
      setJobLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* User Info */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Logged in as {user.email}</CardTitle>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </CardHeader>
      </Card>

      {/* Resume Test Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Resume Test Tools</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Button 
              onClick={handleCreateSampleResume}
              disabled={resumeLoading}
            >
              {resumeLoading ? "Creating Resume..." : "Create Sample Resume"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Job Test Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Job Test Tools</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Button 
              onClick={handleCreateSampleJob}
              disabled={jobLoading}
            >
              {jobLoading ? "Creating Job..." : "Create Sample Job"}
            </Button>
          </div>

          {jobs.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Current Jobs</h3>
              <pre className="bg-gray-50 p-4 rounded overflow-auto">
                {JSON.stringify(jobs, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results/Errors */}
      {error && (
        <Card>
          <CardContent className="pt-6">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              Error: {error}
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardContent className="pt-6">
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 