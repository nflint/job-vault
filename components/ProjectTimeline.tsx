import { useState } from 'react'
import { Project } from '@/types'
import { projectsService } from '@/lib/projects'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { AddProjectModal } from '@/components/AddProjectModal'

interface ProjectTimelineProps {
  projects: Project[]
  onProjectDeleted: (projectId: string) => void
  onProjectUpdated: () => void
}

export default function ProjectTimeline({ projects, onProjectDeleted, onProjectUpdated }: ProjectTimelineProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [editProject, setEditProject] = useState<Project | null>(null)

  const handleDeleteProject = async (projectId: string) => {
    try {
      setIsDeleting(projectId)
      await projectsService.delete(projectId)
      onProjectDeleted(projectId)
      toast.success('Project deleted successfully')
    } catch (error) {
      if (error instanceof Error && 'errorResult' in error) {
        const { message } = error.errorResult as { message: string }
        toast.error(message)
      } else {
        toast.error('Failed to delete project')
        console.error('[DELETE_PROJECT]', error)
      }
    } finally {
      setIsDeleting(null)
    }
  }

  // Sort projects by start date descending
  const sortedProjects = [...projects].sort((a, b) => {
    const dateA = a.start_date ? new Date(a.start_date).getTime() : 0
    const dateB = b.start_date ? new Date(b.start_date).getTime() : 0
    return dateB - dateA
  })

  if (projects.length === 0) {
    return (
      <div className="text-muted-foreground text-center py-8">
        No projects added yet. Click the button above to add your first project.
      </div>
    )
  }

  return (
    <>
      <div className="relative space-y-4">
        {/* Timeline line */}
        <div className="absolute left-2 top-4 bottom-4 w-px bg-border" />

        {sortedProjects.map((project) => (
          <div key={project.id} className="relative pl-8">
            {/* Timeline dot */}
            <div className="absolute left-0 top-4 w-4 h-4 rounded-full bg-primary" />

            <Card className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{project.name}</h3>
                    {project.url && (
                      <Badge variant="outline" className="hover:bg-accent">
                        <a 
                          href={project.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs"
                        >
                          View Live Project
                        </a>
                      </Badge>
                    )}
                  </div>
                  {project.description && (
                    <p className="text-muted-foreground">{project.description}</p>
                  )}
                  {(project.start_date || project.end_date) && (
                    <p className="text-sm text-muted-foreground">
                      {project.start_date && format(new Date(project.start_date), 'MMM yyyy')}
                      {project.end_date && ` - ${format(new Date(project.end_date), 'MMM yyyy')}`}
                      {project.start_date && !project.end_date && ' - Present'}
                    </p>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditProject(project)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteProject(project.id)}
                    disabled={isDeleting === project.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      <AddProjectModal
        open={!!editProject}
        onOpenChange={() => setEditProject(null)}
        project={editProject || undefined}
        onSuccess={() => {
          setEditProject(null)
          onProjectUpdated()
        }}
      />
    </>
  )
}