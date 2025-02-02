import { NextResponse } from "next/server"
import puppeteer from "puppeteer"
import { supabase } from "@/lib/supabase"
import { createClient } from '@supabase/supabase-js'
import type { Resume, ResumeSection, ResumeExport } from "@/types"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get auth token from request header
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      )
    }

    // Create Supabase client with auth token
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: authHeader
          }
        }
      }
    )

    // Get export record
    const { data: exportData, error: exportError } = await supabase
      .from('resume_exports')
      .select('*')
      .eq('id', params.id)
      .single()

    if (exportError) {
      console.error('Export error:', exportError)
      return NextResponse.json(
        { error: 'Export not found' },
        { status: 404 }
      )
    }

    // Get resume data
    const { data: resume, error: resumeError } = await supabase
      .from('resumes')
      .select(`
        *,
        sections:resume_sections(
          *,
          items:resume_items(*)
        )
      `)
      .eq('id', exportData.resume_id)
      .single()

    if (resumeError) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      )
    }

    // Launch browser
    const browser = await puppeteer.launch({
      headless: true
    })
    const page = await browser.newPage()

    // Set content
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${resume.name}</title>
          <style>
            body {
              font-family: ${resume.font_family}, system-ui, sans-serif;
              font-size: ${resume.font_size}px;
              line-height: ${resume.line_spacing};
              margin: ${resume.margin_size}rem;
              color: #1a1a1a;
            }
            h1 {
              font-size: 2em;
              font-weight: bold;
              text-align: center;
              margin-bottom: 0.5em;
            }
            .description {
              text-align: center;
              color: #666;
              margin-bottom: 2em;
            }
            .section {
              margin-bottom: 1.5em;
            }
            .section h2 {
              font-size: 1.5em;
              font-weight: 600;
              border-bottom: 1px solid #ddd;
              padding-bottom: 0.25em;
              margin-bottom: 0.75em;
            }
            p {
              margin-bottom: 0.5em;
            }
          </style>
        </head>
        <body>
          <h1>${resume.name}</h1>
          ${resume.description ? `<p class="description">${resume.description}</p>` : ''}
          
          ${(resume.sections as ResumeSection[])
            .sort((a: ResumeSection, b: ResumeSection) => a.order_index - b.order_index)
            .map((section: ResumeSection) => `
              <div class="section">
                <h2>${section.title}</h2>
                ${section.content ? section.content.split('\n').map((p: string) => `<p>${p}</p>`).join('') : ''}
              </div>
            `).join('')}
        </body>
      </html>
    `)

    // Generate PDF
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.4in',
        right: '0.4in',
        bottom: '0.4in',
        left: '0.4in'
      }
    })

    await browser.close()

    // Return PDF
    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${exportData.file_path}"`
      }
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
} 