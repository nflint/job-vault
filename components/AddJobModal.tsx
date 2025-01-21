'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from 'lucide-react'
import { jobsService } from '@/lib/jobs'
import type { Job } from '@/types'

interface AddJobModalProps {
  onJobAdded?: () => void
}

export function AddJobModal({ onJobAdded }: AddJobModalProps) {
  const [open, setOpen] = useState(false)
  const [jobData, setJobData] = useState({
    position: '',
    company: '',
    max_salary: '',
    location: '',
    status: 'BOOKMARKED' as const,
    deadline: '',
    date_applied: null,
    follow_up: null,
    excitement: 0
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setJobData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await jobsService.create(jobData)
      setOpen(false)
      // Reset form
      setJobData({
        position: '',
        company: '',
        max_salary: '',
        location: '',
        status: 'BOOKMARKED' as const,
        deadline: '',
        date_applied: null,
        follow_up: null,
        excitement: 0
      })
      onJobAdded?.()
    } catch (error) {
      console.error('Error creating job:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add a New Job
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Job</DialogTitle>
          <DialogDescription>
            Enter the details of the new job application. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="position" className="text-right">
                Position
              </Label>
              <Input
                id="position"
                name="position"
                value={jobData.position}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company" className="text-right">
                Company
              </Label>
              <Input
                id="company"
                name="company"
                value={jobData.company}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="max_salary" className="text-right">
                Max Salary
              </Label>
              <Input
                id="max_salary"
                name="max_salary"
                value={jobData.max_salary}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input
                id="location"
                name="location"
                value={jobData.location}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="deadline" className="text-right">
                Deadline
              </Label>
              <Input
                id="deadline"
                name="deadline"
                type="date"
                value={jobData.deadline}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Job</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

