import { NextResponse } from "next/server"
import { prisma } from "lib/prisma"

export async function GET(request: Request) {
  try {
    console.log("Fetching art listings")
    const url = new URL(request.url)
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "10", 10), 100)
    const offset = Math.max(parseInt(url.searchParams.get("offset") || "0", 10), 0)

    const artListings = await prisma.artListing.findMany({
      skip: offset,
      take: limit,
    })

    console.log(`Fetched ${artListings.length} art listings with limit=${limit} offset=${offset}`)
    return NextResponse.json(artListings)
  } catch (error) {
    console.error("Error fetching art listings:", error)
    return NextResponse.json({ error: "Failed to fetch art listings" }, { status: 500 })
  }
}
