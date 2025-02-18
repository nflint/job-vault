"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Briefcase, GraduationCap, FolderKanban, Award } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { WorkExperienceTimeline } from "@/components/WorkExperienceTimeline"
import { AddWorkExperienceModal } from "@/components/AddWorkExperienceModal"
import { EducationTimeline } from "@/components/EducationTimeline"
import { AddEducationModal } from "@/components/AddEducationModal"
import { getProfessionalHistory, createProfessionalHistory, getWorkExperiences, getEducation, getProjects, getCertifications } from "@/lib/professional-history"
import type { ProfessionalHistory, WorkExperience, Education, Project, Certification } from "@/types"
import ProjectTimeline from "@/components/ProjectTimeline"
import { AddProjectModal } from "@/components/AddProjectModal"
import { CertificationTimeline } from "@/components/CertificationTimeline"

console.log("=== Professional History Page Rendering ===")

/**
 *
 */
export default function ProfessionalHistoryPage() {
  const [activeTab, setActiveTab] = useState("certifications")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<ProfessionalHistory | null>(null)
  const [experiences, setExperiences] = useState<WorkExperience[]>([])
  const [education, setEducation] = useState<Education[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [isAddWorkModalOpen, setIsAddWorkModalOpen] = useState(false)
  const [isAddEducationModalOpen, setIsAddEducationModalOpen] = useState(false)
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  /**
   *
   */
  async function loadData() {
    console.log("Starting loadData")
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.error('No user found')
        window.location.href = '/login'
        return
      }
      console.log('User found:', user.id)

      // Get or create professional history
      let userHistory: ProfessionalHistory
      try {
        console.log('Attempting to get professional history for user:', user.id)
        userHistory = await getProfessionalHistory(user.id)
        console.log('Found existing professional history:', userHistory)
      } catch (e) {
        if (e instanceof Error && e.message === 'No professional history found') {
          console.log('Creating new professional history for user:', user.id)
          userHistory = await createProfessionalHistory(user.id)
          console.log('Created new professional history:', userHistory)
        } else {
          throw e
        }
      }

      setHistory(userHistory)

      // Load all data
      const [experiencesData, educationData, projectsData, certificationsData] = await Promise.all([
        getWorkExperiences(userHistory.id),
        getEducation(userHistory.id),
        getProjects(userHistory.id),
        getCertifications(userHistory.id)
      ])

      console.log('Loaded data:', {
        experiences: experiencesData,
        education: educationData,
        projects: projectsData,
        certifications: certificationsData
      })

      setExperiences(experiencesData)
      setEducation(educationData)
      setProjects(projectsData)
      setCertifications(certificationsData)
      setLoading(false)
    } catch (e) {
      console.error('Error loading data:', e)
      setError(e instanceof Error ? e.message : 'An unknown error occurred')
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="space-y-4">
          <div className="skeleton h-8 w-[200px]"></div>
          <div className="skeleton h-[400px]"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-destructive/15 text-destructive p-4 rounded-md">
          {error}
        </div>
      </div>
    )
  }

  if (!history) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-destructive/15 text-destructive p-4 rounded-md">
          Failed to load professional history
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Professional History</h1>
        {activeTab === "experience" && (
          <Button variant="outline" onClick={() => setIsAddWorkModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Experience
          </Button>
        )}
        {activeTab === "education" && (
          <Button variant="outline" onClick={() => setIsAddEducationModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Education
          </Button>
        )}
        {activeTab === "projects" && (
          <Button variant="outline" onClick={() => setIsAddProjectModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs defaultValue="experience" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="experience" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Experience
              </TabsTrigger>
              <TabsTrigger value="education" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Education
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-2">
                <FolderKanban className="h-4 w-4" />
                Projects
              </TabsTrigger>
              <TabsTrigger value="certifications" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Certifications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="experience" className="mt-6">
              <WorkExperienceTimeline
                historyId={history.id}
                experiences={experiences}
                onUpdate={loadData}
              />
            </TabsContent>

            <TabsContent value="education" className="mt-6">
              <EducationTimeline
                historyId={history.id}
                education={education}
                onUpdate={loadData}
              />
            </TabsContent>

            <TabsContent value="projects" className="mt-6">
              <ProjectTimeline
                projects={projects}
                onProjectDeleted={async (projectId) => {
                  await loadData()
                }}
              />
            </TabsContent>

            <TabsContent value="certifications" className="mt-6">
              <CertificationTimeline
                historyId={history?.id || ''}
                certifications={certifications}
                onUpdate={loadData}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AddWorkExperienceModal
        open={isAddWorkModalOpen}
        onOpenChange={setIsAddWorkModalOpen}
        historyId={history?.id}
        onSuccess={loadData}
      />

      <AddEducationModal
        open={isAddEducationModalOpen}
        onOpenChange={setIsAddEducationModalOpen}
        historyId={history?.id}
        onSuccess={loadData}
      />

      <AddProjectModal
        open={isAddProjectModalOpen}
        onOpenChange={setIsAddProjectModalOpen}
        onSuccess={loadData}
      />
    </div>
  )
} 