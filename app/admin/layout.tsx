import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { isAdmin } from "@/lib/auth"
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminHeader from "@/components/admin/AdminHeader"
import "@/app/admin/admin.css"

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // Check if the current user is an admin
  const adminStatus = await isAdmin()

  // If not an admin, redirect to home page
  if (!adminStatus) {
    redirect("/")
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <AdminHeader />
        <main className="admin-main">{children}</main>
      </div>
    </div>
  )
}
