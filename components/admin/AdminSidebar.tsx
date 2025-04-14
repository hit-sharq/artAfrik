"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function AdminSidebar() {
  const pathname = usePathname()
  const { signOut } = useClerk()
  const router = useRouter()

  const handleSignOut = () => {
    signOut(() => router.push("/"))
  }

  const isActive = (path: string) => {
    return pathname === path ? "active" : ""
  }

  return (
    <aside className="admin-sidebar">
      <div className="admin-logo">
        <Image src="/placeholder.svg?height=40&width=40" alt="Arts Afrik Logo" width={40} height={40} />
        <h1>
          Arts
          <br />
          Afrik
        </h1>
      </div>

      <nav className="nav-items">
        <Link href="/admin/art-listings" className={`nav-item ${isActive("/admin/art-listings")}`}>
          Art Listings
        </Link>
        <Link href="/admin/orders" className={`nav-item ${isActive("/admin/orders")}`}>
          Orders
        </Link>
        <Link href="/admin" className={`nav-item ${isActive("/admin")}`}>
          Overview
        </Link>
        <Link href="/admin/customers" className={`nav-item ${isActive("/admin/customers")}`}>
          Customers
        </Link>
        <Link href="/admin/contact-log" className={`nav-item ${isActive("/admin/contact-log")}`}>
          Contact Log
        </Link>
        <Link href="/admin/settings" className={`nav-item ${isActive("/admin/settings")}`}>
          Settings
        </Link>
      </nav>

      <button className="logout-button" onClick={handleSignOut}>
        Logout
      </button>
    </aside>
  )
}
