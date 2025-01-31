'use client'

import { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus } from 'lucide-react'
import { jobsService } from '@/lib/jobs'
import { StarRating } from "@/components/StarRating"
import type { Job, JobStatus } from '@/types'
import { parseISO, isValid } from 'date-fns'

const formSchema = z.object({
  position: z.string().min(1, "Position is required"),
  company: z.string().min(1, "Company is required"),
  description: z.string().optional(),
  max_salary: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(["BOOKMARKED", "APPLYING", "APPLIED", "INTERVIEWING", "NEGOTIATING", "ACCEPTED"] as const).default("BOOKMARKED"),
  rating: z.number().min(0).max(5).default(0),
  deadline: z.string().nullable().refine((val) => {
    if (!val) return true;
    return isValid(parseISO(val));
  }, "Invalid date format").default(null),
  date_applied: z.string().nullable().refine((val) => {
    if (!val) return true;
    return isValid(parseISO(val));
  }, "Invalid date format").default(null),
  follow_up: z.string().nullable().refine((val) => {
    if (!val) return true;
    return isValid(parseISO(val));
  }, "Invalid date format").default(null),
})

type FormValues = z.infer<typeof formSchema>

interface AddJobModalProps {
  onJobAdded?: () => void
}

export function AddJobModal({ onJobAdded }: AddJobModalProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      position: '',
      company: '',
      description: '',
      max_salary: '',
      location: '',
      status: 'BOOKMARKED',
      rating: 0,
      deadline: null,
      date_applied: null,
      follow_up: null,
    },
  })

  async function onSubmit(values: FormValues) {
    try {
      setIsSubmitting(true)
      console.log('1. Form submitted with values:', values)
      
      // Convert empty strings to null for date fields
      const formattedValues = {
        ...values,
        deadline: values.deadline || null,
        date_applied: values.date_applied || null,
        follow_up: values.follow_up || null,
        rating: Number(values.rating), // Ensure rating is a number
      }
      
      console.log('2. Formatted values:', formattedValues)
      console.log('3. Calling jobsService.create...')
      
      let result;
      try {
        result = await jobsService.create(formattedValues)
        console.log('4. Job created successfully:', result)
      } catch (createError) {
        console.error('4a. Error from jobsService.create:', createError)
        throw createError
      }
      
      console.log('5. Closing modal and resetting form...')
      setOpen(false)
      form.reset()
      
      console.log('6. Calling onJobAdded callback...')
      onJobAdded?.()
      
      console.log('7. Job creation process completed successfully')
    } catch (error) {
      console.error('8. Error in form submission:', error)
      
      // Log the full error object
      if (error instanceof Error) {
        console.error('9. Error details:', {
          message: error.message,
          name: error.name,
          stack: error.stack,
        })
      } else {
        console.error('9. Unknown error type:', error)
      }
      
      // Show a more detailed error message to the user
      const errorMessage = error instanceof Error ? 
        `Failed to create job: ${error.message}` : 
        'Failed to create job: Unknown error'
      console.error('10. Showing error message to user:', errorMessage)
      alert(errorMessage)
    } finally {
      console.log('11. Setting isSubmitting to false')
      setIsSubmitting(false)
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
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Job</DialogTitle>
          <DialogDescription>
            Enter the details of the new job opportunity. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input placeholder="Job title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input placeholder="Company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="City, State or Remote" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating</FormLabel>
                      <FormControl>
                        <StarRating
                          rating={field.value}
                          onRatingChange={field.onChange}
                          editable
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="BOOKMARKED">Bookmarked</SelectItem>
                          <SelectItem value="APPLYING">Applying</SelectItem>
                          <SelectItem value="APPLIED">Applied</SelectItem>
                          <SelectItem value="INTERVIEWING">Interviewing</SelectItem>
                          <SelectItem value="NEGOTIATING">Negotiating</SelectItem>
                          <SelectItem value="ACCEPTED">Accepted</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="max_salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Salary</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. $120,000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Full Width Fields */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the job description..."
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date Fields */}
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Application Deadline</FormLabel>
                    <FormControl>
                      <Input 
                        type="date"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date_applied"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date Applied</FormLabel>
                    <FormControl>
                      <Input 
                        type="date"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="follow_up"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Follow-up Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Job"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

