import { NextResponse } from "next/server"
import { projectsService } from '@/lib/projects'
import type { ErrorResult } from '@/lib/error-handling'
import { supabase } from "@/lib/supabase"

/**
 *
 * @param request
 * @param root0
 * @param root0.params
 * @param root0.params.id
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      )
    }

    const body = await request.json()
    const project = await projectsService.update(params.id, {
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
        error: 'Failed to update project',
        details: process.env.NEXT_PUBLIC_SHOW_DETAILED_ERRORS === 'true' 
          ? error instanceof Error ? error.message : 'Unknown error'
          : undefined
      }),
      { status: 500 }
    )
  }
}

/**
 *
 * @param request
 * @param root0
 * @param root0.params
 * @param root0.params.id
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      )
    }

    await projectsService.delete(params.id)
    return new NextResponse(null, { status: 204 })
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
        error: 'Failed to delete project',
        details: process.env.NEXT_PUBLIC_SHOW_DETAILED_ERRORS === 'true' 
          ? error instanceof Error ? error.message : 'Unknown error'
          : undefined
      }),
      { status: 500 }
    )
  }
} 