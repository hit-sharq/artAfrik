import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const artListings = await prisma.artListing.findMany()
    console.log("Fetched art listings:", artListings) // Add logging to verify images array
    return NextResponse.json(artListings)
  } catch (error) {
    console.error("Error fetching art listings:", error)
    return NextResponse.json({ error: "Failed to fetch art listings" }, { status: 500 })
  }
}
