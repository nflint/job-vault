import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { projectsService } from '@/lib/projects'
import { getProfessionalHistory } from '@/lib/professional-history'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import type { Project } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  url: z.string().url('Invalid URL').optional().or(z.literal('')),
  technologies: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
})

type ProjectFormValues = z.infer<typeof projectSchema>

interface AddProjectModalProps {
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: () => void
  project?: Project
}

export function AddProjectModal({ 
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  onSuccess,
  project
}: AddProjectModalProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [historyId, setHistoryId] = useState<string | null>(null)

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project?.name || '',
      description: project?.description || '',
      url: project?.url || '',
      technologies: project?.technologies ? project.technologies.join(', ') : '',
      start_date: project?.start_date || '',
      end_date: project?.end_date || '',
    },
  })

  useEffect(() => {
    if (project) {
      form.reset({
        name: project.name,
        description: project.description || '',
        url: project.url || '',
        technologies: project.technologies ? project.technologies.join(', ') : '',
        start_date: project.start_date || '',
        end_date: project.end_date || '',
      })
      setHistoryId(project.history_id)
    } else {
      loadHistory()
    }
  }, [project, form])

  async function loadHistory() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('Please sign in to add projects')
        return
      }

      const history = await getProfessionalHistory(user.id)
      setHistoryId(history.id)
    } catch (error) {
      console.error('Failed to load professional history:', error)
      toast.error('Failed to load professional history')
    }
  }

  const isControlled = controlledOpen !== undefined && setControlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : open
  const setIsOpen = isControlled ? setControlledOpen : setOpen

  const onSubmit = async (data: ProjectFormValues) => {
    if (!historyId) {
      toast.error('Professional history not found')
      return
    }

    try {
      setIsSubmitting(true)
      const technologies = data.technologies?.split(',').map((t: string) => t.trim()).filter(Boolean) || []

      if (project) {
        await projectsService.update(project.id, {
          ...data,
          technologies,
        })
        toast.success('Project updated successfully')
      } else {
        await projectsService.create({
          ...data,
          history_id: historyId,
          source: 'manual',
          technologies,
        })
        toast.success('Project created successfully')
      }
      
      form.reset()
      setIsOpen(false)
      onSuccess?.()
    } catch (error) {
      if (error instanceof Error && 'errorResult' in error) {
        const { message } = error.errorResult as { message: string }
        toast.error(message)
      } else {
        toast.error(project ? 'Failed to update project' : 'Failed to create project')
        console.error(project ? '[UPDATE_PROJECT]' : '[CREATE_PROJECT]', error)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{project ? 'Edit Project' : 'Add Project'}</DialogTitle>
          <DialogDescription>
            {project ? 'Update your project details' : 'Add a new project to your portfolio'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project URL</FormLabel>
                  <FormControl>
                    <Input {...field} type="url" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="technologies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technologies (comma-separated)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="React, TypeScript, Node.js" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (project ? 'Updating...' : 'Creating...') : (project ? 'Update Project' : 'Create Project')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}