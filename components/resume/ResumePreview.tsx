import { useMemo } from "react"
import type { Resume, ResumeSection } from "@/types"

interface ResumePreviewProps {
  resume: Resume & { sections: ResumeSection[] }
}

export function ResumePreview({ resume }: ResumePreviewProps) {
  const containerStyle = useMemo(() => ({
    fontFamily: resume.font_family,
    fontSize: resume.font_size === "sm" ? "0.875rem" : resume.font_size === "lg" ? "1.125rem" : "1rem",
    lineHeight: resume.line_spacing === "tight" ? "1.25" : resume.line_spacing === "relaxed" ? "1.75" : "1.5",
    padding: resume.margin_size === "sm" ? "1rem" : resume.margin_size === "lg" ? "3rem" : "2rem",
  }), [resume.font_family, resume.font_size, resume.line_spacing, resume.margin_size])

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="aspect-[8.5/11] w-full overflow-y-auto">
        <div className="min-h-full" style={containerStyle}>
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{resume.name}</h1>
            {resume.description && (
              <p className="text-gray-600">{resume.description}</p>
            )}
          </div>

          {/* Sections */}
          <div className="space-y-6">
            {resume.sections
              .sort((a, b) => a.order_index - b.order_index)
              .map((section) => (
                <div key={section.id || section.title} className="section">
                  <h2 className="text-xl font-semibold border-b pb-2 mb-4">
                    {section.title}
                  </h2>
                  {section.content && (
                    <div className="prose max-w-none">
                      {section.content.split('\n').map((paragraph, i) => (
                        <p key={i} className="mb-2">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
} 