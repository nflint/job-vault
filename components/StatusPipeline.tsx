"use client"

import { useMemo } from "react"

interface StatusStage {
  name: string
  count: number
}

interface StatusPipelineProps {
  jobs: Array<{ status: string }>
}

export function StatusPipeline({ jobs }: StatusPipelineProps) {
  const stages = useMemo(() => {
    const statusCounts: Record<string, number> = {
      Bookmarked: 0,
      Applying: 0,
      Applied: 0,
      Interviewing: 0,
      Offered: 0,
      Rejected: 0,
    }

    jobs.forEach((job) => {
      const status = job.status.toLowerCase()
      if (status in statusCounts) {
        statusCounts[status]++
      }
    })

    return Object.entries(statusCounts).map(([name, count]) => ({ name, count }))
  }, [jobs])

  return (
    <div className="flex w-full border rounded-lg overflow-hidden divide-x">
      {stages.map((stage, index) => (
        <div key={stage.name} className={`flex-1 p-4 text-center ${index === 0 ? "bg-muted/10" : "bg-background"}`}>
          <div className="font-bold">{stage.count}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider">{stage.name}</div>
        </div>
      ))}
    </div>
  )
}

