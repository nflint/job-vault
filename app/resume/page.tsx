"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Trash2 } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { StarRating } from "@/components/StarRating"
import { InlineEdit } from "@/components/InlineEdit"
import { supabase } from "@/lib/supabase"
import { AddResumeModal } from "@/components/AddResumeModal"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Test data
const TEST_RESUMES = [
  {
    id: 1,
    title: "Full Stack Developer Resume - FAANG Focus",
    version: "2.3",
    ranking: 5,
    date_created: "2024-02-15T08:00:00Z",
    last_modified: "2024-03-13T14:30:00Z",
    user_id: "test-user-1"
  },
  {
    id: 2,
    title: "Senior Cloud Architect CV",
    version: "1.5",
    ranking: 4,
    date_created: "2024-01-30T10:15:00Z",
    last_modified: "2024-03-10T09:45:00Z",
    user_id: "test-user-1"
  },
  {
    id: 3,
    title: "Data Science & ML Engineer Resume",
    version: "3.0",
    ranking: 5,
    date_created: "2024-02-25T15:20:00Z",
    last_modified: "2024-03-14T11:20:00Z",
    user_id: "test-user-1"
  },
  {
    id: 4,
    title: "DevOps Specialist Resume - Kubernetes",
    version: "2.0",
    ranking: 3,
    date_created: "2024-01-15T11:30:00Z",
    last_modified: "2024-02-28T16:40:00Z",
    user_id: "test-user-1"
  },
  {
    id: 5,
    title: "Frontend Developer - React Expert",
    version: "1.8",
    ranking: 4,
    date_created: "2024-02-20T09:45:00Z",
    last_modified: "2024-03-12T13:15:00Z",
    user_id: "test-user-1"
  },
  {
    id: 6,
    title: "Backend Engineer - Microservices",
    version: "2.1",
    ranking: 3,
    date_created: "2024-02-05T14:20:00Z",
    last_modified: "2024-03-08T10:30:00Z",
    user_id: "test-user-1"
  },
  {
    id: 7,
    title: "AI/ML Research Position Resume",
    version: "1.2",
    ranking: 5,
    date_created: "2024-03-01T16:10:00Z",
    last_modified: "2024-03-14T15:45:00Z",
    user_id: "test-user-1"
  },
  {
    id: 8,
    title: "Technical Lead - Startup Focus",
    version: "2.5",
    ranking: 4,
    date_created: "2024-02-10T13:25:00Z",
    last_modified: "2024-03-11T12:20:00Z",
    user_id: "test-user-1"
  }
]

interface Resume {
  id: number
  title: string
  version: string
  ranking: number
  date_created: string
  last_modified: string
  user_id: string
}

interface DeleteConfirmDialogProps {
  resumeId: number
  resumeTitle: string
  onConfirm: () => void
}

function DeleteConfirmDialog({ resumeId, resumeTitle, onConfirm }: DeleteConfirmDialogProps) {
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
          <DialogTitle>Delete Resume</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the resume "{resumeTitle}"? This action cannot be undone.
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

export default function ResumePage() {
  const [resumes, setResumes] = useState<Resume[]>(TEST_RESUMES)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>({ id: 'test-user-1' })

  async function handleUpdateResume(updatedResume: Resume) {
    try {
      setResumes(prev => prev.map(resume => 
        resume.id === updatedResume.id ? updatedResume : resume
      ))
    } catch (err) {
      console.error('Error updating resume:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to update resume'
      setError(errorMessage)
      setTimeout(() => setError(null), 3000)
    }
  }

  async function handleDeleteResume(resumeId: number) {
    try {
      setResumes(prev => prev.filter(resume => resume.id !== resumeId))
    } catch (err) {
      console.error('Error deleting resume:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete resume'
      setError(errorMessage)
      setTimeout(() => setError(null), 3000)
    }
  }

  async function handleDuplicateResume(resume: Resume) {
    try {
      const newId = Math.max(...resumes.map(r => r.id)) + 1
      const resumeCopy = {
        ...resume,
        id: newId,
        title: `${resume.title} (Copy)`,
        date_created: new Date().toISOString(),
        last_modified: new Date().toISOString(),
      }
      setResumes(prev => [...prev, resumeCopy])
    } catch (err) {
      console.error('Error duplicating resume:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to duplicate resume'
      setError(errorMessage)
      setTimeout(() => setError(null), 3000)
    }
  }

  const columns: ColumnDef<Resume, any>[] = [
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="inline-flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="action-button"
            onClick={() => handleDuplicateResume(row.original)}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <DeleteConfirmDialog 
            resumeId={row.original.id}
            resumeTitle={row.original.title}
            onConfirm={() => handleDeleteResume(row.original.id)}
          />
        </div>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row, table }) => (
        <InlineEdit
          value={row.original.title}
          onSave={(value: string) => {
            const updatedResume = { ...row.original, title: value }
            table.options.meta?.updateData(updatedResume)
          }}
        />
      ),
    },
    {
      accessorKey: "version",
      header: "Version",
      cell: ({ row, table }) => (
        <InlineEdit
          value={row.original.version}
          onSave={(value: string) => {
            const updatedResume = { ...row.original, version: value }
            table.options.meta?.updateData(updatedResume)
          }}
        />
      ),
    },
    {
      accessorKey: "ranking",
      header: "Ranking",
      cell: ({ row, table }) => (
        <InlineEdit
          value={row.original.ranking}
          onSave={(value: string) => {
            const updatedResume = { ...row.original, ranking: Number(value) }
            table.options.meta?.updateData(updatedResume)
          }}
        >
          <StarRating rating={row.original.ranking} />
        </InlineEdit>
      ),
    },
    {
      accessorKey: "date_created",
      header: "Date Created",
      cell: ({ row }) => {
        const date = new Date(row.original.date_created)
        return date.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        })
      }
    },
    {
      accessorKey: "last_modified",
      header: "Last Modified",
      cell: ({ row }) => {
        const date = new Date(row.original.last_modified)
        return date.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        })
      }
    },
  ]

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Resume Management</h1>
        <AddResumeModal onSuccess={() => {}} />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={resumes}
        meta={{
          updateData: handleUpdateResume,
        }}
      />
    </div>
  )
} 