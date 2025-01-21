"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Briefcase, GraduationCap, FolderKanban, Award } from "lucide-react"

export default function ProfessionalHistoryPage() {
  const [activeTab, setActiveTab] = useState("experience")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/login'
        return
      }
      setLoading(false)
    } catch (err) {
      console.error('Error checking auth:', err)
      setError('Failed to load profile data')
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Professional History</h1>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Entry
        </Button>
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
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Work Experience</h2>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Experience
                  </Button>
                </div>
                {/* Experience content will be loaded here */}
                <div className="text-muted-foreground text-center py-8">
                  No work experience added yet. Click the button above to add your first entry.
                </div>
              </div>
            </TabsContent>

            <TabsContent value="education" className="mt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Education</h2>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Education
                  </Button>
                </div>
                {/* Education content will be loaded here */}
                <div className="text-muted-foreground text-center py-8">
                  No education history added yet. Click the button above to add your first entry.
                </div>
              </div>
            </TabsContent>

            <TabsContent value="projects" className="mt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Projects</h2>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Project
                  </Button>
                </div>
                {/* Projects content will be loaded here */}
                <div className="text-muted-foreground text-center py-8">
                  No projects added yet. Click the button above to add your first project.
                </div>
              </div>
            </TabsContent>

            <TabsContent value="certifications" className="mt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Certifications</h2>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Certification
                  </Button>
                </div>
                {/* Certifications content will be loaded here */}
                <div className="text-muted-foreground text-center py-8">
                  No certifications added yet. Click the button above to add your first certification.
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 