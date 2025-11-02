"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { useTheme } from "next-themes"
import { isAdmin } from "@/lib/auth"
import "./Header.css"

const Header = () => {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isUserAdmin, setIsUserAdmin] = useState(false)
  const { theme, setTheme } = useTheme()

  const isActive = (path: string) => {
    return pathname === path ? "active" : ""
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // Check admin status via API route for client components
        const response = await fetch("/api/check-admin")
        const data = await response.json()
        setIsUserAdmin(data.isAdmin)
      } catch (error) {
        console.error("Error checking admin status:", error)
        setIsUserAdmin(false)
      }
    }

    checkAdminStatus()
  }, [])

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link href="/">
              <h1>Arts Afrik</h1>
            </Link>
          </div>

          <button className="mobile-menu-button" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? "✕" : "☰"}
          </button>

          <nav className={`nav ${mobileMenuOpen ? "open" : ""}`}>
            <ul className="nav-list">
              <li className={isActive("/")}>
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                  Home
                </Link>
              </li>
              <li className={isActive("/gallery")}>
                <Link href="/gallery" onClick={() => setMobileMenuOpen(false)}>
                  Gallery
                </Link>
              </li>
              <li className={isActive("/blog")}>
                <Link href="/blog" onClick={() => setMobileMenuOpen(false)}>
                  Blog
                </Link>
              </li>
              <li className={isActive("/contact")}>
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                  Contact
                </Link>
              </li>
            </ul>

            <div className="auth-buttons">
              <SignedIn>
                <div className="user-section">
                  {isUserAdmin && (
                    <Link
                      href="/dashboard"
                      className={`dashboard-link admin-link ${isActive("/dashboard")}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    href="/user-dashboard"
                    className={`dashboard-link ${isActive("/user-dashboard")}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>

              <SignedOut>
                <Link href="/sign-in" className="sign-in-button" onClick={() => setMobileMenuOpen(false)}>
                  Sign In
                </Link>
                <Link href="/sign-up" className="sign-up-button" onClick={() => setMobileMenuOpen(false)}>
                  Sign Up
                </Link>
              </SignedOut>
              <button className="theme-toggle-button" onClick={toggleTheme} aria-label="Toggle Dark Mode">
                {theme === "dark" ? "🌞" : "🌙"}
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
