/**
 * @fileoverview Jobs management page component for tracking and managing job applications
 * Implements a data table with inline editing, status management, and job actions
 */

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Trash2, ExternalLink, AlertCircle } from "lucide-react"
import { StatusPipeline } from "@/components/StatusPipeline"
import { StarRating } from "@/components/StarRating"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { AddJobModal } from "@/components/AddJobModal"
import { EditJobModal } from "@/components/EditJobModal"
import { InlineEdit } from "@/components/InlineEdit"
import { jobsService } from "@/lib/jobs"
import { supabase } from "@/lib/supabase"
import type { Job, JobStatus } from "@/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

/**
 * Interface for table cell actions and data updates
 * @interface
 */
interface TableMeta {
  /** Function to update job data */
  updateData: (updatedJob: Job) => Promise<void>
}

/**
 * Props for the delete confirmation dialog
 * @interface
 */
interface DeleteConfirmDialogProps {
  /** ID of the job to delete */
  jobId: string
  /** Title of the job for display */
  jobTitle: string
  /** Callback function when deletion is confirmed */
  onConfirm: () => void
}

/**
 * Delete confirmation dialog component
 * @param props - Component properties
 * @returns {JSX.Element} Rendered dialog component
 */
function DeleteConfirmDialog({ jobId, jobTitle, onConfirm }: DeleteConfirmDialogProps) {
  const [open, setOpen] = useState(false)
  
  const handleConfirm = () => {
    onConfirm()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="action-button action-button--delete"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Job</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the job "{jobTitle}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Jobs page component for managing job applications
 * Features a status pipeline view and detailed data table
 * 
 * @returns {JSX.Element} Rendered jobs page with management interface
 * 
 * @example
 * // In app routing:
 * <Route path="/jobs" component={JobsPage} />
 */
export default function JobsPage(): JSX.Element {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const { toast } = useToast()

  /**
   * Loads jobs from the service
   * Handles loading states and error messaging
   */
  const loadJobs = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await jobsService.list()
      setJobs(data)
    } catch (error) {
      const message = error instanceof Error && 'errorResult' in error
        ? error.message
        : 'Failed to load jobs. Please try again.'
      
      setError(message)
      
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  /**
   * Updates a job's information
   * @param updatedJob - Job object with updated information
   */
  const handleUpdateJob = async (updatedJob: Job) => {
    try {
      const { id, user_id, created_at, updated_at, date_saved, ...updates } = updatedJob
      await jobsService.update(id, updates)
      
      toast({
        title: "Job Updated",
        description: "The job has been successfully updated.",
      })
      
      await loadJobs()
    } catch (error) {
      const message = error instanceof Error && 'errorResult' in error
        ? error.message
        : 'Failed to update job. Please try again.'
      
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
    }
  }

  /**
   * Handles deletion of a job entry
   * @param jobId - The ID of the job to delete
   */
  async function handleDeleteJob(jobId: string) {
    try {
      await jobsService.delete(jobId)
      setJobs(prev => prev.filter(job => job.id !== jobId))
    } catch (err) {
      console.error('Error deleting job:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete job'
      setError(errorMessage)
      setTimeout(() => setError(null), 3000)
    }
  }

  const columns: ColumnDef<Job, any>[] = [
    {
      id: "actions",
      header: "Actions",
      /**
       *
       * @param root0
       * @param root0.row
       */
      cell: ({ row }) => (
        <div className="inline-flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="action-button"
            onClick={() => {
              const jobCopy = { ...row.original }
              const { id, user_id, created_at, updated_at, ...copyData } = jobCopy
              const newJob = {
                ...copyData,
                position: `${copyData.position} (Copy)`
              }
              jobsService.create(newJob).then(() => loadJobs())
            }}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Link href={`/jobs/${row.original.id}`}>
            <Button
              variant="ghost"
              size="icon"
              className="action-button"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
          <EditJobModal job={row.original} onSave={handleUpdateJob} />
          <DeleteConfirmDialog 
            jobId={row.original.id}
            jobTitle={`${row.original.position} at ${row.original.company}`}
            onConfirm={() => handleDeleteJob(row.original.id)}
          />
        </div>
      ),
    },
    {
      accessorKey: "rating",
      header: "Rating",
      /**
       *
       * @param root0
       * @param root0.row
       * @param root0.table
       */
      cell: ({ row, table }) => (
        <InlineEdit
          value={row.original.rating}
          onSave={(value) => {
            const updatedJob = { ...row.original, rating: Number(value) }
            table.options.meta?.updateData(updatedJob)
          }}
        >
          <StarRating rating={row.original.rating} />
        </InlineEdit>
      ),
    },
    {
      accessorKey: "position",
      header: "Job Position",
    },
    {
      accessorKey: "company",
      header: "Company",
      /**
       *
       * @param root0
       * @param root0.row
       * @param root0.table
       */
      cell: ({ row, table }) => (
        <InlineEdit
          value={row.original.company}
          onSave={(value) => {
            const updatedJob = { ...row.original, company: value }
            table.options.meta?.updateData(updatedJob)
          }}
        />
      ),
    },
    {
      accessorKey: "max_salary",
      header: "Max Salary",
      /**
       *
       * @param root0
       * @param root0.row
       * @param root0.table
       */
      cell: ({ row, table }) => (
        <InlineEdit
          value={row.original.max_salary || ''}
          onSave={(value) => {
            const updatedJob = { ...row.original, max_salary: value }
            table.options.meta?.updateData(updatedJob)
          }}
        />
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
      /**
       *
       * @param root0
       * @param root0.row
       * @param root0.table
       */
      cell: ({ row, table }) => (
        <InlineEdit
          value={row.original.location || ''}
          onSave={(value) => {
            const updatedJob = { ...row.original, location: value }
            table.options.meta?.updateData(updatedJob)
          }}
        />
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      /**
       *
       * @param root0
       * @param root0.row
       * @param root0.table
       */
      cell: ({ row, table }) => (
        <Select
          value={row.original.status}
          onValueChange={(value) => {
            const updatedJob = { ...row.original, status: value as JobStatus }
            table.options.meta?.updateData(updatedJob)
          }}
        >
          <SelectTrigger>
            <SelectValue />
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
      ),
    },
    {
      accessorKey: "date_saved",
      header: "Date Saved",
      /**
       *
       * @param root0
       * @param root0.row
       */
      cell: ({ row }) => {
        const date = new Date(row.original.date_saved)
        return date.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        })
      }
    },
  ]

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) {
        loadJobs()
      } else {
        window.location.href = '/login'
      }
    })
  }, [])

  if (!user) {
    return <div className="p-6">Redirecting to login...</div>
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Jobs</h1>
          <AddJobModal onJobAdded={loadJobs} />
        </div>

        {/* Status Pipeline */}
        <div className="card-shadow">
          <StatusPipeline jobs={jobs} />
        </div>

        {/* Data Table */}
        <div className="card-shadow">
          <DataTable
            columns={columns}
            data={jobs}
            meta={{
              updateData: handleUpdateJob,
            }}
          />
        </div>
      </div>
    </div>
  )
}

