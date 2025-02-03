"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { StarRating } from "@/components/StarRating"
import { InlineEdit } from "@/components/InlineEdit"
import { jobsService } from "@/lib/jobs"
import type { Job, JobStatus } from "@/types"
import { ArrowLeft } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

/**
 *
 * @param root0
 * @param root0.params
 * @param root0.params.id
 */
export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [description, setDescription] = useState("")

  useEffect(() => {
    loadJob()
  }, [params.id])

  useEffect(() => {
    if (job?.description) {
      setDescription(job.description)
    }
  }, [job?.description])

  /**
   *
   */
  async function loadJob() {
    try {
      setLoading(true)
      const jobData = await jobsService.get(parseInt(params.id))
      setJob(jobData)
    } catch (err) {
      console.error('Error loading job:', err)
      setError(err instanceof Error ? err.message : 'Failed to load job')
    } finally {
      setLoading(false)
    }
  }

  /**
   *
   * @param field
   * @param value
   */
  async function handleUpdateJob(field: string, value: any) {
    if (!job) return

    try {
      const updatedJob = { ...job, [field]: value }
      await jobsService.update(job.id, { [field]: value })
      setJob(updatedJob)
    } catch (err) {
      console.error('Error updating job:', err)
      setError(err instanceof Error ? err.message : 'Failed to update job')
      setTimeout(() => setError(null), 3000)
    }
  }

  /**
   *
   */
  async function handleDescriptionSave() {
    if (!job) return
    await handleUpdateJob('description', description)
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          <div className="skeleton h-8 w-1/4"></div>
          <div className="skeleton h-32"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          Job not found
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold">
                <InlineEdit
                  value={job.position}
                  onSave={(value) => handleUpdateJob('position', value)}
                >
                  <span>{job.position}</span>
                </InlineEdit>
              </h1>
              <div className="text-muted-foreground">
                <InlineEdit
                  value={job.company}
                  onSave={(value) => handleUpdateJob('company', value)}
                >
                  <span>{job.company}</span>
                </InlineEdit>
                {job.location && ` — ${job.location}`}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <StarRating 
              rating={job.rating} 
              onRatingChange={(value) => handleUpdateJob('rating', value)}
            />
          </div>
        </div>

        {/* Status Pipeline */}
        <div className="mb-6">
          <Select
            value={job.status}
            onValueChange={(value) => handleUpdateJob('status', value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BOOKMARKED">Bookmarked</SelectItem>
              <SelectItem value="APPLYING">Applying</SelectItem>
              <SelectItem value="APPLIED">Applied</SelectItem>
              <SelectItem value="INTERVIEWING">Interviewing</SelectItem>
              <SelectItem value="NEGOTIATING">Negotiating</SelectItem>
              <SelectItem value="ACCEPTED">Accepted</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Main content */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Description */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Job Description</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleDescriptionSave}
                  >
                    Save
                  </Button>
                </div>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[200px]"
                  placeholder="Enter job description..."
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Left column */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-1">Location</h3>
                    <InlineEdit
                      value={job.location || ''}
                      onSave={(value) => handleUpdateJob('location', value)}
                    >
                      <div>{job.location || 'Not specified'}</div>
                    </InlineEdit>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Maximum Salary</h3>
                    <InlineEdit
                      value={job.max_salary || ''}
                      onSave={(value) => handleUpdateJob('max_salary', value)}
                    >
                      <div>{job.max_salary || 'Not specified'}</div>
                    </InlineEdit>
                  </div>
                </div>

                {/* Right column */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-1">Date Saved</h3>
                    <div>{new Date(job.date_saved).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Last Updated</h3>
                    <div>{new Date(job.updated_at).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 