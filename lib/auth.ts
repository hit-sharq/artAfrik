import { currentUser } from "@clerk/nextjs"

export async function isAdmin(): Promise<boolean> {
  const user = await currentUser()
  if (!user || !user.id) {
    return false
  }
  const adminIds = process.env.ADMIN_IDS ? process.env.ADMIN_IDS.split(",") : []
  return adminIds.includes(user.id)
}
