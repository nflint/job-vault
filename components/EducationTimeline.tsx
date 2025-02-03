import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
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
import { AddEducationModal } from "@/components/AddEducationModal"
import type { Education } from "@/types"

interface EducationTimelineProps {
  historyId: string
  education: Education[]
  onUpdate: () => void
}

/**
 *
 * @param root0
 * @param root0.historyId
 * @param root0.education
 * @param root0.onUpdate
 */
export function EducationTimeline({ historyId, education, onUpdate }: EducationTimelineProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editEducation, setEditEducation] = useState<Education | null>(null)

  const sortedEducation = [...education].sort((a, b) => {
    return new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  })

  /**
   *
   * @param id
   */
  async function handleDelete(id: string) {
    try {
      const response = await fetch(`/api/education/${id}`, {
        method: "DELETE",
      })
      
      if (!response.ok) {
        throw new Error("Failed to delete education entry")
      }
      
      onUpdate()
    } catch (error) {
      console.error("Error deleting education:", error)
    } finally {
      setDeleteId(null)
    }
  }

  if (education.length === 0) {
    return (
      <div className="text-muted-foreground text-center py-8">
        No education history added yet. Click the button above to add your first entry.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sortedEducation.map((entry) => (
        <Card key={entry.id} className="p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">{entry.institution}</h3>
              <p className="text-muted-foreground">
                {entry.degree} in {entry.field}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(entry.start_date).getFullYear()} - {entry.end_date ? new Date(entry.end_date).getFullYear() : "Present"}
              </p>
              {entry.gpa && (
                <p className="text-sm">GPA: {entry.gpa}</p>
              )}
              {entry.achievements && entry.achievements.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold mb-2">Achievements</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {entry.achievements.map((achievement, index) => (
                      <li key={index} className="text-sm">{achievement}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditEducation(entry)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDeleteId(entry.id)}
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
              This action cannot be undone. This will permanently delete this education entry.
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

      <AddEducationModal
        open={!!editEducation}
        onOpenChange={() => setEditEducation(null)}
        historyId={historyId}
        education={editEducation || undefined}
        onSuccess={() => {
          setEditEducation(null)
          onUpdate()
        }}
      />
    </div>
  )
} 