"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import MainLayout from "../../components/MainLayout"
import "./gallery.css"

interface ArtListing {
  id: string
  title: string
  woodType: string
  region: string
  price: number
  image: string
}

export default function Gallery() {
  const searchParams = useSearchParams()
  const initialWoodType = searchParams.get("woodType") || ""
  const initialRegion = searchParams.get("region") || ""

  const [filters, setFilters] = useState({
    woodType: initialWoodType,
    region: initialRegion,
    priceRange: "",
    sortBy: "newest",
  })

  const [artListings, setArtListings] = useState<ArtListing[]>([])
  const [filteredArt, setFilteredArt] = useState<ArtListing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const woodTypes = ["All", "Ebony", "Rosewood", "Mahogany"]
  const regions = ["All", "West Africa", "East Africa", "Central Africa", "Southern Africa"]
  const priceRanges = ["All", "Under $100", "$100 - $150", "Over $150"]
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "priceAsc", label: "Price: Low to High" },
    { value: "priceDesc", label: "Price: High to Low" },
    { value: "nameAsc", label: "Name: A to Z" },
    { value: "nameDesc", label: "Name: Z to A" },
  ]

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchArtListings = async () => {
      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Mock data
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

        setArtListings(mockArtListings)
      } catch (error) {
        console.error("Error fetching art listings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchArtListings()
  }, [])

  useEffect(() => {
    // Apply filters and sorting
    let result = [...artListings]

    // Filter by wood type
    if (filters.woodType && filters.woodType !== "All") {
      result = result.filter((art) => art.woodType === filters.woodType)
    }

    // Filter by region
    if (filters.region && filters.region !== "All") {
      result = result.filter((art) => art.region === filters.region)
    }

    // Filter by price range
    if (filters.priceRange) {
      if (filters.priceRange === "Under $100") {
        result = result.filter((art) => art.price < 100)
      } else if (filters.priceRange === "$100 - $150") {
        result = result.filter((art) => art.price >= 100 && art.price <= 150)
      } else if (filters.priceRange === "Over $150") {
        result = result.filter((art) => art.price > 150)
      }
    }

    // Apply sorting
    if (filters.sortBy === "newest") {
      // In a real app, you would sort by createdAt date
      // Here we just keep the original order
    } else if (filters.sortBy === "oldest") {
      result = [...result].reverse()
    } else if (filters.sortBy === "priceAsc") {
      result = [...result].sort((a, b) => a.price - b.price)
    } else if (filters.sortBy === "priceDesc") {
      result = [...result].sort((a, b) => b.price - a.price)
    } else if (filters.sortBy === "nameAsc") {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title))
    } else if (filters.sortBy === "nameDesc") {
      result = [...result].sort((a, b) => b.title.localeCompare(a.title))
    }

    setFilteredArt(result)
  }, [artListings, filters])

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const clearFilters = () => {
    setFilters({
      woodType: "",
      region: "",
      priceRange: "",
      sortBy: "newest",
    })
  }

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "grid" ? "list" : "grid"))
  }

  return (
    <MainLayout>
      <div className="gallery-page">
        <div className="container">
          <div className="gallery-header">
            <h1 className="page-title">Art Gallery</h1>
            <p className="gallery-description">
              Explore our collection of authentic African art pieces, each handcrafted with cultural significance and
              artistic excellence.
            </p>
          </div>

          <div className="gallery-controls">
            <div className="filters-container">
              <div className="filters">
                <div className="filter-group">
                  <label htmlFor="woodType">Wood Type</label>
                  <select id="woodType" name="woodType" value={filters.woodType} onChange={handleFilterChange}>
                    <option value="">All Types</option>
                    {woodTypes
                      .filter((type) => type !== "All")
                      .map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label htmlFor="region">Region</label>
                  <select id="region" name="region" value={filters.region} onChange={handleFilterChange}>
                    <option value="">All Regions</option>
                    {regions
                      .filter((region) => region !== "All")
                      .map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label htmlFor="priceRange">Price Range</label>
                  <select id="priceRange" name="priceRange" value={filters.priceRange} onChange={handleFilterChange}>
                    <option value="">All Prices</option>
                    {priceRanges
                      .filter((range) => range !== "All")
                      .map((range) => (
                        <option key={range} value={range}>
                          {range}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label htmlFor="sortBy">Sort By</label>
                  <select id="sortBy" name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="filter-actions">
                <button className="clear-filters" onClick={clearFilters}>
                  Clear Filters
                </button>
                <button className="view-toggle" onClick={toggleViewMode}>
                  {viewMode === "grid" ? "List View" : "Grid View"}
                </button>
              </div>
            </div>

            <div className="results-info">
              Showing {filteredArt.length} {filteredArt.length === 1 ? "result" : "results"}
            </div>
          </div>

          {isLoading ? (
            <div className={`gallery-${viewMode}`}>
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <div className={`art-card skeleton ${viewMode === "list" ? "list-view" : ""}`} key={i}>
                    <div className="art-image skeleton-image"></div>
                    <div className="art-info">
                      <div className="skeleton-text"></div>
                      <div className="skeleton-text short"></div>
                      <div className="skeleton-text short"></div>
                      <div className="skeleton-button"></div>
                    </div>
                  </div>
                ))}
            </div>
          ) : filteredArt.length > 0 ? (
            <div className={`gallery-${viewMode}`}>
              {filteredArt.map((art) => (
                <div className={`art-card ${viewMode === "list" ? "list-view" : ""}`} key={art.id}>
                  <div className="art-image">
                    <Image src={art.image || "/placeholder.svg"} alt={art.title} fill style={{ objectFit: "cover" }} />
                    <div className="art-overlay">
                      <Link href={`/gallery/${art.id}`} className="quick-view">
                        Quick View
                      </Link>
                    </div>
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
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>No artworks match your selected filters. Please try different criteria.</p>
              <button className="button" onClick={clearFilters}>
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
