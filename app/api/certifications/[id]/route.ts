import { NextResponse } from "next/server"
import { updateCertification, deleteCertification } from "@/lib/professional-history"
import { createClient } from '@supabase/supabase-js'
import { getAuthErrorResponse, getApiErrorResponse } from '@/lib/error-handling'

// Helper function to get error message based on environment
function getErrorMessage(error: any, detailedMessage: string) {
  if (process.env.NEXT_PUBLIC_SHOW_DETAILED_ERRORS === 'true') {
    return detailedMessage
  }
  return 'An error occurred while processing your request'
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get auth token from request header
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return getAuthErrorResponse('No token provided', 'Missing authorization header')
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
      return getAuthErrorResponse('Invalid token', authError?.message || 'Authentication failed')
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
    return getApiErrorResponse(error, 'CERTIFICATION_UPDATE')
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get auth token from request header
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return getAuthErrorResponse('No token provided', 'Missing authorization header')
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
      return getAuthErrorResponse('Invalid token', authError?.message || 'Authentication failed')
    }

    await deleteCertification(params.id, supabase)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return getApiErrorResponse(error, 'CERTIFICATION_DELETE')
  }
} 