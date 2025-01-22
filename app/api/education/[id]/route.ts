import { NextResponse } from "next/server"
import { updateEducation, deleteEducation } from "@/lib/professional-history"
import { supabase } from "@/lib/supabase"

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const education = await updateEducation(params.id, {
      institution: body.institution,
      degree: body.degree,
      field: body.field,
      start_date: body.start_date,
      end_date: body.end_date,
      gpa: body.gpa,
      achievements: body.achievements,
      updated_at: new Date().toISOString(),
    })

    return NextResponse.json(education)
  } catch (error) {
    console.error("[EDUCATION_PUT]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    await deleteEducation(params.id)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[EDUCATION_DELETE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 