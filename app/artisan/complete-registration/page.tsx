"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { cloudinaryLoader } from "@/lib/cloudinary"
import "./complete-registration.css"

export default function CompleteRegistrationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [isLoading, setIsLoading] = useState(true)
  const [isVerifying, setIsVerifying] = useState(false)
  const [artisanData, setArtisanData] = useState<any>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Check if user is already signed in
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    // Check if user is signed in with Clerk
    const checkAuth = async () => {
      try {
        // This will be replaced with actual Clerk auth check
        const response = await fetch("/api/auth/check")
        if (response.ok) {
          const data = await response.json()
          setIsSignedIn(data.isSignedIn)
          setUserEmail(data.email || "")
        }
      } catch (err) {
        console.error("Auth check error:", err)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // Verify token if present
    if (token) {
      verifyToken(token)
    } else {
      setError("Invalid or expired registration link")
      setIsLoading(false)
    }
  }, [token])

  const verifyToken = async (verificationToken: string) => {
    try {
      const response = await fetch("/api/artisans/verify-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: verificationToken }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Invalid or expired registration link")
      } else {
        setArtisanData(data.artisan)
      }
    } catch (err) {
      setError("Failed to verify registration")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLinkAccount = async () => {
    if (!isSignedIn) {
      // Redirect to sign up/sign in with return URL
      router.push(`/sign-up?redirect=/artisan/complete-registration?token=${token}`)
      return
    }

    setIsVerifying(true)
    setError("")

    try {
      const response = await fetch("/api/artisans/link-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          clerkUserId: "current-user-id", // Will be replaced with actual Clerk user ID
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to link account")
      } else {
        setSuccess(true)
        // Redirect to artisan dashboard after successful linking
        setTimeout(() => {
          router.push("/artisan/dashboard")
        }, 2000)
      }
    } catch (err) {
      setError("Failed to link account")
    } finally {
      setIsVerifying(false)
    }
  }

  if (isLoading) {
    return (
      <div className="complete-registration-page">
        <div className="registration-container">
          <div className="loading-spinner"></div>
          <p>Verifying your registration...</p>
        </div>
      </div>
    )
  }

  if (error && !artisanData) {
    return (
      <div className="complete-registration-page">
        <div className="registration-container">
          <div className="error-state">
            <div className="error-icon">❌</div>
            <h1>Registration Error</h1>
            <p>{error}</p>
            <div className="actions">
              <Link href="/" className="button primary-button">
                Return Home
              </Link>
              <Link href="/artisan/register" className="button secondary-button">
                Register Again
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="complete-registration-page">
        <div className="registration-container">
          <div className="success-state">
            <div className="success-icon">🎉</div>
            <h1>Account Linked Successfully!</h1>
            <p>Your artisan account has been linked to your ArtAfrik profile.</p>
            <p>Redirecting you to your dashboard...</p>
            <div className="loading-spinner"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="complete-registration-page">
      <div className="registration-container">
        <div className="registration-header">
          <Link href="/" className="back-button">
            ← Back to Home
          </Link>
          <Image
            src="/placeholder-logo.svg"
            alt="ArtAfrik"
            width={150}
            height={50}
            loader={cloudinaryLoader}
          />
          <h1>Complete Your Artisan Registration</h1>
        </div>

        {artisanData && (
          <div className="artisan-summary">
            <div className="summary-header">
              <div className="artisan-avatar">
                {artisanData.fullName?.charAt(0).toUpperCase()}
              </div>
              <div className="artisan-info">
                <h2>{artisanData.fullName}</h2>
                <p>{artisanData.email}</p>
              </div>
            </div>

            <div className="artisan-details">
              <div className="detail-item">
                <span className="label">Specialty:</span>
                <span className="value">{artisanData.specialty}</span>
              </div>
              <div className="detail-item">
                <span className="label">Region:</span>
                <span className="value">{artisanData.region}</span>
              </div>
              {artisanData.shopName && (
                <div className="detail-item">
                  <span className="label">Shop Name:</span>
                  <span className="value">{artisanData.shopName}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="link-account-section">
          <h2>Link Your Account</h2>
          <p>
            To access your artisan dashboard and start selling, you need to link this
            registration to your ArtAfrik account.
          </p>

          {isSignedIn ? (
            <div className="signed-in-status">
              <div className="status-icon">✅</div>
              <div className="status-info">
                <p className="status-title">Signed in as {userEmail}</p>
                <p className="status-desc">Click below to link your accounts</p>
              </div>
              <button
                className="button primary-button"
                onClick={handleLinkAccount}
                disabled={isVerifying}
              >
                {isVerifying ? "Linking..." : "Link Account & Continue"}
              </button>
            </div>
          ) : (
            <div className="not-signed-in-status">
              <div className="status-icon">🔐</div>
              <div className="status-info">
                <p className="status-title">Not Signed In</p>
                <p className="status-desc">Sign up or sign in to link your accounts</p>
              </div>
              <div className="auth-buttons">
                <Link
                  href={`/sign-up?redirect=/artisan/complete-registration?token=${token}`}
                  className="button primary-button"
                >
                  Create Account
                </Link>
                <Link
                  href={`/sign-in?redirect=/artisan/complete-registration?token=${token}`}
                  className="button secondary-button"
                >
                  Sign In
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="help-section">
          <h3>Need Help?</h3>
          <p>
            If you're having trouble completing your registration, please contact our
            support team.
          </p>
          <Link href="/contact" className="contact-link">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}

