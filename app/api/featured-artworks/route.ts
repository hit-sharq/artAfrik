import { NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"

export async function GET() {
  try {
    const featuredArtworks = await prisma.artListing.findMany({
      where: { featured: true },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        woodType: true,
        region: true,
        size: true,
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(featuredArtworks)
  } catch (error) {
    console.error("Error fetching featured artworks:", error)
    return NextResponse.json({ error: "Failed to fetch featured artworks" }, { status: 500 })
  }
}
