import { NextResponse } from "next/server"

// Mock data for blog posts
const blogPosts = [
  {
    id: "1",
    title: "The Rich History of West African Masks",
    slug: "west-african-masks-history",
    excerpt:
      "Explore the cultural significance and artistic traditions behind West African ceremonial masks and their importance in various rituals and celebrations.",
    category: "Art History",
    author: "Lilian Ndanu",
    date: "April 15, 2025",
    image: "/placeholder.svg?height=400&width=600",
    featured: true,
  },
  {
    id: "2",
    title: "Sustainable Wood Sourcing in African Art",
    slug: "sustainable-wood-sourcing",
    excerpt:
      "Learn about how modern African artisans are balancing traditional craftsmanship with sustainable practices to preserve both cultural heritage and natural resources.",
    category: "Sustainability",
    author: "Joshua Mwendwa",
    date: "April 10, 2025",
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
  },
  {
    id: "3",
    title: "Symbolism in East African Sculptures",
    slug: "east-african-sculpture-symbolism",
    excerpt:
      "Discover the hidden meanings and symbolic elements commonly found in traditional East African wooden sculptures and their connection to spiritual beliefs.",
    category: "Art Appreciation",
    author: "Mutuku Moses",
    date: "April 5, 2025",
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
  },
  {
    id: "4",
    title: "The Modern Market for Traditional African Art",
    slug: "modern-market-traditional-art",
    excerpt:
      "An analysis of how global appreciation for traditional African art has evolved and the current market trends affecting artisans and collectors alike.",
    category: "Market Trends",
    author: "Lilian Ndanu",
    date: "March 28, 2025",
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
  },
  {
    id: "5",
    title: "Caring for Your Wooden Art Pieces",
    slug: "caring-for-wooden-art",
    excerpt:
      "Essential tips for maintaining and preserving your wooden African art pieces to ensure they remain beautiful for generations to come.",
    category: "Care Guide",
    author: "Joshua Mwendwa",
    date: "March 20, 2025",
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
  },
  {
    id: "6",
    title: "The Art of Ebony Carving",
    slug: "ebony-carving-techniques",
    excerpt:
      "A deep dive into the specialized techniques used by master carvers to transform ebony wood into intricate and stunning works of art.",
    category: "Craftsmanship",
    author: "Mutuku Moses",
    date: "March 15, 2025",
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
  },
]

export async function GET() {
  try {
    // In a real app, this would fetch from a database
    return NextResponse.json(blogPosts)
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // In a real app, this would save to a database
    // For now, we'll just return a success response

    return NextResponse.json({
      success: true,
      message: "Blog post created successfully",
      id: `${Date.now()}`, // Generate a fake ID
    })
  } catch (error) {
    console.error("Error creating blog post:", error)
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 })
  }
}
