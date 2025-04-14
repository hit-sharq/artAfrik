import { auth } from "@clerk/nextjs/server"

// This function checks if the current user is an admin
// It first verifies authentication with Clerk, then checks the database for admin role
export async function isAdmin() {
  const { userId } = await auth()

  if (!userId) {
    return false
  }

  try {
    // In a production app, you would have a users table with a role field
    // For now, we'll simulate this with a simple check
    // Replace this with actual database query when you have a users table

    // Example of how it would look with a real database:
    // const user = await prisma.user.findUnique({
    //   where: { clerkId: userId },
    //   select: { role: true }
    // })
    // return user?.role === 'admin'

    // For development, we'll use a hardcoded list of admin IDs
    // Replace this with actual admin IDs or remove once you have database roles
    const adminIds = process.env.ADMIN_USER_IDS?.split(",") || []
    return adminIds.includes(userId)
  } catch (error) {
    console.error("Error checking admin status:", error)
    return false
  }
}
