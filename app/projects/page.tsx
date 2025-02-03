import { Suspense } from 'react'
import { projectsService } from '@/lib/projects'
import ProjectTimeline from '@/components/ProjectTimeline'
import { AddProjectModal } from '@/components/AddProjectModal'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

export default async function ProjectsPage() {
  try {
    const projects = await projectsService.list()

    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Projects</h1>
          <AddProjectModal
            trigger={
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            }
          />
        </div>

        <Suspense fallback={<div>Loading projects...</div>}>
          <ProjectTimeline 
            projects={projects} 
            onProjectDeleted={(projectId: string) => {
              toast.success('Project deleted successfully')
            }}
          />
        </Suspense>
      </div>
    )
  } catch (error) {
    if (error instanceof Error && 'errorResult' in error) {
      const { message } = error.errorResult as { message: string }
      toast.error(message)
    } else {
      toast.error('Failed to load projects')
      console.error('[PROJECTS_PAGE]', error)
    }

    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Projects</h1>
          <AddProjectModal
            trigger={
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            }
          />
        </div>

        <div className="text-center py-8 text-muted-foreground">
          Failed to load projects. Please try again later.
        </div>
      </div>
    )
  }
} 