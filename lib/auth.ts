import { auth } from "@clerk/nextjs/server"
import { prisma } from "./prisma"

// This function checks if the current user is an admin
// It first verifies authentication with Clerk, then checks the database for admin role
export async function isAdmin() {
  const { userId } = await auth()

  if (!userId) {
    return false
  }

  try {
    const prismaAny = prisma as any
const user = await prismaAny.user.findUnique({
  where: { clerkId: userId },
  select: { role: true }
})
    return user?.role === "admin"
  } catch (error) {
    console.error("Error checking admin status:", error)
    return false
  }
}
