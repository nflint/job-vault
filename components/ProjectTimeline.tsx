import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Link as LinkIcon } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AddProjectModal } from "@/components/AddProjectModal"
import type { Project } from "@/types"

interface ProjectTimelineProps {
  historyId: string
  projects: Project[]
  onUpdate: () => void
}

export function ProjectTimeline({ historyId, projects, onUpdate }: ProjectTimelineProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editProject, setEditProject] = useState<Project | null>(null)

  console.log('ProjectTimeline received:', {
    historyId,
    projectCount: projects.length,
    projects: projects.map(p => ({
      id: p.id,
      name: p.name,
      technologies: p.technologies
    }))
  })

  const sortedProjects = [...projects].sort((a, b) => {
    if (!a.start_date && !b.start_date) return 0
    if (!a.start_date) return 1
    if (!b.start_date) return -1
    return new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  })

  async function handleDelete(id: string) {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      })
      
      if (!response.ok) {
        throw new Error("Failed to delete project")
      }
      
      onUpdate()
    } catch (error) {
      console.error("Error deleting project:", error)
    } finally {
      setDeleteId(null)
    }
  }

  if (projects.length === 0) {
    return (
      <div className="text-muted-foreground text-center py-8">
        No projects added yet. Click the button above to add your first project.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sortedProjects.map((project) => (
        <Card key={project.id} className="p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{project.name}</h3>
                {project.url && (
                  <a 
                    href={project.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <LinkIcon className="h-4 w-4" />
                  </a>
                )}
              </div>
              {project.description && (
                <p className="text-muted-foreground">{project.description}</p>
              )}
              {(project.start_date || project.end_date) && (
                <p className="text-sm text-muted-foreground">
                  {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'Ongoing'} 
                  {project.end_date && ` - ${new Date(project.end_date).toLocaleDateString()}`}
                </p>
              )}
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {Array.isArray(project.technologies) ? (
                    project.technologies.map((tech, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                      >
                        {tech}
                      </span>
                    ))
                  ) : (
                    <span 
                      className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                    >
                      {project.technologies}
                    </span>
                  )}
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
                onClick={() => setDeleteId(project.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AddProjectModal
        open={!!editProject}
        onOpenChange={() => setEditProject(null)}
        historyId={historyId}
        project={editProject || undefined}
        onSuccess={() => {
          setEditProject(null)
          onUpdate()
        }}
      />
    </div>
  )
} 