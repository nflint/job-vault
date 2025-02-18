import { NextResponse } from "next/server"
import { updateCertification, deleteCertification } from "@/lib/professional-history"
import { createClient } from '@supabase/supabase-js'

// Helper function to get error message based on environment
/**
 *
 * @param error
 * @param detailedMessage
 */
function getErrorMessage(error: any, detailedMessage: string) {
  if (process.env.NEXT_PUBLIC_SHOW_DETAILED_ERRORS === 'true') {
    return detailedMessage
  }
  return 'An error occurred while processing your request'
}

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
    const certification = await updateCertification(params.id, {
      name: body.name,
      issuer: body.issuer,
      issue_date: body.issue_date,
      expiration_date: body.expiration_date || null,
      credential_id: body.credential_id || null,
      credential_url: body.credential_url || null,
    }, supabase)

    return NextResponse.json(certification)
  } catch (error) {
    console.error("[CERTIFICATION_PUT]", error)
    return new NextResponse(
      getErrorMessage(error, `Internal error: ${error instanceof Error ? error.message : 'Unknown error'}`),
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

    await deleteCertification(params.id, supabase)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[CERTIFICATION_DELETE]", error)
    return new NextResponse(
      getErrorMessage(error, `Internal error: ${error instanceof Error ? error.message : 'Unknown error'}`),
      { status: 500 }
    )
  }
} 