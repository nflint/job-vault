/**
 * @fileoverview Projects page component that displays a timeline of user projects
 * Implements project management functionality with add, edit, and delete capabilities
 */

import { Suspense } from 'react'
import { projectsService } from '@/lib/projects'
import ProjectTimeline from '@/components/ProjectTimeline'
import { AddProjectModal } from '@/components/AddProjectModal'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

/**
 * Projects page component that displays and manages user projects
 * Includes project timeline and project management functionality
 * 
 * @returns {Promise<JSX.Element>} Rendered projects page with timeline and management options
 * 
 * @throws {Error} When project data cannot be fetched
 * 
 * @example
 * // In app routing:
 * <Route path="/projects" component={ProjectsPage} />
 */
export default async function ProjectsPage(): Promise<JSX.Element> {
  try {
    const projects = await projectsService.list()

    return (
      <div className="container mx-auto py-8">
        {/* Header with Add Project Button */}
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

        {/* Project Timeline with Loading State */}
        <Suspense fallback={<div>Loading projects...</div>}>
          <ProjectTimeline 
            projects={projects} 
            onProjectDeleted={(projectId: string) => {
              toast.success('Project deleted successfully')
            }}
            onProjectUpdated={() => {
              toast.success('Project updated successfully')
            }}
          />
        </Suspense>
      </div>
    )
  } catch (error) {
    // Error handling with type checking
    if (error instanceof Error && 'errorResult' in error) {
      const { message } = error.errorResult as { message: string }
      toast.error(message)
    } else {
      toast.error('Failed to load projects')
      console.error('[PROJECTS_PAGE]', error)
    }

    // Fallback error UI
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