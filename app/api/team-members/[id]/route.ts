import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { isAdmin } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const teamMember = await prisma.teamMember.findUnique({
      where: { id },
    })

    if (!teamMember) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 })
    }

    return NextResponse.json(teamMember)
  } catch (error) {
    console.error("Error fetching team member:", error)
    return NextResponse.json({ error: "Failed to fetch team member" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if user is admin
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    // Check if the team member exists
    const teamMember = await prisma.teamMember.findUnique({
      where: { id },
    })

    if (!teamMember) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 })
    }

    // Delete the team member
    await prisma.teamMember.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting team member:", error)
    return NextResponse.json({ error: "Failed to delete team member" }, { status: 500 })
  }
}
