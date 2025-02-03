'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

type Job = {
  id: string
  role: string
  company: string
  description: string
  link: string
  status: string
  notes: string
  rating: string
  email: string
  source: string
}

/**
 *
 */
export default function JobList() {
  // Mock data for demonstration
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: '1',
      role: 'Frontend Developer',
      company: 'Tech Co',
      description: 'Exciting opportunity for a frontend developer...',
      link: 'https://example.com/job1',
      status: 'Applied',
      notes: 'Great company culture',
      rating: '4',
      email: 'hr@techco.com',
      source: 'LinkedIn'
    },
    {
      id: '2',
      role: 'Backend Engineer',
      company: 'Startup Inc',
      description: 'Looking for a skilled backend engineer...',
      link: 'https://example.com/job2',
      status: 'Saved',
      notes: 'Interesting project',
      rating: '3',
      email: 'jobs@startupinc.com',
      source: 'Indeed'
    },
  ])

  /**
   *
   * @param jobId
   * @param newStatus
   */
  const handleStatusChange = (jobId: string, newStatus: string) => {
    setJobs(prevJobs =>
      prevJobs.map(job =>
        job.id === jobId ? { ...job, status: newStatus } : job
      )
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Job Listings</h2>
      {jobs.map((job) => (
        <Card key={job.id}>
          <CardHeader>
            <CardTitle>{job.role} at {job.company}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-2">{job.description}</p>
            <a href={job.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              View Job Posting
            </a>
            <div className="mt-2 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="font-semibold">Status:</span>
                <Select onValueChange={(value) => handleStatusChange(job.id, value)} defaultValue={job.status}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="saved">Saved</SelectItem>
                    <SelectItem value="applied">Applied</SelectItem>
                    <SelectItem value="interviewing">Interviewing</SelectItem>
                    <SelectItem value="offered">Offered</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p><span className="font-semibold">Notes:</span> {job.notes}</p>
              <p><span className="font-semibold">Rating:</span> {job.rating}/5</p>
              <p><span className="font-semibold">Contact:</span> {job.email}</p>
              <p><span className="font-semibold">Source:</span> {job.source}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

