import { NextResponse } from "next/server"
import { createCertification } from "@/lib/professional-history"
import { createClient } from '@supabase/supabase-js'

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
      return new NextResponse(
        getErrorMessage(authError, "Unauthorized - Invalid token"),
        { status: 401 }
      )
    }

    const body = await request.json()
    const certification = await createCertification({
      history_id: body.history_id,
      name: body.name,
      issuer: body.issuer,
      issue_date: body.issue_date,
      expiration_date: body.expiration_date || null,
      credential_id: body.credential_id || null,
      credential_url: body.credential_url || null,
      source: 'manual',
    }, supabase)

    return NextResponse.json(certification)
  } catch (error) {
    console.error("[CERTIFICATION_POST]", error)
    return new NextResponse(
      getErrorMessage(error, `Internal error: ${error instanceof Error ? error.message : 'Unknown error'}`),
      { status: 500 }
    )
  }
} 