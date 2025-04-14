"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import MainLayout from "@/components/MainLayout"
import "./contact.css"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call to submit the contact form
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSubmitSuccess(true)
      setFormData({
        name: "",
        email: "",
        message: "",
      })
    } catch (error) {
      console.error("Error submitting contact form:", error)
      setErrors({
        submit: "There was an error submitting your message. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <MainLayout>
      <div className="contact-page">
        <div className="container">
          <h1 className="page-title">Contact Us</h1>

          <div className="contact-content">
            <div className="contact-info">
              <div className="social-links">
                <h2>Connect With Us</h2>
                <p>
                  The fastest way to reach us is through our social media channels. We typically respond within 24
                  hours.
                </p>

                <div className="social-buttons">
                  <a
                    href="https://instagram.com/artsafrik"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-button instagram"
                  >
                    <span className="social-icon">
                      <Image src="/placeholder.svg?height=24&width=24" alt="Instagram" width={24} height={24} />
                    </span>
                    <span className="social-name">Instagram</span>
                  </a>

                  <a
                    href="https://twitter.com/artsafrik"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-button twitter"
                  >
                    <span className="social-icon">
                      <Image src="/placeholder.svg?height=24&width=24" alt="X (Twitter)" width={24} height={24} />
                    </span>
                    <span className="social-name">X (Twitter)</span>
                  </a>
                </div>
              </div>

              <div className="contact-details">
                <h2>Our Information</h2>
                <div className="detail-item">
                  <strong>Email:</strong>
                  <p>info@artsafrik.com</p>
                </div>
                <div className="detail-item">
                  <strong>Phone:</strong>
                  <p>+123 456 7890</p>
                </div>
                <div className="detail-item">
                  <strong>Hours:</strong>
                  <p>Monday - Friday: 9am - 5pm</p>
                </div>
              </div>
            </div>

            <div className="contact-form-container">
              <h2>Send Us a Message</h2>

              {submitSuccess ? (
                <div className="success-message">
                  <h3>Message Sent!</h3>
                  <p>Thank you for contacting us. We will get back to you as soon as possible.</p>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                    {errors.name && <p className="error">{errors.name}</p>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    />
                    {errors.email && <p className="error">{errors.email}</p>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Your Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      disabled={isSubmitting}
                    ></textarea>
                    {errors.message && <p className="error">{errors.message}</p>}
                  </div>

                  {errors.submit && <p className="error submit-error">{errors.submit}</p>}

                  <button type="submit" className="button submit-button" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
