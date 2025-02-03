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
import { useToast } from "@/hooks/use-toast"

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
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      position: "",
      company: "",
      description: "",
      max_salary: "",
      location: "",
      status: "BOOKMARKED",
      rating: 0,
      deadline: null,
      date_applied: null,
      follow_up: null,
    },
  })

  async function onSubmit(values: FormValues) {
    try {
      setIsSubmitting(true)
      
      // Convert empty strings to null for date fields
      const formattedValues = {
        ...values,
        deadline: values.deadline || null,
        date_applied: values.date_applied || null,
        follow_up: values.follow_up || null,
        rating: Number(values.rating), // Ensure rating is a number
      }
      
      await jobsService.create(formattedValues)
      
      // Show success toast
      toast({
        title: "Job Added",
        description: "The job has been successfully added to your list.",
      })
      
      setOpen(false)
      form.reset()
      onJobAdded?.()
      
    } catch (error) {
      // Handle error with proper error message
      const message = error instanceof Error && 'errorResult' in error
        ? error.message // Use our handled error message
        : 'Failed to add job. Please try again.'

      // Show error toast
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Job
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Job</DialogTitle>
          <DialogDescription>
            Add a new job to track in your job search.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Senior Software Engineer" {...field} />
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
                    <Input placeholder="e.g. Tech Corp" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Job description or notes"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="max_salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Salary</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 120000" {...field} />
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
                      <Input placeholder="e.g. Remote, New York" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <StarRating
                      rating={field.value}
                      onRatingChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadline</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value || ''} />
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
                      <Input type="date" {...field} value={field.value || ''} />
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
                    <FormLabel>Follow Up</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
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

