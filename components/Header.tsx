"use client"

"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { useTheme } from "next-themes"
import "./Header.css"

export default function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
              <li className={isActive("/about")}>
                <Link href="/about" onClick={() => setMobileMenuOpen(false)}>
                  About Us
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
                  <Link
                    href="/dashboard"
                    className={`dashboard-link ${isActive("/dashboard")}`}
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
