import { useState } from "react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Award, ExternalLink, Trash2 } from "lucide-react"
import { AddCertificationModal } from "@/components/AddCertificationModal"
import type { Certification } from "@/types"
import { supabase } from "@/lib/supabase"

interface CertificationTimelineProps {
  historyId: string
  certifications: Certification[]
  onUpdate: () => void
}

/**
 *
 * @param root0
 * @param root0.historyId
 * @param root0.certifications
 * @param root0.onUpdate
 */
export function CertificationTimeline({
  historyId,
  certifications,
  onUpdate,
}: CertificationTimelineProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingCertification, setEditingCertification] = useState<Certification | undefined>()

  /**
   *
   * @param certificationId
   */
  async function handleDelete(certificationId: string) {
    try {
      // Get the session
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error("Not authenticated - Please log in again")
      }

      const response = await fetch(`/api/certifications/${certificationId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`Failed to delete certification: ${errorData}`)
      }

      onUpdate()
    } catch (error) {
      console.error("Error deleting certification:", error)
      throw error
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Certifications</h3>
        <Button onClick={() => {
          setEditingCertification(undefined)
          setIsAddModalOpen(true)
        }}>
          Add Certification
        </Button>
      </div>

      {certifications.length === 0 ? (
        <Card className="p-6 text-center text-muted-foreground">
          <Award className="mx-auto h-12 w-12 mb-4" />
          <p>No certifications added yet.</p>
          <p className="text-sm">Add your professional certifications to showcase your expertise.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {certifications.map((cert) => (
            <Card key={cert.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{cert.name}</h4>
                    <Badge variant="secondary">{cert.issuer}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Issued: {format(new Date(cert.issue_date), "MMMM yyyy")}
                    {cert.expiration_date && (
                      <> · Expires: {format(new Date(cert.expiration_date), "MMMM yyyy")}</>
                    )}
                  </p>
                  {cert.credential_id && (
                    <p className="text-sm">Credential ID: {cert.credential_id}</p>
                  )}
                  {cert.credential_url && (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline inline-flex items-center space-x-1"
                    >
                      <span>View Credential</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingCertification(cert)
                      setIsAddModalOpen(true)
                    }}
                  >
                    <Award className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(cert.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AddCertificationModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        historyId={historyId}
        certification={editingCertification}
        onSuccess={onUpdate}
      />
    </div>
  )
} 