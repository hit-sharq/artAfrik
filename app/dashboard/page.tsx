"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@clerk/nextjs"
import MainLayout from "../../components/MainLayout"
import EditArtModal from "../../components/EditArtModal"
import TeamMemberModal from "../../components/TeamMemberModal"
import "./dashboard.css"

// Add this near the top of the file with other imports
import { createArtListing, toggleFeatured, deleteArtListing } from "../actions/art-actions"
import { deleteBlogPost } from "../actions/blog-actions"
import { deleteTeamMember } from "../actions/team-actions"
import { cloudinaryLoader } from "@/lib/cloudinary"

// Import the new TeamManagementSection component
import TeamManagementSection from "@/components/TeamManagementSection"

// Define a type for the active tab to ensure type safety
type ActiveTabType = "orders" | "art" | "upload" | "blog" | "team"

interface ArtListing {
  id: string
  title: string
  woodType: string
  region: string
  price: number
  featured: boolean
  image?: string
  images?: string[]
}

interface Order {
  id: string
  name: string
  email: string
  location: string
  artTitle: string
  status: string
  date: string
}

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  author: string
  date: string
  status: string
  featured: boolean
}

interface TeamMember {
  id: string
  name: string
  title: string
  bio: string
  image: string
  order: number
}

// Define a new interface for the file uploads with preview
interface FileWithPreview extends File {
  preview?: string
}

export default function Dashboard() {
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Get the tab from URL query parameters
  const tabParam = searchParams.get("tab") as ActiveTabType | null

  // Use the defined type for activeTab
  const [activeTab, setActiveTab] = useState<ActiveTabType>(tabParam || "orders")
  const [orders, setOrders] = useState<Order[]>([])
  const [artListings, setArtListings] = useState<ArtListing[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [uploadedFiles, setUploadedFiles] = useState<FileWithPreview[]>([])
  const [uploading, setUploading] = useState(false)

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedArtId, setSelectedArtId] = useState("")

  // Team member modal state
  const [isTeamMemberModalOpen, setIsTeamMemberModalOpen] = useState(false)
  const [selectedTeamMemberId, setSelectedTeamMemberId] = useState("")

  useEffect(() => {
    // Update the URL when tab changes
    if (activeTab) {
      router.push(`/dashboard?tab=${activeTab}`, { scroll: false })
    }
  }, [activeTab, router])

  // Modify the useEffect that checks admin status to only check once on initial load
  // Replace the existing useEffect for checking admin status with this:

  useEffect(() => {
    async function checkAdminStatus() {
      if (isLoaded && isSignedIn) {
        try {
          console.log("Checking admin status for signed-in user")
          const response = await fetch("/api/check-admin")
          const data = await response.json()
          console.log("Admin check response:", data)
          setIsAdmin(data.isAdmin)
          if (!data.isAdmin) {
            router.push("/user-dashboard")
          }
        } catch (error) {
          console.error("Error checking admin status:", error)
          setIsAdmin(false)
          router.push("/user-dashboard")
        } finally {
          setIsLoading(false)
        }
      } else if (isLoaded) {
        setIsLoading(false)
      }
    }

    checkAdminStatus()
  }, [isLoaded, isSignedIn, router]) // Only run this effect when auth state changes

  // Remove the admin check from the useEffect that fetches data when tab changes
  // Replace the existing useEffect for fetching data with this:

  useEffect(() => {
    if (!isLoading && isAdmin) {
      if (activeTab === "orders") {
        fetchOrders()
      } else if (activeTab === "art") {
        fetchArtListings()
      } else if (activeTab === "blog") {
        fetchBlogPosts()
      } else if (activeTab === "team") {
        fetchTeamMembers()
      }
    }
  }, [activeTab, isAdmin, isLoading])

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/order-requests")
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      } else {
        console.error("Failed to fetch orders")
        // Fallback to mock data for demo
        setOrders([
          {
            id: "1",
            name: "John Smith",
            email: "john@example.com",
            location: "New York, USA",
            artTitle: "Traditional Mask",
            status: "pending",
            date: "2023-05-15",
          },
          {
            id: "2",
            name: "Sarah Johnson",
            email: "sarah@example.com",
            location: "London, UK",
            artTitle: "Tribal Statue",
            status: "approved",
            date: "2023-05-12",
          },
          {
            id: "3",
            name: "Michael Brown",
            email: "michael@example.com",
            location: "Toronto, Canada",
            artTitle: "Animal Figurine",
            status: "shipped",
            date: "2023-05-10",
          },
        ])
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      // Fallback to mock data
      setOrders([
        {
          id: "1",
          name: "John Smith",
          email: "john@example.com",
          location: "New York, USA",
          artTitle: "Traditional Mask",
          status: "pending",
          date: "2023-05-15",
        },
        {
          id: "2",
          name: "Sarah Johnson",
          email: "sarah@example.com",
          location: "London, UK",
          artTitle: "Tribal Statue",
          status: "approved",
          date: "2023-05-12",
        },
      ])
    }
  }

  // Fetch art listings
  const fetchArtListings = async () => {
    try {
      const response = await fetch("/api/art-listings")
      if (response.ok) {
        const data = await response.json()
        const formattedData = data.map((item: ArtListing) => ({
          ...item,
          image: item.images?.[0] || "/placeholder.svg?height=100&width=100",
        }))
        setArtListings(formattedData)
      } else {
        console.error("Failed to fetch art listings")
        // Fallback to mock data
        setArtListings([
          {
            id: "1",
            title: "Traditional Mask",
            woodType: "Ebony",
            region: "West Africa",
            price: 120,
            featured: true,
            image: "/placeholder.svg?height=100&width=100",
          },
          {
            id: "2",
            title: "Tribal Statue",
            woodType: "Rosewood",
            region: "East Africa",
            price: 150,
            featured: false,
            image: "/placeholder.svg?height=100&width=100",
          },
        ])
      }
    } catch (error) {
      console.error("Error fetching art listings:", error)
      // Fallback to mock data
      setArtListings([
        {
          id: "1",
          title: "Traditional Mask",
          woodType: "Ebony",
          region: "West Africa",
          price: 120,
          featured: true,
          image: "/placeholder.svg?height=100&width=100",
        },
      ])
    }
  }

  // Fetch blog posts
  const fetchBlogPosts = async () => {
    try {
      const response = await fetch("/api/blog-posts")
      if (response.ok) {
        const data = await response.json()
        setBlogPosts(
          data.map((post: any) => ({
            ...post,
            date: new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
          })),
        )
      } else {
        console.error("Failed to fetch blog posts")
        setBlogPosts([])
      }
    } catch (error) {
      console.error("Error fetching blog posts:", error)
      setBlogPosts([])
    }
  }

  // Fetch team members
  const fetchTeamMembers = async () => {
    try {
      const response = await fetch("/api/team-members")
      if (response.ok) {
        const data = await response.json()
        setTeamMembers(data)
      } else {
        console.error("Failed to fetch team members")
        setTeamMembers([])
      }
    } catch (error) {
      console.error("Error fetching team members:", error)
      setTeamMembers([])
    }
  }

  // Redirect if not signed in or not an admin
  useEffect(() => {
    if (!isLoading && (!isSignedIn || !isAdmin)) {
      router.push("/sign-in?redirect=/dashboard")
    }
  }, [isLoading, isSignedIn, isAdmin, router])

  // Add the file upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files) as FileWithPreview[]

      // Create preview URLs for display
      newFiles.forEach((file) => {
        file.preview = URL.createObjectURL(file)
      })

      setUploadedFiles(newFiles)
    }
  }

  // Add a function to remove a file from the upload list
  const removeFile = (index: number) => {
    setUploadedFiles((prev) => {
      const newFiles = [...prev]
      // Revoke the object URL to avoid memory leaks
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!)
      }
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      uploadedFiles.forEach((file) => {
        if (file.preview) URL.revokeObjectURL(file.preview)
      })
    }
  }, [uploadedFiles])

  if (isLoading || !isSignedIn || !isAdmin) {
    return (
      <MainLayout>
        <div className="container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/order-requests/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        // Update the local state
        setOrders((prevOrders) =>
          prevOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)),
        )
      } else {
        console.error("Failed to update order status")
      }
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  const handleToggleFeatured = async (artId: string) => {
    try {
      const result = await toggleFeatured(artId)

      if (result.success) {
        // Update the local state
        setArtListings((prevListings) =>
          prevListings.map((art) => (art.id === artId ? { ...art, featured: !art.featured } : art)),
        )
      } else {
        console.error("Failed to toggle featured status:", result.message)
      }
    } catch (error) {
      console.error("Error toggling featured status:", error)
    }
  }

  const handleDeleteArt = async (artId: string) => {
    if (window.confirm("Are you sure you want to delete this art listing? This action cannot be undone.")) {
      try {
        const result = await deleteArtListing(artId)

        if (result.success) {
          // Remove from local state
          setArtListings((prevListings) => prevListings.filter((art) => art.id !== artId))
        } else {
          console.error("Failed to delete art listing:", result.message)
        }
      } catch (error) {
        console.error("Error deleting art listing:", error)
      }
    }
  }

  const handleDeleteBlogPost = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
      try {
        const result = await deleteBlogPost(id)

        if (result.success) {
          // Remove from local state
          setBlogPosts((prevPosts) => prevPosts.filter((post) => post.id !== id))
        } else {
          console.error("Failed to delete blog post:", result.message)
        }
      } catch (error) {
        console.error("Error deleting blog post:", error)
      }
    }
  }

  const handleDeleteTeamMember = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this team member? This action cannot be undone.")) {
      try {
        const result = await deleteTeamMember(id)

        if (result.success) {
          // Remove from local state
          setTeamMembers((prevMembers) => prevMembers.filter((member) => member.id !== id))
        } else {
          console.error("Failed to delete team member:", result.message)
        }
      } catch (error) {
        console.error("Error deleting team member:", error)
      }
    }
  }

  const handleEditArt = (artId: string) => {
    setSelectedArtId(artId)
    setIsEditModalOpen(true)
  }

  const handleViewTeamMember = (teamMemberId: string) => {
    setSelectedTeamMemberId(teamMemberId)
    setIsTeamMemberModalOpen(true)
  }

  const handleEditSuccess = () => {
    // Refresh the art listings
    fetchArtListings()
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setUploading(true)

    try {
      const formData = new FormData(e.currentTarget)

      // Add the uploaded files to the form data
      if (uploadedFiles.length > 0) {
        // Remove any existing files first
        formData.delete("images")

        // Add each file to the form data
        uploadedFiles.forEach((file) => {
          formData.append("images", file)
        })
      }

      const result = await createArtListing(formData)

      if (result.success) {
        alert(result.message)
        // Clear the form
        e.currentTarget.reset()
        setUploadedFiles([])

        // Switch to the art tab to show the new listing
        setActiveTab("art")
        fetchArtListings()
      } else {
        alert(result.message)
      }
    } catch (error) {
      console.error("Error uploading art:", error)
      alert("There was an error uploading the art. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  if (activeTab === "upload") {
    return (
      <MainLayout>
        <div className="dashboard-page">
          <div className="container">
            <h1 className="page-title">Admin Dashboard</h1>

            <div className="dashboard-tabs">
              <button
                className={`tab-button ${activeTab === ("orders" as ActiveTabType) ? "active" : ""}`}
                onClick={() => setActiveTab("orders")}
              >
                Order Requests
              </button>
              <button
                className={`tab-button ${activeTab === ("art" as ActiveTabType) ? "active" : ""}`}
                onClick={() => setActiveTab("art")}
              >
                Art Listings
              </button>
              <button
                className={`tab-button ${activeTab === ("upload" as ActiveTabType) ? "active" : ""}`}
                onClick={() => setActiveTab("upload")}
              >
                Upload New Art
              </button>
              <button
                className={`tab-button ${activeTab === ("blog" as ActiveTabType) ? "active" : ""}`}
                onClick={() => setActiveTab("blog")}
              >
                Blog Management
              </button>
              <button
                className={`tab-button ${activeTab === ("team" as ActiveTabType) ? "active" : ""}`}
                onClick={() => setActiveTab("team")}
              >
                Team Management
              </button>
            </div>

            <div className="dashboard-content">
              <div className="upload-tab">
                <h2>Upload New Art</h2>

                <form className="upload-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="title">Art Title</label>
                    <input type="text" id="title" name="title" required />
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea id="description" name="description" rows={5} required></textarea>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="woodType">Wood Type</label>
                      <select id="woodType" name="woodType" required>
                        <option value="">Select Wood Type</option>
                        <option value="Ebony">Ebony</option>
                        <option value="Rosewood">Rosewood</option>
                        <option value="Mahogany">Mahogany</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="region">Region</label>
                      <select id="region" name="region" required>
                        <option value="">Select Region</option>
                        <option value="West Africa">West Africa</option>
                        <option value="East Africa">East Africa</option>
                        <option value="Central Africa">Central Africa</option>
                        <option value="Southern Africa">Southern Africa</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="price">Price ($)</label>
                      <input type="number" id="price" name="price" min="0" step="0.01" required />
                    </div>

                    <div className="form-group">
                      <label htmlFor="size">Size</label>
                      <input type="text" id="size" name="size" placeholder='e.g., 12" x 6" x 3"' required />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="images">Upload Images</label>
                    <input
                      type="file"
                      id="images"
                      name="images"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                    />
                    <p className="help-text">
                      You can upload multiple images. First image will be the main display image.
                    </p>

                    {/* Preview uploaded images */}
                    {uploadedFiles.length > 0 && (
                      <div className="image-previews">
                        <h4>Selected Images:</h4>
                        <div className="preview-grid">
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="preview-item">
                              <div className="preview-image">
                                <Image
                                  src={file.preview || "/placeholder.svg"}
                                  alt={`Preview ${index + 1}`}
                                  width={100}
                                  height={100}
                                />
                              </div>
                              <button type="button" className="remove-image" onClick={() => removeFile(index)}>
                                ✕
                              </button>
                              <p className="image-name">{file.name}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="form-group checkbox-group">
                    <input type="checkbox" id="featured" name="featured" />
                    <label htmlFor="featured">Feature this art piece on the home page</label>
                  </div>

                  <button type="submit" className="button submit-button" disabled={uploading}>
                    {uploading ? "Uploading..." : "Upload Art Listing"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (activeTab === "blog") {
    return (
      <MainLayout>
        <div className="dashboard-page">
          <div className="container">
            <h1 className="page-title">Admin Dashboard</h1>

            <div className="dashboard-tabs">
              <button
                className={`tab-button ${activeTab === ("orders" as ActiveTabType) ? "active" : ""}`}
                onClick={() => setActiveTab("orders")}
              >
                Order Requests
              </button>
              <button
                className={`tab-button ${activeTab === ("art" as ActiveTabType) ? "active" : ""}`}
                onClick={() => setActiveTab("art")}
              >
                Art Listings
              </button>
              <button
                className={`tab-button ${activeTab === ("upload" as ActiveTabType) ? "active" : ""}`}
                onClick={() => setActiveTab("upload")}
              >
                Upload New Art
              </button>
              <button
                className={`tab-button ${activeTab === ("blog" as ActiveTabType) ? "active" : ""}`}
                onClick={() => setActiveTab("blog")}
              >
                Blog Management
              </button>
              <button
                className={`tab-button ${activeTab === ("team" as ActiveTabType) ? "active" : ""}`}
                onClick={() => setActiveTab("team")}
              >
                Team Management
              </button>
            </div>

            <div className="dashboard-content">
              <div className="blog-tab">
                <h2>Blog Posts</h2>

                <div className="blog-actions">
                  <button className="button" onClick={() => router.push("/dashboard/blog/new")}>
                    Create New Blog Post
                  </button>
                </div>

                <div className="blog-table-container">
                  <table className="blog-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Excerpt</th>
                        <th>Category</th>
                        <th>Author</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Featured</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blogPosts.length > 0 ? (
                        blogPosts.map((post) => (
                          <tr key={post.id}>
                            <td className="blog-title">{post.title}</td>
                            <td className="blog-excerpt">{post.excerpt}</td>
                            <td className="blog-category">{post.category}</td>
                            <td>{post.author}</td>
                            <td className="blog-date">{post.date}</td>
                            <td>
                              <span className={`status-badge ${post.status}`}>
                                {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                              </span>
                            </td>
                            <td>
                              <span className={`featured-badge ${post.featured ? "yes" : "no"}`}>
                                {post.featured ? "Yes" : "No"}
                              </span>
                            </td>
                            <td>
                              <div className="art-actions">
                                <button
                                  className="action-button edit"
                                  onClick={() => router.push(`/dashboard/blog/edit/${post.id}`)}
                                >
                                  Edit
                                </button>
                                <button className="action-button delete" onClick={() => handleDeleteBlogPost(post.id)}>
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} style={{ textAlign: "center", padding: "20px" }}>
                            No blog posts found. Create your first blog post!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  // Replace the team tab rendering in the return statement with this:
  // Find the section that starts with {activeTab === "team" && ( and replace it with:

  return (
    <MainLayout>
      <div className="dashboard-page">
        <div className="container">
          <h1 className="page-title">Admin Dashboard</h1>

          <div className="dashboard-tabs">
            <button
              className={`tab-button ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              Order Requests
            </button>
            <button className={`tab-button ${activeTab === "art" ? "active" : ""}`} onClick={() => setActiveTab("art")}>
              Art Listings
            </button>
            <button
              className={`tab-button ${activeTab === ("upload" as ActiveTabType) ? "active" : ""}`}
              onClick={() => setActiveTab("upload")}
            >
              Upload New Art
            </button>
            <button
              className={`tab-button ${activeTab === ("blog" as ActiveTabType) ? "active" : ""}`}
              onClick={() => setActiveTab("blog")}
            >
              Blog Management
            </button>
            <button
              className={`tab-button ${activeTab === ("team" as ActiveTabType) ? "active" : ""}`}
              onClick={() => setActiveTab("team")}
            >
              Team Management
            </button>
          </div>

          <div className="dashboard-content">
            {activeTab === "orders" && (
              <div className="orders-tab">
                <h2>Order Requests</h2>

                <div className="orders-table-container">
                  <table className="orders-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Art Piece</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td>{new Date(order.date).toLocaleDateString()}</td>
                          <td>
                            <div className="customer-info">
                              <span className="customer-name">{order.name}</span>
                              <span className="customer-email">{order.email}</span>
                            </div>
                          </td>
                          <td>{order.artTitle}</td>
                          <td>{order.location}</td>
                          <td>
                            <span className={`status-badge ${order.status}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                          <td>
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              className="status-select"
                            >
                              <option value="pending">Pending</option>
                              <option value="approved">Approved</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "art" && (
              <div className="art-tab">
                <h2>Art Listings</h2>

                <div className="art-table-container">
                  <table className="art-table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Wood Type</th>
                        <th>Region</th>
                        <th>Price</th>
                        <th>Featured</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {artListings.map((art) => (
                        <tr key={art.id}>
                          <td>
                            <div className="art-thumbnail">
                              <Image
                                src={art.image || "/placeholder.svg"}
                                alt={art.title}
                                width={50}
                                height={50}
                                loader={cloudinaryLoader}
                              />
                            </div>
                          </td>
                          <td>{art.title}</td>
                          <td>{art.woodType}</td>
                          <td>{art.region}</td>
                          <td>${art.price.toFixed(2)}</td>
                          <td>
                            <span className={`featured-badge ${art.featured ? "yes" : "no"}`}>
                              {art.featured ? "Yes" : "No"}
                            </span>
                          </td>
                          <td>
                            <div className="art-actions">
                              <button className="action-button edit" onClick={() => handleEditArt(art.id)}>
                                Edit
                              </button>
                              <button className="action-button feature" onClick={() => handleToggleFeatured(art.id)}>
                                {art.featured ? "Unfeature" : "Feature"}
                              </button>
                              <button className="action-button delete" onClick={() => handleDeleteArt(art.id)}>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {activeTab === "team" && (
        <div className="dashboard-content">
          <TeamManagementSection
            teamMembers={teamMembers}
            onViewMember={(id) => {
              setSelectedTeamMemberId(id)
              setIsTeamMemberModalOpen(true)
            }}
            onRefresh={fetchTeamMembers}
          />
        </div>
      )}

      {/* Edit Art Modal */}
      <EditArtModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        artId={selectedArtId}
        onSuccess={handleEditSuccess}
      />

      {/* Team Member Modal */}
      <TeamMemberModal
        isOpen={isTeamMemberModalOpen}
        onClose={() => setIsTeamMemberModalOpen(false)}
        teamMemberId={selectedTeamMemberId}
      />
    </MainLayout>
  )
}
