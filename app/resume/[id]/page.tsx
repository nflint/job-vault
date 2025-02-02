"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { Plus, GripVertical, Trash2, Download } from "lucide-react"
import { resumeService } from "@/lib/resumes"
import type { Resume, ResumeSection, ResumeItem, ResumeSectionType } from "@/types"
import { ResumePreview } from "@/components/resume/ResumePreview"
import { supabase } from "@/lib/supabase"

const SECTION_TYPES = [
  { value: "summary", label: "Professional Summary" },
  { value: "experience", label: "Work Experience" },
  { value: "education", label: "Education" },
  { value: "skills", label: "Skills" },
  { value: "projects", label: "Projects" },
  { value: "certifications", label: "Certifications" },
  { value: "custom", label: "Custom Section" }
]

const FONT_FAMILIES = [
  { value: "inter", label: "Inter" },
  { value: "roboto", label: "Roboto" },
  { value: "open-sans", label: "Open Sans" },
  { value: "lato", label: "Lato" },
  { value: "montserrat", label: "Montserrat" }
]

const FONT_SIZES = [
  { value: "sm", label: "Small" },
  { value: "base", label: "Medium" },
  { value: "lg", label: "Large" }
]

const LINE_SPACINGS = [
  { value: "tight", label: "Tight" },
  { value: "normal", label: "Normal" },
  { value: "relaxed", label: "Relaxed" }
]

const MARGIN_SIZES = [
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" }
]

export default function ResumeEditorPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const isNew = params.id === "new"
  
  const [resume, setResume] = useState<Resume & { sections: ResumeSection[] }>({
    id: "",
    user_id: "",
    name: "",
    description: "",
    template: "modern",
    font_family: "inter",
    font_size: "base",
    line_spacing: "normal",
    margin_size: "md",
    ranking: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    sections: []
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isNew) {
      loadResume()
    } else {
      setLoading(false)
    }
  }, [params.id])

  async function loadResume() {
    try {
      setLoading(true)
      const data = await resumeService.get(params.id)
      setResume(data)
    } catch (err) {
      console.error('Error loading resume:', err)
      setError(err instanceof Error ? err.message : 'Failed to load resume')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    try {
      setSaving(true)
      const { id, user_id, created_at, updated_at, sections, ...resumeData } = resume
      
      if (isNew) {
        const newResume = await resumeService.create(resumeData)
        
        // Create sections
        for (const section of sections) {
          const { id: sectionId, created_at, updated_at, ...sectionData } = section
          await resumeService.createSection({
            ...sectionData,
            resume_id: newResume.id
          })
        }
        
        router.push(`/resume/${newResume.id}`)
      } else {
        await resumeService.update(id, resumeData)
        
        // Update sections
        for (const section of sections) {
          const { id: sectionId, created_at, updated_at, ...sectionData } = section
          if (sectionId) {
            await resumeService.updateSection(sectionId, sectionData)
          } else {
            await resumeService.createSection({
              ...sectionData,
              resume_id: id
            })
          }
        }
      }
    } catch (err) {
      console.error('Error saving resume:', err)
      setError(err instanceof Error ? err.message : 'Failed to save resume')
    } finally {
      setSaving(false)
    }
  }

  function handleAddSection() {
    setResume(prev => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          id: "",
          resume_id: prev.id,
          type: "custom" as ResumeSectionType,
          title: "New Section",
          content: "",
          order_index: prev.sections.length,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
    }))
  }

  async function handleDeleteSection(index: number) {
    const section = resume.sections[index]
    if (section.id) {
      try {
        await resumeService.deleteSection(section.id)
      } catch (err) {
        console.error('Error deleting section:', err)
        setError(err instanceof Error ? err.message : 'Failed to delete section')
        return
      }
    }
    
    setResume(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }))
  }

  function handleDragEnd(result: DropResult) {
    if (!result.destination) return
    
    const sections = Array.from(resume.sections)
    const [reorderedSection] = sections.splice(result.source.index, 1)
    sections.splice(result.destination.index, 0, reorderedSection)
    
    // Update order_index for all sections
    const updatedSections = sections.map((section, index) => ({
      ...section,
      order_index: index
    }))
    
    setResume(prev => ({
      ...prev,
      sections: updatedSections
    }))
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          <div className="skeleton h-20"></div>
          <div className="skeleton h-10 w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton h-12"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">
            {isNew ? "Create New Resume" : "Edit Resume"}
          </h1>
          <div className="space-x-2">
            {!isNew && (
              <Button
                variant="outline"
                onClick={async () => {
                  try {
                    // Create export record
                    const exportData = await resumeService.createExport({
                      resume_id: resume.id,
                      format: "pdf",
                      file_path: `${resume.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`,
                      version: 1
                    })
                    
                    // Get current session
                    const { data: { session } } = await supabase.auth.getSession()
                    if (!session?.access_token) {
                      throw new Error('No valid session found')
                    }
                    
                    // Open in new tab with auth header
                    const exportUrl = `/api/resume/export/${exportData.id}`
                    const exportWindow = window.open('', '_blank')
                    if (exportWindow) {
                      exportWindow.document.write('Loading PDF...')
                      
                      // Make authenticated request
                      const response = await fetch(exportUrl, {
                        headers: {
                          'Authorization': `Bearer ${session.access_token}`
                        }
                      })
                      
                      if (!response.ok) {
                        throw new Error('Failed to generate PDF')
                      }
                      
                      // Get the PDF blob
                      const blob = await response.blob()
                      const url = URL.createObjectURL(blob)
                      
                      // Navigate to PDF
                      exportWindow.location.href = url
                    }
                  } catch (err) {
                    console.error('Error exporting resume:', err)
                    setError(err instanceof Error ? err.message : 'Failed to export resume')
                  }
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => router.push('/resume')}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* Resume Details */}
            <Card>
              <CardHeader>
                <CardTitle>Resume Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      value={resume.name}
                      onChange={e => setResume(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Resume name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Template</label>
                    <Select
                      value={resume.template}
                      onValueChange={value => setResume(prev => ({ ...prev, template: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="classic">Classic</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={resume.description}
                    onChange={e => setResume(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Resume description"
                  />
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Font Family</label>
                    <Select
                      value={resume.font_family}
                      onValueChange={value => setResume(prev => ({ ...prev, font_family: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select font" />
                      </SelectTrigger>
                      <SelectContent>
                        {FONT_FAMILIES.map(font => (
                          <SelectItem key={font.value} value={font.value}>
                            {font.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Font Size</label>
                    <Select
                      value={resume.font_size}
                      onValueChange={value => setResume(prev => ({ ...prev, font_size: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {FONT_SIZES.map(size => (
                          <SelectItem key={size.value} value={size.value}>
                            {size.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Line Spacing</label>
                    <Select
                      value={resume.line_spacing}
                      onValueChange={value => setResume(prev => ({ ...prev, line_spacing: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select spacing" />
                      </SelectTrigger>
                      <SelectContent>
                        {LINE_SPACINGS.map(spacing => (
                          <SelectItem key={spacing.value} value={spacing.value}>
                            {spacing.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Margin Size</label>
                    <Select
                      value={resume.margin_size}
                      onValueChange={value => setResume(prev => ({ ...prev, margin_size: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select margin" />
                      </SelectTrigger>
                      <SelectContent>
                        {MARGIN_SIZES.map(margin => (
                          <SelectItem key={margin.value} value={margin.value}>
                            {margin.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sections */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Sections</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddSection}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </CardHeader>
              <CardContent>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="sections">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-4"
                      >
                        {resume.sections.map((section, index) => (
                          <Draggable
                            key={section.id || `new-${index}`}
                            draggableId={section.id || `new-${index}`}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="border rounded-lg p-4 bg-white"
                              >
                                <div className="flex items-start gap-4">
                                  <div
                                    {...provided.dragHandleProps}
                                    className="mt-2 cursor-move"
                                  >
                                    <GripVertical className="h-5 w-5 text-gray-400" />
                                  </div>
                                  
                                  <div className="flex-1 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium">Type</label>
                                        <Select
                                          value={section.type}
                                          onValueChange={value => {
                                            const sections = [...resume.sections]
                                            sections[index] = {
                                              ...sections[index],
                                              type: value as ResumeSectionType
                                            }
                                            setResume(prev => ({
                                              ...prev,
                                              sections
                                            }))
                                          }}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {SECTION_TYPES.map(type => (
                                              <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium">Title</label>
                                        <Input
                                          value={section.title}
                                          onChange={e => {
                                            const sections = [...resume.sections]
                                            sections[index] = {
                                              ...sections[index],
                                              title: e.target.value
                                            }
                                            setResume(prev => ({
                                              ...prev,
                                              sections
                                            }))
                                          }}
                                          placeholder="Section title"
                                        />
                                      </div>
                                    </div>

                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">Content</label>
                                      <Textarea
                                        value={section.content}
                                        onChange={e => {
                                          const sections = [...resume.sections]
                                          sections[index] = {
                                            ...sections[index],
                                            content: e.target.value
                                          }
                                          setResume(prev => ({
                                            ...prev,
                                            sections
                                          }))
                                        }}
                                        placeholder="Section content"
                                      />
                                    </div>
                                  </div>

                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => handleDeleteSection(index)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="sticky top-6">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResumePreview resume={resume} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 