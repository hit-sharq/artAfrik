
import { NextResponse } from "next/server"
import { prisma } from "lib/prisma"
import { auth } from "@clerk/nextjs/server"

// Get current authenticated artisan
export async function GET(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const artisan = await prisma.artisan.findFirst({
      where: { clerkId: userId },
      include: {
        _count: {
          select: { artListings: true },
        },
      },
    })

    if (!artisan) {
      return NextResponse.json(
        { error: "Artisan not found" },
        { status: 404 }
      )
    }

    // Check if artisan is approved
    if (artisan.status === "PENDING") {
      return NextResponse.json(
        { error: "Your account is pending approval" },
        { status: 403 }
      )
    }

    if (artisan.status === "REJECTED") {
      return NextResponse.json(
        { error: "Your registration has been rejected" },
        { status: 403 }
      )
    }

    return NextResponse.json(artisan)
  } catch (error) {
    console.error("Error fetching artisan:", error)
    return NextResponse.json(
      { error: "Failed to fetch artisan" },
      { status: 500 }
    )
  }
}

