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
      <html lang="en">
        <head>
          <link rel="icon" href="/images/favicon.ico" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
            rel="stylesheet"
          />
        </head>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
