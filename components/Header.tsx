"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import "./Header.css"

export default function Header() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path ? "active" : ""
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

          <nav className="nav">
            <ul className="nav-list">
              <li className={isActive("/")}>
                <Link href="/">Home</Link>
              </li>
              <li className={isActive("/gallery")}>
                <Link href="/gallery">Gallery</Link>
              </li>
              <li className={isActive("/about")}>
                <Link href="/about">About Us</Link>
              </li>
              <li className={isActive("/contact")}>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </nav>

          <div className="auth-buttons">
            <SignedIn>
              <div className="user-section">
                <Link href="/dashboard" className={`dashboard-link ${isActive("/dashboard")}`}>
                  Dashboard
                </Link>
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>

            <SignedOut>
              <Link href="/sign-in" className="sign-in-button">
                Sign In
              </Link>
              <Link href="/sign-up" className="sign-up-button">
                Sign Up
              </Link>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  )
}
