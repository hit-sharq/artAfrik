"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NewArtListingPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    woodType: "",
    region: "",
    price: "",
    size: "",
    stock: "1",
    featured: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call to create the art listing
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Redirect to art listings page after successful submission
      router.push("/admin/art-listings")
    } catch (error) {
      console.error("Error creating art listing:", error)
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Add New Artwork</h1>
        <Link href="/admin/art-listings" className="back-button">
          <ArrowLeft size={16} />
          Back to Art Listings
        </Link>
      </div>

      <div className="admin-form-container">
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="price">Price ($) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="woodType">Wood Type *</label>
              <select id="woodType" name="woodType" value={formData.woodType} onChange={handleChange} required>
                <option value="">Select Wood Type</option>
                <option value="Ebony">Ebony</option>
                <option value="Rosewood">Rosewood</option>
                <option value="Mahogany">Mahogany</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="region">Region *</label>
              <select id="region" name="region" value={formData.region} onChange={handleChange} required>
                <option value="">Select Region</option>
                <option value="West Africa">West Africa</option>
                <option value="East Africa">East Africa</option>
                <option value="Central Africa">Central Africa</option>
                <option value="Southern Africa">Southern Africa</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="size">Size *</label>
              <input
                type="text"
                id="size"
                name="size"
                value={formData.size}
                onChange={handleChange}
                placeholder='e.g., 12" x 6" x 3"'
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="stock">Stock Quantity *</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="images">Upload Images *</label>
            <input type="file" id="images" name="images" multiple accept="image/*" required />
            <p className="help-text">You can upload multiple images. First image will be the main display image.</p>
          </div>

          <div className="form-group checkbox-group">
            <input type="checkbox" id="featured" name="featured" checked={formData.featured} onChange={handleChange} />
            <label htmlFor="featured">Feature this art piece on the home page</label>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={() => router.push("/admin/art-listings")}>
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Artwork"}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
