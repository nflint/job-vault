"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Trash2, FileDown } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { StarRating } from "@/components/StarRating"
import { InlineEdit } from "@/components/InlineEdit"
import { resumeService } from "@/lib/resumes"
import { supabase } from "@/lib/supabase"
import type { Resume } from "@/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Link from "next/link"

interface DeleteConfirmDialogProps {
  resumeId: string
  resumeName: string
  onConfirm: () => void
}

function DeleteConfirmDialog({ resumeId, resumeName, onConfirm }: DeleteConfirmDialogProps) {
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
            Are you sure you want to delete the resume "{resumeName}"? This action cannot be undone.
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
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  async function handleUpdateResume(updatedResume: Resume) {
    try {
      const { id, user_id, created_at, updated_at, ...updateData } = updatedResume
      await resumeService.update(id, updateData)
      setResumes(prev => prev.map(resume => resume.id === id ? updatedResume : resume))
    } catch (err) {
      console.error('Error updating resume:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to update resume'
      setError(errorMessage)
      setTimeout(() => setError(null), 3000)
    }
  }

  async function handleDeleteResume(resumeId: string) {
    try {
      await resumeService.delete(resumeId)
      setResumes(prev => prev.filter(resume => resume.id !== resumeId))
    } catch (err) {
      console.error('Error deleting resume:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete resume'
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
            onClick={() => {
              const { id, user_id, created_at, updated_at, ...resumeData } = row.original
              const resumeCopy = {
                ...resumeData,
                name: `${resumeData.name} (Copy)`
              }
              resumeService.create(resumeCopy).then(() => loadResumes())
            }}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Link href={`/resume/${row.original.id}`}>
            <Button
              variant="ghost"
              size="icon"
              className="action-button"
            >
              <FileDown className="h-4 w-4" />
            </Button>
          </Link>
          <DeleteConfirmDialog 
            resumeId={row.original.id}
            resumeName={row.original.name}
            onConfirm={() => handleDeleteResume(row.original.id)}
          />
        </div>
      ),
    },
    {
      accessorKey: "ranking",
      header: "Rating",
      cell: ({ row, table }) => (
        <InlineEdit
          value={row.original.ranking}
          onSave={(value) => {
            const updatedResume = { ...row.original, ranking: Number(value) }
            table.options.meta?.updateData(updatedResume)
          }}
        >
          <StarRating rating={row.original.ranking} />
        </InlineEdit>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row, table }) => (
        <InlineEdit
          value={row.original.name}
          onSave={(value) => {
            const updatedResume = { ...row.original, name: value }
            table.options.meta?.updateData(updatedResume)
          }}
        />
      ),
    },
    {
      accessorKey: "template",
      header: "Template",
      cell: ({ row, table }) => (
        <InlineEdit
          value={row.original.template}
          onSave={(value) => {
            const updatedResume = { ...row.original, template: value }
            table.options.meta?.updateData(updatedResume)
          }}
        />
      ),
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => {
        const date = new Date(row.original.created_at)
        return date.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        })
      }
    },
    {
      accessorKey: "updated_at",
      header: "Last Modified",
      cell: ({ row }) => {
        const date = new Date(row.original.updated_at)
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
        loadResumes()
      } else {
        window.location.href = '/login'
      }
    })
  }, [])

  async function loadResumes() {
    try {
      setLoading(true)
      const data = await resumeService.list()
      setResumes(data)
    } catch (err) {
      console.error('Error loading resumes:', err)
      setError(err instanceof Error ? err.message : 'Failed to load resumes')
    } finally {
      setLoading(false)
    }
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
          <h1 className="text-2xl font-semibold">Resumes</h1>
          <Link href="/resume/new">
            <Button>Create New Resume</Button>
          </Link>
        </div>

        {/* Data Table */}
        <div className="card-shadow">
          <DataTable
            columns={columns}
            data={resumes}
            meta={{
              updateData: handleUpdateResume,
            }}
          />
        </div>
      </div>
    </div>
  )
} 