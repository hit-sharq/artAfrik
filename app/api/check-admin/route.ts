import { isAdmin } from "../../../lib/auth"
import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

export async function GET() {
  try {
    const { userId } = await auth()

    // Log the current user ID for debugging
    console.log("Current Clerk user ID:", userId)

    const adminStatus = await isAdmin()

    // Log the result of the admin check
    console.log("Admin status result:", adminStatus)

    return NextResponse.json({
      isAdmin: adminStatus,
      userId: userId, // Include the userId in the response for debugging
    })
  } catch (error) {
    console.error("Error in check-admin API:", error)
    return NextResponse.json(
      {
        isAdmin: false,
        error: (error as Error).message,
      },
      { status: 500 },
    )
  }
}
