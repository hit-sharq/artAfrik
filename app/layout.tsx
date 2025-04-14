import type React from "react"
import { ClerkProvider } from "@clerk/nextjs"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Arts Afrik - Traditional African Art",
  description: "Connect with authentic traditional African art and curios from across the continent.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}


import './globals.css'