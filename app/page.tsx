"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import MainLayout from "../components/MainLayout"
import "./home.css"

interface Category {
  name: string
  description: string
  image: string
}

interface Artwork {
  id: string
  title: string
  description: string
  price: number
  woodType: string
  region: string
  size: string
  images: string[]
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([])
  const [featuredArtworks, setFeaturedArtworks] = useState<Artwork[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        // Fetch categories
        const catRes = await fetch("/api/categories")
        if (!catRes.ok) throw new Error("Failed to fetch categories")
        const catData = await catRes.json()
        setCategories(catData)

        // Fetch featured artworks
        const artRes = await fetch("/api/featured-artworks")
        if (!artRes.ok) throw new Error("Failed to fetch featured artworks")
        const artData = await artRes.json()
        setFeaturedArtworks(artData)
      } catch (error) {
        console.error("Failed to fetch data:", error)
        // Set fallback data if API fails
        setCategories([
          {
            name: "Ebony",
            description: "Striking black wood pieces with exceptional durability",
            image: "/images/ebony.jpg",
          },
          {
            name: "Rosewood",
            description: "Elegant sculptures with rich, deep reddish-brown tones",
            image: "/images/rosewood.jpg",
          },
          {
            name: "Mahogany",
            description: "Beautiful reddish-brown wood with straight grain",
            image: "/images/mahogany.jpg",
          },
        ])

        setFeaturedArtworks([
          {
            id: "1",
            title: "Traditional Mask",
            description: "Hand-carved traditional mask from West Africa",
            price: 120,
            woodType: "Ebony",
            region: "West Africa",
            size: '12" x 6" x 3"',
            images: ["/placeholder.svg?height=400&width=300"],
          },
          {
            id: "2",
            title: "Tribal Statue",
            description: "Authentic tribal statue from East Africa",
            price: 150,
            woodType: "Rosewood",
            region: "East Africa",
            size: '18" x 5" x 5"',
            images: ["/placeholder.svg?height=400&width=300"],
          },
          {
            id: "3",
            title: "Animal Figurine",
            description: "Beautifully crafted animal figurine",
            price: 85,
            woodType: "Mahogany",
            region: "Central Africa",
            size: '8" x 4" x 4"',
            images: ["/placeholder.svg?height=400&width=300"],
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <MainLayout>
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Discover Authentic African Art</h1>
            <p className="slogan">"Name it, we have it!"</p>
            <p className="hero-description">
              Arts Afrik connects you with traditional African art and curios, sourced directly from skilled artisans
              across the continent.
            </p>
            <div className="hero-buttons">
              <Link href="/gallery" className="button primary-button">
                Browse Art
              </Link>
              <Link href="/contact" className="button secondary-button">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="categories section">
        <div className="container">
          <h2 className="section-title">Explore Our Categories</h2>
          <p className="section-subtitle">
            Discover our collection of handcrafted African art pieces, each with unique cultural significance and
            artistic excellence.
          </p>

          <div className="categories-grid">
            {isLoading ? (
              Array(3)
                .fill(0)
                .map((_, i) => (
                  <div className="category-card skeleton" key={i}>
                    <div className="category-image skeleton-image"></div>
                    <div className="skeleton-text"></div>
                    <div className="skeleton-text short"></div>
                  </div>
                ))
            ) : categories.length === 0 ? (
              <p>No categories available</p>
            ) : (
              categories.map((category) => (
                <div className="category-card" key={category.name}>
                  <div className="category-image">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={`${category.name} Art`}
                      fill
                      style={{ objectFit: "cover" }}
                      priority={true}
                    />
                  </div>
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                  <Link href={`/gallery?woodType=${category.name}`} className="button view-button">
                    View Collection
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="featured section">
        <div className="container">
          <h2 className="section-title">Featured Artworks</h2>
          <p className="section-subtitle">
            Our handpicked selection of exceptional African art pieces, showcasing the finest craftsmanship and cultural
            significance.
          </p>

          <div className="featured-grid">
            {isLoading ? (
              Array(3)
                .fill(0)
                .map((_, i) => (
                  <div className="art-card skeleton" key={i}>
                    <div className="art-image skeleton-image"></div>
                    <div className="art-info">
                      <div className="skeleton-text"></div>
                      <div className="skeleton-text short"></div>
                      <div className="skeleton-text short"></div>
                      <div className="skeleton-button"></div>
                    </div>
                  </div>
                ))
            ) : featuredArtworks.length === 0 ? (
              <p>No featured artworks available</p>
            ) : (
              featuredArtworks.map((art) => (
                <div className="art-card" key={art.id}>
                  <div className="art-image">
                    <Image
                      src={art.images[0] || "/placeholder.svg"}
                      alt={art.title}
                      fill
                      style={{ objectFit: "cover" }}
                      priority={true}
                    />
                  </div>
                  <div className="art-info">
                    <h3>{art.title}</h3>
                    <p className="art-origin">{art.region}</p>
                    <p className="art-price">${art.price.toFixed(2)}</p>
                    <Link href={`/gallery/${art.id}`} className="button view-button">
                      View Details
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="view-all">
            <Link href="/gallery" className="button secondary-button">
              View All Artworks
            </Link>
          </div>
        </div>
      </section>

      <section className="about-preview section">
        <div className="container">
          <div className="about-preview-content">
            <div className="about-preview-text">
              <h2 className="section-title">About Arts Afrik</h2>
              <p>
                Arts Afrik is dedicated to showcasing the rich artistic heritage of Africa. We work directly with
                artisans to bring authentic, handcrafted pieces to art lovers around the world.
              </p>
              <p>
                Each piece tells a story of cultural significance, artistic skill, and the natural beauty of African
                materials. Our mission is to support local artisans while preserving traditional craftsmanship.
              </p>
              <Link href="/about" className="button primary-button">
                Learn More About Us
              </Link>
            </div>
            <div className="about-preview-image">
              <Image src="/images/about art artafriks.jpg" alt="African Artisan at Work" width={600} height={400} />
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
