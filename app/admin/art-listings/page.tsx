"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Filter, Plus, Edit, Trash, Eye } from "lucide-react"

// Mock data for art listings
const initialArtListings = [
  {
    id: "1",
    title: "Traditional Mask",
    woodType: "Ebony",
    region: "West Africa",
    price: 120,
    stock: 3,
    featured: true,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "2",
    title: "Tribal Statue",
    woodType: "Rosewood",
    region: "East Africa",
    price: 150,
    stock: 5,
    featured: false,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "3",
    title: "Animal Figurine",
    woodType: "Mahogany",
    region: "Central Africa",
    price: 85,
    stock: 2,
    featured: true,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "4",
    title: "Decorative Bowl",
    woodType: "Ebony",
    region: "Southern Africa",
    price: 95,
    stock: 0,
    featured: false,
    image: "/placeholder.svg?height=100&width=100",
  },
]

export default function ArtListingsPage() {
  const [artListings, setArtListings] = useState(initialArtListings)
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading data from API
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this art listing?")) {
      setArtListings(artListings.filter((art) => art.id !== id))
    }
  }

  const toggleFeatured = (id: string) => {
    setArtListings(artListings.map((art) => (art.id === id ? { ...art, featured: !art.featured } : art)))
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Art Listings</h1>
        <div className="header-actions">
          <Link href="/admin/art-listings/new" className="action-button add">
            <Plus size={16} />
            Add New Artwork
          </Link>
          <button className="filter-button">
            <Filter size={16} />
            Filter
          </button>
        </div>
      </div>

      <div className="art-listings-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Wood Type</th>
              <th>Region</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="loading-cell">
                  Loading art listings...
                </td>
              </tr>
            ) : (
              artListings.map((art) => (
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
                    <span
                      className={`stock-badge ${art.stock === 0 ? "out-of-stock" : art.stock < 3 ? "low-stock" : ""}`}
                    >
                      {art.stock === 0 ? "Out of stock" : art.stock}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`featured-toggle ${art.featured ? "featured" : "not-featured"}`}
                      onClick={() => toggleFeatured(art.id)}
                    >
                      {art.featured ? "Featured" : "Not Featured"}
                    </button>
                  </td>
                  <td>
                    <div className="row-actions">
                      <Link href={`/gallery/${art.id}`} className="action-icon view" title="View">
                        <Eye size={16} />
                      </Link>
                      <Link href={`/admin/art-listings/edit/${art.id}`} className="action-icon edit" title="Edit">
                        <Edit size={16} />
                      </Link>
                      <button className="action-icon delete" title="Delete" onClick={() => handleDelete(art.id)}>
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
