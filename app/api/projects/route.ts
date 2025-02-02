import { NextResponse } from "next/server"
import { createProject } from "@/lib/professional-history"
import { createClient } from '@supabase/supabase-js'
import { getAuthErrorResponse, getApiErrorResponse } from "@/lib/error-handling"

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
      return getAuthErrorResponse(null, "Unauthorized - No token provided")
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
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return getAuthErrorResponse(authError, "Unauthorized - Invalid token")
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
    }, supabase)

    return NextResponse.json(project)
  } catch (error) {
    return getApiErrorResponse(error, "PROJECT_POST")
  }
} 