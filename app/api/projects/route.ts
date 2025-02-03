import { NextResponse } from "next/server"
import { projectsService } from '@/lib/projects'
import type { ErrorResult } from '@/lib/error-handling'
import { supabase } from "@/lib/supabase"

// Helper function to get error message based on environment
function getErrorMessage(error: any, detailedMessage: string) {
  if (process.env.NEXT_PUBLIC_SHOW_DETAILED_ERRORS === 'true') {
    return detailedMessage
  }
  return 'An error occurred while processing your request'
}

export async function POST(request: Request) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      )
    }

    const body = await request.json()
    const project = await projectsService.create({
      history_id: body.history_id,
      source: 'manual',
      name: body.name,
      description: body.description,
      url: body.url || null,
      technologies: body.technologies,
      start_date: body.start_date || null,
      end_date: body.end_date || null,
    })

    return NextResponse.json(project)
  } catch (error) {
    // Use error result if available
    if (error instanceof Error && 'errorResult' in error) {
      const { message, devMessage } = error.errorResult as ErrorResult
      return new NextResponse(
        JSON.stringify({ 
          error: message,
          details: process.env.NEXT_PUBLIC_SHOW_DETAILED_ERRORS === 'true' ? devMessage : undefined
        }),
        { status: 400 }
      )
    }

    // Fallback error handling
    return new NextResponse(
      JSON.stringify({ 
        error: 'Failed to create project',
        details: process.env.NEXT_PUBLIC_SHOW_DETAILED_ERRORS === 'true' 
          ? error instanceof Error ? error.message : 'Unknown error'
          : undefined
      }),
      { status: 500 }
    )
  }
} 