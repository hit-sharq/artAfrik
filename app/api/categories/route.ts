
import { NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"

export async function GET() {
  try {
    const categories = await prisma.artListing.findMany({
      distinct: ["woodType"],
      select: {
        woodType: true,
      },
    })

    const formattedCategories = categories.map((cat) => ({
      name: cat.woodType,
      description: getCategoryDescription(cat.woodType),
      image: getCategoryImage(cat.woodType),
    }))

    return NextResponse.json(formattedCategories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

// Helper functions to provide descriptions and images for categories
function getCategoryDescription(woodType: string) {
  switch (woodType.toLowerCase()) {
    case "rosewood":
      return "Elegant sculptures with rich, deep reddish-brown tones"
    case "ebony":
      return "Striking black wood pieces with exceptional durability"
    case "mahogany":
      return "Beautiful reddish-brown wood with straight grain"
    default:
      return "Beautiful traditional African wood art"
  }
}

function getCategoryImage(woodType: string) {
  switch (woodType.toLowerCase()) {
    case "rosewood":
      return "/images/rosewood.jpg"
    case "ebony":
      return "/images/ebony.jpg"
    case "mahogany":
      return "/images/mahogany.jpg"
    default:
      return "/placeholder.svg"
  }
}
