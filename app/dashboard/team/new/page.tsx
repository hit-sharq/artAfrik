"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import MainLayout from "@/components/MainLayout"
import { createTeamMember } from "@/app/actions/team-actions"
import { isAdmin } from "@/lib/auth"
import "../team-form.css"

export default function NewTeamMember() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    bio: "",
    order: 0,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Check if user is admin
  useEffect(() => {
    async function checkAdmin() {
      const adminStatus = await isAdmin()
      setIsAuthorized(adminStatus)
      if (!adminStatus) {
        router.push("/dashboard")
      }
    }
    checkAdmin()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess("")

    try {
      const formDataObj = new FormData()
      formDataObj.append("name", formData.name)
      formDataObj.append("title", formData.title)
      formDataObj.append("bio", formData.bio)
      formDataObj.append("order", formData.order.toString())

      // Add image if one was selected
      const fileInput = document.getElementById("image") as HTMLInputElement
      if (fileInput.files && fileInput.files[0]) {
        formDataObj.append("image", fileInput.files[0])
      }

      const result = await createTeamMember(formDataObj)

      if (result.success) {
        setSuccess("Team member created successfully!")
        // Redirect after a short delay
        setTimeout(() => {
          router.push("/dashboard?tab=team")
        }, 2000)
      } else {
        setError(result.message || "Failed to create team member")
      }
    } catch (error) {
      console.error("Error creating team member:", error)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isAuthorized) {
    return (
      <MainLayout>
        <div className="container">
          <div className="loading-container">
            <p>Checking authorization...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="team-form-page">
        <div className="container">
          <div className="team-form-container">
            <div className="form-header">
              <h1>Add New Team Member</h1>
              <p>Fill in the details below to add a new team member.</p>
            </div>

            {success && (
              <div className="success-message">
                <i className="fas fa-check-circle"></i>
                <p>{success}</p>
              </div>
            )}

            {error && <div className="error-message">{error}</div>}

            <form className="team-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter team member's name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="title">Title/Position</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Founder & Curator, Cultural Specialist"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Write a short bio for this team member"
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="order">Display Order</label>
                <input
                  type="number"
                  id="order"
                  name="order"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: Number.parseInt(e.target.value) || 0 })}
                  min="0"
                />
                <small>Lower numbers appear first</small>
              </div>

              <div className="form-group">
                <label htmlFor="image">Profile Image</label>
                <input type="file" id="image" name="image" accept="image/*" onChange={handleImageChange} required />
                {imagePreview && (
                  <div className="image-preview">
                    <Image
                      src={imagePreview || "/placeholder.svg"}
                      alt="Profile image preview"
                      width={300}
                      height={300}
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                )}
              </div>

              <div className="form-actions">
                <Link href="/dashboard?tab=team" className="button cancel-button">
                  Cancel
                </Link>
                <button type="submit" className="button submit-button" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Add Team Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
