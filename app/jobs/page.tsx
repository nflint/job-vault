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
import type { ColumnDef } from "@tanstack/react-table"
import { AddJobModal } from "@/components/AddJobModal"
import { EditJobModal } from "@/components/EditJobModal"
import { InlineEdit } from "@/components/InlineEdit"

interface Job {
  id: number
  position: string
  company: string
  maxSalary: string
  location: string
  status: string
  dateSaved: string
  deadline: string
  dateApplied: string
  followUp: string
  excitement: number
}

function handleSaveJob(updatedJob: Job) {
  console.log("Saving job:", updatedJob)
  return (prevJobs: Job[]) => prevJobs.map((job) => (job.id === updatedJob.id ? updatedJob : job))
}

const stages = [
  { name: "BOOKMARKED", count: 3 },
  { name: "APPLYING", count: 0 },
  { name: "APPLIED", count: 0 },
  { name: "INTERVIEWING", count: 0 },
  { name: "NEGOTIATING", count: 0 },
  { name: "ACCEPTED", count: 0 },
]

const columns: ColumnDef<Job>[] = [
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
          table.options.meta?.updateData(handleSaveJob(updatedJob))
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
          table.options.meta?.updateData(handleSaveJob(updatedJob))
        }}
      />
    ),
  },
  {
    accessorKey: "maxSalary",
    header: "Max Salary",
    cell: ({ row, table }) => (
      <InlineEdit
        value={row.original.maxSalary}
        onSave={(value) => {
          const updatedJob = { ...row.original, maxSalary: value }
          table.options.meta?.updateData(handleSaveJob(updatedJob))
        }}
      />
    ),
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row, table }) => (
      <InlineEdit
        value={row.original.location}
        onSave={(value) => {
          const updatedJob = { ...row.original, location: value }
          table.options.meta?.updateData(handleSaveJob(updatedJob))
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
          const updatedJob = { ...row.original, status: value }
          table.options.meta?.updateData(handleSaveJob(updatedJob))
        }}
      />
    ),
  },
  {
    accessorKey: "dateSaved",
    header: "Date Saved",
  },
  {
    accessorKey: "deadline",
    header: "Deadline",
    cell: ({ row, column, table }) => (
      <InlineEdit
        value={row.original.deadline}
        onSave={(value) => {
          const updatedJob = { ...row.original, deadline: value }
          table.options.meta?.updateData(handleSaveJob(updatedJob))
        }}
      />
    ),
  },
  {
    accessorKey: "dateApplied",
    header: "Date Applied",
  },
  {
    accessorKey: "followUp",
    header: "Follow up",
    cell: ({ row, column, table }) => (
      <InlineEdit
        value={row.original.followUp}
        onSave={(value) => {
          const updatedJob = { ...row.original, followUp: value }
          table.options.meta?.updateData(handleSaveJob(updatedJob))
        }}
      />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <EditJobModal job={row.original} onSave={handleSaveJob} />,
  },
]

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: 1,
      position: "Marketing Manager - Sample Job",
      company: "Acme Corp",
      maxSalary: "$80,000",
      location: "New York, NY",
      status: "Applied",
      dateSaved: "01/09/2025",
      deadline: "02/15/2025",
      dateApplied: "01/15/2025",
      followUp: "01/22/2025",
      excitement: 4,
    },
    {
      id: 2,
      position: "Product Designer - Sample Job",
      company: "Tech Innovations",
      maxSalary: "$95,000",
      location: "Remote",
      status: "Interviewing",
      dateSaved: "01/10/2025",
      deadline: "02/28/2025",
      dateApplied: "01/18/2025",
      followUp: "01/25/2025",
      excitement: 5,
    },
    {
      id: 3,
      position: "Operations Manager - Sample Job",
      company: "Global Logistics",
      maxSalary: "$75,000",
      location: "Chicago, IL",
      status: "Bookmarked",
      dateSaved: "01/12/2025",
      deadline: "03/01/2025",
      dateApplied: "N/A",
      followUp: "N/A",
      excitement: 3,
    },
    {
      id: 4,
      position: "Software Engineer - Sample Job",
      company: "CodeCraft Solutions",
      maxSalary: "$120,000",
      location: "San Francisco, CA",
      status: "Offered",
      dateSaved: "01/05/2025",
      deadline: "01/31/2025",
      dateApplied: "01/08/2025",
      followUp: "01/20/2025",
      excitement: 5,
    },
    {
      id: 5,
      position: "Data Analyst - Sample Job",
      company: "DataDriven Insights",
      maxSalary: "$85,000",
      location: "Boston, MA",
      status: "Rejected",
      dateSaved: "01/07/2025",
      deadline: "02/10/2025",
      dateApplied: "01/12/2025",
      followUp: "01/19/2025",
      excitement: 2,
    },
    {
      id: 6,
      position: "UX Researcher - Sample Job",
      company: "User First Design",
      maxSalary: "$90,000",
      location: "Austin, TX",
      status: "Applying",
      dateSaved: "01/14/2025",
      deadline: "02/20/2025",
      dateApplied: "N/A",
      followUp: "N/A",
      excitement: 4,
    },
  ])

  const [selectedJobs, setSelectedJobs] = useState<number[]>([])

  const defaultColumns = columns.map((column) => getColumnId(column))
  const [selectedColumns, setSelectedColumns] = useState<string[]>(defaultColumns)

  useEffect(() => {
    const savedColumns = localStorage.getItem("selectedColumns")
    if (savedColumns) {
      setSelectedColumns(JSON.parse(savedColumns))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("selectedColumns", JSON.stringify(selectedColumns))
  }, [selectedColumns])

  function getColumnId(column: ColumnDef<Job>): string {
    return typeof column.id === "string" ? column.id : (column.accessorKey as string) || `column-${column.header}`
  }

  return (
    <div className="space-y-6 p-6">
      <StatusPipeline jobs={jobs} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Checkbox checked={selectedJobs.length > 0} onCheckedChange={() => setSelectedJobs([])} />
            <span className="text-sm text-muted-foreground">{selectedJobs.length} selected</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                Group by: None
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>None</DropdownMenuItem>
              <DropdownMenuItem>Status</DropdownMenuItem>
              <DropdownMenuItem>Company</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns
              </Button>
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
          <Button variant="outline" size="icon">
            <Menu className="h-4 w-4" />
          </Button>
          <AddJobModal />
        </div>
      </div>

      <DataTable
        columns={columns.filter((column) => selectedColumns.includes(getColumnId(column)))}
        data={jobs}
        meta={{
          updateData: setJobs,
        }}
      />
    </div>
  )
}

