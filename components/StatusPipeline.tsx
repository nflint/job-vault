"use client"

import { useMemo } from "react"
import { cn } from "@/lib/utils"

interface StatusStage {
  name: string
  count: number
}

interface StatusPipelineProps {
  jobs: Array<{ status: string }>
}

export function StatusPipeline({ jobs }: StatusPipelineProps) {
  const statusCounts = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const statuses: string[] = ['saved', 'applied', 'interviewing', 'offered', 'rejected', 'accepted']

  function getProgressWidth(count: number): string {
    if (jobs.length === 0) return 'w-0'
    const percentage = (count / jobs.length) * 100
    if (percentage <= 0) return 'w-0'
    if (percentage <= 25) return 'w-1/4'
    if (percentage <= 50) return 'w-1/2'
    if (percentage <= 75) return 'w-3/4'
    return 'w-full'
  }

  return (
    <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-3 lg:grid-cols-6">
      {statuses.map((status) => (
        <div
          key={status}
          className="flex flex-col space-y-2 rounded-lg border bg-card/50 p-4 transition-colors hover:bg-card"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground capitalize">{status}</span>
            <span className="font-mono text-2xl font-bold text-primary">
              {statusCounts[status] || 0}
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full bg-primary transition-all",
                getProgressWidth(statusCounts[status] || 0)
              )}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

