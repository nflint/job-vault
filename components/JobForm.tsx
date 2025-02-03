'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

/**
 *
 */
export default function JobForm() {
  const [job, setJob] = useState({
    role: '',
    company: '',
    description: '',
    link: '',
    status: 'saved',
    notes: '',
    rating: '',
    email: '',
    source: '',
  })

  /**
   *
   * @param e
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement job submission logic
    console.log('Submitting job:', job)
    // Reset form
    setJob({
      role: '',
      company: '',
      description: '',
      link: '',
      status: 'saved',
      notes: '',
      rating: '',
      email: '',
      source: '',
    })
  }

  /**
   *
   * @param e
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setJob(prevJob => ({ ...prevJob, [name]: value }))
  }

  /**
   *
   * @param value
   */
  const handleStatusChange = (value: string) => {
    setJob(prevJob => ({ ...prevJob, status: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Add New Job</h2>
      <div>
        <Label htmlFor="role">Role</Label>
        <Input
          id="role"
          name="role"
          value={job.role}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          name="company"
          value={job.company}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={job.description}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="link">Link</Label>
        <Input
          id="link"
          name="link"
          type="url"
          value={job.link}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select onValueChange={handleStatusChange} defaultValue={job.status}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="saved">Saved</SelectItem>
            <SelectItem value="applied">Applied</SelectItem>
            <SelectItem value="interviewing">Interviewing</SelectItem>
            <SelectItem value="offered">Offered</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={job.notes}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="rating">Rating (1-5)</Label>
        <Input
          id="rating"
          name="rating"
          type="number"
          min="1"
          max="5"
          value={job.rating}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="email">Contact Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={job.email}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="source">Source</Label>
        <Input
          id="source"
          name="source"
          value={job.source}
          onChange={handleChange}
        />
      </div>
      <Button type="submit">Add Job</Button>
    </form>
  )
}

