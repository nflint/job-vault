import { NextResponse } from "next/server"
import { createProject } from "@/lib/professional-history"
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
    // Get auth token from request header
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return new NextResponse(
        getErrorMessage(null, "Unauthorized - No token provided"),
        { status: 401 }
      )
    }

    // Create authenticated Supabase client
    const supabaseClient = supabase.auth.setSession({
      access_token: authHeader.replace('Bearer ', ''),
      refresh_token: '',
    })

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return new NextResponse(
        getErrorMessage(null, "Unauthorized - Invalid token"),
        { status: 401 }
      )
    }

    const body = await request.json()
    const project = await createProject({
      history_id: body.history_id,
      name: body.name,
      description: body.description,
      url: body.url || null,
      technologies: body.technologies,
      start_date: body.start_date || null,
      end_date: body.end_date || null,
      source: 'manual',
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error("[PROJECT_POST]", error)
    return new NextResponse(
      getErrorMessage(error, `Internal error: ${error instanceof Error ? error.message : 'Unknown error'}`),
      { status: 500 }
    )
  }
} 