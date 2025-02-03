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

/**
 *
 * @param root0
 * @param root0.jobs
 */
export function StatusPipeline({ jobs }: StatusPipelineProps) {
  const statusCounts = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const statuses: string[] = ['saved', 'applied', 'interviewing', 'offered', 'rejected', 'accepted']

  /**
   *
   * @param count
   */
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
        <div key={status} className="status-card">
          <div className="status-header">
            <span className="status-label">{status}</span>
            <span className="status-value">
              {statusCounts[status] || 0}
            </span>
          </div>
          <div className="progress-bar">
            <div
              className={cn(
                "progress-indicator",
                getProgressWidth(statusCounts[status] || 0)
              )}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

