import { isAdmin } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const adminStatus = await isAdmin()

    return NextResponse.json({ isAdmin: adminStatus })
  } catch (error) {
    console.error("Error in check-admin API:", error)
    return NextResponse.json({ isAdmin: false }, { status: 500 })
  }
}
