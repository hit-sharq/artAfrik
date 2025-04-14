"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import MainLayout from "@/components/MainLayout"
import "./gallery.css"

// Mock data for art listings
const mockArtListings = [
  {
    id: "1",
    title: "Traditional Mask",
    woodType: "Ebony",
    region: "West Africa",
    price: 120,
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: "2",
    title: "Tribal Statue",
    woodType: "Rosewood",
    region: "East Africa",
    price: 150,
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: "3",
    title: "Animal Figurine",
    woodType: "Mahogany",
    region: "Central Africa",
    price: 85,
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: "4",
    title: "Decorative Bowl",
    woodType: "Ebony",
    region: "Southern Africa",
    price: 95,
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: "5",
    title: "Wall Hanging",
    woodType: "Rosewood",
    region: "West Africa",
    price: 110,
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: "6",
    title: "Ceremonial Staff",
    woodType: "Mahogany",
    region: "East Africa",
    price: 200,
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: "7",
    title: "Decorative Mask",
    woodType: "Ebony",
    region: "Central Africa",
    price: 130,
    image: "/placeholder.svg?height=400&width=300",
  },
  {
    id: "8",
    title: "Tribal Drum",
    woodType: "Rosewood",
    region: "Southern Africa",
    price: 180,
    image: "/placeholder.svg?height=400&width=300",
  },
]

export default function Gallery() {
  const [filters, setFilters] = useState({
    woodType: "",
    region: "",
    priceRange: "",
  })

  const woodTypes = ["All", "Ebony", "Rosewood", "Mahogany"]
  const regions = ["All", "West Africa", "East Africa", "Central Africa", "Southern Africa"]
  const priceRanges = ["All", "Under $100", "$100 - $150", "Over $150"]

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const filteredArt = mockArtListings.filter((art) => {
    // Filter by wood type
    if (filters.woodType && filters.woodType !== "All" && art.woodType !== filters.woodType) {
      return false
    }

    // Filter by region
    if (filters.region && filters.region !== "All" && art.region !== filters.region) {
      return false
    }

    // Filter by price range
    if (filters.priceRange) {
      if (filters.priceRange === "Under $100" && art.price >= 100) {
        return false
      } else if (filters.priceRange === "$100 - $150" && (art.price < 100 || art.price > 150)) {
        return false
      } else if (filters.priceRange === "Over $150" && art.price <= 150) {
        return false
      }
    }

    return true
  })

  return (
    <MainLayout>
      <div className="gallery-page">
        <div className="container">
          <h1 className="page-title">Art Gallery</h1>

          <div className="filters">
            <div className="filter-group">
              <label htmlFor="woodType">Wood Type</label>
              <select id="woodType" name="woodType" value={filters.woodType} onChange={handleFilterChange}>
                {woodTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="region">Region</label>
              <select id="region" name="region" value={filters.region} onChange={handleFilterChange}>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="priceRange">Price Range</label>
              <select id="priceRange" name="priceRange" value={filters.priceRange} onChange={handleFilterChange}>
                {priceRanges.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="gallery-grid">
            {filteredArt.length > 0 ? (
              filteredArt.map((art) => (
                <div className="art-card" key={art.id}>
                  <div className="art-image">
                    <Image src={art.image || "/placeholder.svg"} alt={art.title} width={300} height={400} />
                  </div>
                  <div className="art-info">
                    <h3>{art.title}</h3>
                    <p className="art-details">
                      {art.woodType} • {art.region}
                    </p>
                    <p className="art-price">${art.price.toFixed(2)}</p>
                    <Link href={`/gallery/${art.id}`} className="button view-button">
                      View Details
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <p>No artworks match your selected filters. Please try different criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
