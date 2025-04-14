import type React from "react"
import { ClerkProvider } from "@clerk/nextjs"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Arts Afrik - Traditional African Art",
  description: "Connect with authentic traditional African art and curios from across the continent.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" data-google-analytics-opt-out="">
        <head>
          <link rel="icon" href="/images/favicon.ico" />
        </head>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
