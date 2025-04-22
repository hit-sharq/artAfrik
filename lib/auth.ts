import { auth } from "@clerk/nextjs/server"
import { prisma } from "./prisma"

// List of Clerk user IDs that should have admin access
const ADMIN_USER_IDS = [
  "user_2w2Wa9Cfm4zh2ylxrBIjKDmsbyb", // Your current Clerk ID
  // Add any other admin IDs here
]

// This function checks if the current user is an admin
export async function isAdmin() {
  // Get the current user ID from Clerk
  const { userId } = await auth()

  if (!userId) {
    return false
  }

  // Check if the user ID is in our hardcoded admin list
  if (ADMIN_USER_IDS.includes(userId)) {
    return true
  }

  try {
    // If not in hardcoded list, check the database
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true },
    })

    // If user doesn't exist in our database yet, create them
    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          role: "user", // Default role is user
        },
        select: { role: true },
      })
    }

    // Check if the user has admin role
    return user?.role === "admin"
  } catch (error) {
    console.error("Error checking admin status:", error)
    return false
  }
}
