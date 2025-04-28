import { auth, currentUser } from "@clerk/nextjs/server"

// Update the function to accept null as well
export async function isAdmin(providedUserId?: string | null): Promise<boolean> {
  try {
    // If a userId is provided and not null, use it
    let userId = providedUserId

    // Otherwise, try to get it from the current auth context
    if (!userId) {
      const authResult = await auth()
      userId = authResult.userId

      // Only try currentUser if auth() didn't provide a userId
      if (!userId) {
        const user = await currentUser()
        userId = user?.id
      }
    }

    // If we still don't have a userId, the user is not authenticated
    if (!userId) {
      return false
    }

    // Get the list of admin IDs from environment variables
    const adminIds = process.env.ADMIN_IDS ? process.env.ADMIN_IDS.split(",") : []

    // Check if the user's ID is in the list of admin IDs
    return adminIds.includes(userId)
  } catch (error) {
    console.error("Error checking admin status:", error)
    return false
  }
}
