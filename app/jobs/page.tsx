"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Menu, Plus } from "lucide-react"
import { StatusPipeline } from "@/components/StatusPipeline"
import { StarRating } from "@/components/StarRating"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef, AccessorKeyColumnDef } from "@tanstack/react-table"
import { AddJobModal } from "@/components/AddJobModal"
import { EditJobModal } from "@/components/EditJobModal"
import { InlineEdit } from "@/components/InlineEdit"
import { jobsService } from "@/lib/jobs"
import { supabase } from "@/lib/supabase"
import type { Job, JobStatus } from "@/types"

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [selectedJobs, setSelectedJobs] = useState<number[]>([])

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

  const columns: ColumnDef<Job, any>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
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
        <InlineEdit
          value={row.original.status}
          onSave={(value) => {
            const updatedJob = { ...row.original, status: value as JobStatus }
            table.options.meta?.updateData(updatedJob)
          }}
        />
      ),
    },
    {
      accessorKey: "date_saved",
      header: "Date Saved",
    },
    {
      accessorKey: "deadline",
      header: "Deadline",
      cell: ({ row, table }) => (
        <InlineEdit
          value={row.original.deadline || ''}
          onSave={(value) => {
            const updatedJob = { ...row.original, deadline: value }
            table.options.meta?.updateData(updatedJob)
          }}
        />
      ),
    },
    {
      accessorKey: "date_applied",
      header: "Date Applied",
    },
    {
      accessorKey: "follow_up",
      header: "Follow up",
      cell: ({ row, table }) => (
        <InlineEdit
          value={row.original.follow_up || ''}
          onSave={(value) => {
            const updatedJob = { ...row.original, follow_up: value }
            table.options.meta?.updateData(updatedJob)
          }}
        />
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <EditJobModal job={row.original} onSave={handleUpdateJob} />,
    },
  ]

  const defaultColumns = columns.map((column) => getColumnId(column))
  const [selectedColumns, setSelectedColumns] = useState<string[]>(defaultColumns)

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

  useEffect(() => {
    const savedColumns = localStorage.getItem("selectedColumns")
    if (savedColumns) {
      setSelectedColumns(JSON.parse(savedColumns))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("selectedColumns", JSON.stringify(selectedColumns))
  }, [selectedColumns])

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

  function getColumnId(column: ColumnDef<Job, any> | AccessorKeyColumnDef<Job, any>): string {
    return column.id || (column as AccessorKeyColumnDef<Job, any>).accessorKey || 'column'
  }

  if (!user) {
    return <div className="p-6">Redirecting to login...</div>
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
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
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 dark:from-background dark:to-background/90">
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        {/* Command-palette inspired header */}
        <div className="rounded-lg border bg-card p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Menu className="h-4 w-4 text-primary" />
              </div>
              <h1 className="font-mono text-lg font-semibold tracking-tight">job_vault</h1>
            </div>
            <div className="flex items-center space-x-2">
              <AddJobModal onJobAdded={loadJobs} />
            </div>
          </div>
        </div>

        {/* Status Pipeline with modern styling */}
        <div className="rounded-lg border bg-card shadow-sm">
          <StatusPipeline jobs={jobs} />
        </div>

        {/* Controls section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg border bg-card/50 p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Checkbox 
                checked={selectedJobs.length > 0} 
                onCheckedChange={() => setSelectedJobs([])}
                className="border-primary/50"
              />
              <span className="text-sm text-muted-foreground">
                <span className="font-mono">{selectedJobs.length}</span> selected
              </span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 text-sm">
                  <span className="font-mono">group_by:</span> none
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>none</DropdownMenuItem>
                <DropdownMenuItem>status</DropdownMenuItem>
                <DropdownMenuItem>company</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">columns</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {columns.map((column) => {
                  const columnId = getColumnId(column)
                  return (
                    <DropdownMenuCheckboxItem
                      key={columnId}
                      className="capitalize"
                      checked={selectedColumns.includes(columnId)}
                      onCheckedChange={(value) =>
                        setSelectedColumns(
                          value ? [...selectedColumns, columnId] : selectedColumns.filter((id) => id !== columnId),
                        )
                      }
                    >
                      {typeof column.header === "string" ? column.header : columnId}
                    </DropdownMenuCheckboxItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Data Table with modern styling */}
        <div className="rounded-lg border bg-card shadow-sm">
          <DataTable
            columns={columns.filter((column) => selectedColumns.includes(getColumnId(column)))}
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

