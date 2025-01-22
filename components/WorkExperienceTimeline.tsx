import { useState } from 'react'
import { format, formatDistance } from 'date-fns'
import { Briefcase, Calendar, MapPin, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { AddWorkExperienceModal } from '@/components/AddWorkExperienceModal'
import { deleteWorkExperience } from '@/lib/professional-history'
import type { WorkExperience } from '@/types'

interface Props {
  historyId: string
  experiences: WorkExperience[]
  onUpdate: () => void
}

export function WorkExperienceTimeline({ historyId, experiences, onUpdate }: Props) {
  const [selectedExperience, setSelectedExperience] = useState<WorkExperience | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [experienceToDelete, setExperienceToDelete] = useState<WorkExperience | null>(null)

  function handleEdit(experience: WorkExperience) {
    setSelectedExperience(experience)
    setIsAddModalOpen(true)
  }

  function handleDelete(experience: WorkExperience) {
    setExperienceToDelete(experience)
    setIsDeleteDialogOpen(true)
  }

  async function confirmDelete() {
    if (!experienceToDelete) return

    try {
      await deleteWorkExperience(experienceToDelete.id)
      onUpdate()
    } catch (error) {
      console.error('Failed to delete work experience:', error)
    } finally {
      setIsDeleteDialogOpen(false)
      setExperienceToDelete(null)
    }
  }

  if (experiences.length === 0) {
    return (
      <div className="text-center py-12">
        <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No work experience yet</h3>
        <p className="mt-2 text-muted-foreground">
          Add your professional experience to build your career timeline
        </p>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="mt-4"
        >
          Add Work Experience
        </Button>
      </div>
    )
  }

  return (
    <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
      {experiences.map((experience, index) => {
        const startDate = new Date(experience.start_date)
        const endDate = experience.end_date ? new Date(experience.end_date) : null
        const duration = endDate
          ? formatDistance(endDate, startDate)
          : formatDistance(new Date(), startDate)

        return (
          <div key={experience.id} className="relative flex items-start">
            <div className="absolute left-0 mt-1 h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-slate-500" />
            </div>

            <Card className="ml-16 flex-grow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{experience.title}</CardTitle>
                    <CardDescription>{experience.company}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(experience)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(experience)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(startDate, 'MMM yyyy')} -{' '}
                      {endDate ? format(endDate, 'MMM yyyy') : 'Present'}
                    </span>
                    <span className="text-xs">({duration})</span>
                  </div>
                  {experience.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{experience.location}</span>
                    </div>
                  )}
                  {experience.employment_type && (
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      <span>{experience.employment_type}</span>
                    </div>
                  )}
                </div>

                {experience.description && (
                  <div className="prose prose-sm max-w-none">
                    <p>{experience.description}</p>
                  </div>
                )}

                {experience.technologies && experience.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {experience.technologies.map((tech) => (
                      <div
                        key={tech}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs"
                      >
                        {tech}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )
      })}

      <AddWorkExperienceModal
        historyId={historyId}
        experience={selectedExperience || undefined}
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          setSelectedExperience(null)
        }}
        onSuccess={() => {
          onUpdate()
          setIsAddModalOpen(false)
          setSelectedExperience(null)
        }}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Work Experience</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this work experience? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 