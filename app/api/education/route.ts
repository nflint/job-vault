import { NextResponse } from "next/server"
import { createEducation } from "@/lib/professional-history"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const education = await createEducation({
      history_id: body.history_id,
      institution: body.institution,
      degree: body.degree,
      field: body.field,
      start_date: body.start_date,
      end_date: body.end_date,
      gpa: body.gpa,
      achievements: body.achievements,
      source: 'manual',
      updated_at: new Date().toISOString(),
    })

    return NextResponse.json(education)
  } catch (error) {
    console.error("[EDUCATION_POST]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 