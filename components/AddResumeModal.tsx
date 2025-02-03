"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  version: z.string().min(1, "Version is required"),
})

type FormValues = z.infer<typeof formSchema>

interface AddResumeModalProps {
  onSuccess?: () => void
}

/**
 *
 * @param root0
 * @param root0.onSuccess
 */
export function AddResumeModal({ onSuccess }: AddResumeModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      version: "1.0",
    },
  })

  /**
   *
   * @param values
   */
  async function onSubmit(values: FormValues) {
    try {
      setLoading(true)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      // Log the values that would be sent to the API
      console.log('New Resume:', {
        title: values.title,
        version: values.version,
        ranking: 0,
        user_id: 'test-user-1',
        date_created: new Date().toISOString(),
        last_modified: new Date().toISOString(),
      })

      form.reset()
      setOpen(false)
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error("Error adding resume:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add New Resume</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Resume</DialogTitle>
          <DialogDescription>
            Create a new resume entry. Fill out the details below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Software Engineer Resume" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="version"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Version</FormLabel>
                  <FormControl>
                    <Input placeholder="1.0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Resume"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 