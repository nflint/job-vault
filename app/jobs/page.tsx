"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Trash2 } from "lucide-react"
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

interface DeleteConfirmDialogProps {
  jobId: number
  jobTitle: string
  onConfirm: () => void
}

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

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  async function handleUpdateJob(updatedJob: Job) {
    try {
      console.log('Attempting to update job:', updatedJob)
      // Exclude id, user_id, created_at, and updated_at from the update
      const { id, user_id, created_at, updated_at, ...updateData } = updatedJob
      await jobsService.update(id, updateData)
      setJobs(prev => prev.map(job => job.id === id ? updatedJob : job))
    } catch (err) {
      console.error('Error updating job:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to update job'
      console.error('Full error details:', err)
      setError(errorMessage)
      // Show error for 3 seconds then clear it
      setTimeout(() => setError(null), 3000)
    }
  }

  async function handleDeleteJob(jobId: number) {
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
      cell: ({ row }) => (
        <div className="inline-flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="action-button"
            onClick={() => {
              const jobCopy = { ...row.original }
              delete jobCopy.id // Remove the ID so it creates a new record
              delete jobCopy.user_id
              delete jobCopy.created_at
              delete jobCopy.updated_at
              jobCopy.position = `${jobCopy.position} (Copy)`
              jobsService.create(jobCopy).then(() => loadJobs())
            }}
          >
            <Copy className="h-4 w-4" />
          </Button>
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
      accessorKey: "excitement",
      header: "Excitement",
      cell: ({ row, table }) => (
        <InlineEdit
          value={row.original.excitement}
          onSave={(value) => {
            const updatedJob = { ...row.original, excitement: Number(value) }
            table.options.meta?.updateData(updatedJob)
          }}
        >
          <StarRating rating={row.original.excitement} />
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
            <SelectItem value="saved">Saved</SelectItem>
            <SelectItem value="applied">Applied</SelectItem>
            <SelectItem value="interviewing">Interviewing</SelectItem>
            <SelectItem value="offered">Offered</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      accessorKey: "date_saved",
      header: "Date Saved",
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
    // Check auth status and load jobs
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) {
        loadJobs()
      } else {
        // Redirect to login if not authenticated
        window.location.href = '/login'
      }
    })
  }, [])

  async function loadJobs() {
    try {
      setLoading(true)
      const data = await jobsService.list()
      setJobs(data)
    } catch (err) {
      console.error('Error loading jobs:', err)
      setError(err instanceof Error ? err.message : 'Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }

  function getColumnId(column: ColumnDef<Job, any>): string {
    return column.id || column.accessorKey || 'column'
  }

  if (!user) {
    return <div className="p-6">Redirecting to login...</div>
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          <div className="skeleton h-20"></div>
          <div className="skeleton h-10 w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton h-12"></div>
            ))}
          </div>
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

  return (
    <div className="min-h-screen gradient-bg">
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-mono font-semibold">jobs</h1>
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

