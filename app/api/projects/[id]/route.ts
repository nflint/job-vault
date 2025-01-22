import { NextResponse } from "next/server"
import { updateProject, deleteProject } from "@/lib/professional-history"
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
    const project = await updateProject(params.id, {
      name: body.name,
      description: body.description,
      url: body.url || null,
      technologies: body.technologies,
      start_date: body.start_date || null,
      end_date: body.end_date || null,
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error("[PROJECT_PUT]", error)
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

    await deleteProject(params.id)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[PROJECT_DELETE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 