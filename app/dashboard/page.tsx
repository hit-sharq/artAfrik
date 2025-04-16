"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@clerk/nextjs"
import MainLayout from "../../components/MainLayout"
import "./dashboard.css"

// Mock data for orders
const mockOrders = [
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
  {
    id: "4",
    name: "Emma Wilson",
    email: "emma@example.com",
    location: "Sydney, Australia",
    artTitle: "Decorative Bowl",
    status: "delivered",
    date: "2023-05-05",
  },
  {
    id: "5",
    name: "David Lee",
    email: "david@example.com",
    location: "Berlin, Germany",
    artTitle: "Wall Hanging",
    status: "pending",
    date: "2023-05-18",
  },
]

// Mock data for art listings
const mockArtListings = [
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
  {
    id: "3",
    title: "Animal Figurine",
    woodType: "Mahogany",
    region: "Central Africa",
    price: 85,
    featured: true,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "4",
    title: "Decorative Bowl",
    woodType: "Ebony",
    region: "Southern Africa",
    price: 95,
    featured: false,
    image: "/placeholder.svg?height=100&width=100",
  },
]

export default function Dashboard() {
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState("orders")
  const [orders, setOrders] = useState(mockOrders)
  const [artListings, setArtListings] = useState(mockArtListings)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkAdminStatus() {
      if (isLoaded && isSignedIn) {
        try {
          const response = await fetch("/api/check-admin")
          const data = await response.json()
          setIsAdmin(data.isAdmin)
        } catch (error) {
          console.error("Error checking admin status:", error)
          setIsAdmin(false)
        } finally {
          setIsLoading(false)
        }
      } else if (isLoaded) {
        setIsLoading(false)
      }
    }

    checkAdminStatus()
  }, [isLoaded, isSignedIn])

  // Redirect if not signed in or not an admin
  useEffect(() => {
    if (!isLoading && (!isSignedIn || !isAdmin)) {
      router.push("/sign-in?redirect=/dashboard")
    }
  }, [isLoading, isSignedIn, isAdmin, router])

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

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)),
    )
  }

  const handleToggleFeatured = (artId: string) => {
    setArtListings((prevListings) =>
      prevListings.map((art) => (art.id === artId ? { ...art, featured: !art.featured } : art)),
    )
  }

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
              className={`tab-button ${activeTab === "upload" ? "active" : ""}`}
              onClick={() => setActiveTab("upload")}
            >
              Upload New Art
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
                              <Image src={art.image || "/placeholder.svg"} alt={art.title} width={50} height={50} />
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
                              <button className="action-button edit" onClick={() => alert(`Edit ${art.title}`)}>
                                Edit
                              </button>
                              <button className="action-button feature" onClick={() => handleToggleFeatured(art.id)}>
                                {art.featured ? "Unfeature" : "Feature"}
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

            {activeTab === "upload" && (
              <div className="upload-tab">
                <h2>Upload New Art</h2>

                <form className="upload-form">
                  <div className="form-group">
                    <label htmlFor="title">Art Title</label>
                    <input type="text" id="title" name="title" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea id="description" name="description" rows={5}></textarea>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="woodType">Wood Type</label>
                      <select id="woodType" name="woodType">
                        <option value="">Select Wood Type</option>
                        <option value="Ebony">Ebony</option>
                        <option value="Rosewood">Rosewood</option>
                        <option value="Mahogany">Mahogany</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="region">Region</label>
                      <select id="region" name="region">
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
                      <input type="number" id="price" name="price" min="0" step="0.01" />
                    </div>

                    <div className="form-group">
                      <label htmlFor="size">Size</label>
<input type="text" id="size" name="size" placeholder='e.g., 12" x 6" x 3"' />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="images">Upload Images</label>
                    <input type="file" id="images" name="images" multiple accept="image/*" />
                    <p className="help-text">
                      You can upload multiple images. First image will be the main display image.
                    </p>
                  </div>

                  <div className="form-group checkbox-group">
                    <input type="checkbox" id="featured" name="featured" />
                    <label htmlFor="featured">Feature this art piece on the home page</label>
                  </div>

                  <button type="submit" className="button submit-button">
                    Upload Art Listing
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
