import { auth } from "@clerk/nextjs/server"
import { prisma } from "./prisma"

// This function checks if the current user is an admin
export async function isAdmin() {
  const { userId } = await auth()

  if (!userId) {
    return false
  }

  try {
    // First check if the user exists in our database
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

    return user?.role === "admin"
  } catch (error) {
    console.error("Error checking admin status:", error)
    return false
  }
}
