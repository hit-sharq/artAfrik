"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import MainLayout from "../components/MainLayout"
import "./home.css"
import { cloudinaryLoader } from "../lib/cloudinary"

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
  const [featuredArtworks, setFeaturedArtworks] = useState<Artwork[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Function to select artworks to display based on current date, rotating every 24 hours
  function selectArtworksToDisplay(artworks: Artwork[], count: number): Artwork[] {
    if (artworks.length === 0) return []

    const day = new Date().getDate() // day of month 1-31
    const startIndex = day % artworks.length
    const selected: Artwork[] = []

    for (let i = 0; i < count; i++) {
      selected.push(artworks[(startIndex + i) % artworks.length])
    }
    return selected
  }
  useEffect(() => {
    async function fetchArtworks() {
      setIsLoading(true)
      try {
        // Fetch all artworks from gallery with a high limit to get all
        const artRes = await fetch("/api/art-listings?limit=100")
        if (!artRes.ok) throw new Error("Failed to fetch gallery artworks")
        const artData: Artwork[] = await artRes.json()

        // Select 2 artworks to display, rotating every 24 hours
        const selectedArtworks = selectArtworksToDisplay(artData, 2)
        setFeaturedArtworks(selectedArtworks)
      } catch (error) {
        console.error("Failed to fetch artworks:", error)
        setFeaturedArtworks([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchArtworks()
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
              Array(2)
                .fill(0)
                .map((_, i) => (
                  <div className="category-card skeleton" key={i}>
                    <div className="category-image skeleton-image"></div>
                    <div className="skeleton-text"></div>
                    <div className="skeleton-text short"></div>
                  </div>
                ))
            ) : featuredArtworks.length === 0 ? (
              <p>No artworks available</p>
            ) : (
              featuredArtworks.map((art) => (
                <div className="category-card" key={art.id}>
                  <div className="category-image">
                    <Image
                      src={art.images[0] || "/placeholder.svg"}
                      alt={art.title}
                      fill
                      style={{ objectFit: "cover" }}
                      priority={true}
                      loader={cloudinaryLoader}
                    />
                  </div>
                  <h3>{art.title}</h3>
                  <p>{art.description}</p>
                  <p className="art-origin">{art.region}</p>
                  <p className="art-price">${art.price.toFixed(2)}</p>
                  <Link href={`/gallery/${art.id}`} className="button view-button">
                    View Details
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="featured section">
        <div className="container">
          <h2 className="section-title">Featured Artworks by Category</h2>
          <p className="section-subtitle">
            Unique artworks from each category, sourced from the gallery.
          </p>

          <div className="featured-grid">
            {isLoading ? (
              Array(2)
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
              <p>No artworks available</p>
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
                      loader={cloudinaryLoader}
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
              <Image
                src="/images/about art artafriks.jpg"
                alt="African Artisan at Work"
                width={600}
                height={400}
                loader={cloudinaryLoader}
              />
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}



