import { useMemo } from "react"
import type { Resume, ResumeSection } from "@/types"

const fontFamilyMap = {
  inter: 'var(--font-inter)',
  roboto: 'var(--font-roboto)',
  'open-sans': 'var(--font-open-sans)',
  lato: 'var(--font-lato)',
  montserrat: 'var(--font-montserrat)',
}

interface ResumePreviewProps {
  resume: Resume & { sections: ResumeSection[] }
}

export function ResumePreview({ resume }: ResumePreviewProps) {
  const containerStyle = useMemo(() => ({
    fontFamily: fontFamilyMap[resume.font_family as keyof typeof fontFamilyMap] || 'var(--font-inter)',
    fontSize: `${resume.font_size}px`,
    lineHeight: resume.line_spacing,
    padding: `${resume.margin_size}rem`,
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