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
  category: {
    id: string
    name: string
    slug: string
  }
  material?: string
  region: string
  size: string
  images: string[]
}

export default function Home() {
  const [categoryArtworks, setCategoryArtworks] = useState<Artwork[]>([])
  const [featuredArtworks, setFeaturedArtworks] = useState<Artwork[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Function to select artworks to display based on current date, rotating every 24 hours
  function selectArtworksToDisplay(artworks: Artwork[], count: number, excludeIds: string[] = []): Artwork[] {
    if (artworks.length === 0) return []

    // Filter out artworks with ids in excludeIds
    const filteredArtworks = artworks.filter(art => !excludeIds.includes(art.id))
    if (filteredArtworks.length === 0) return []

    const day = new Date().getDate() // day of month 1-31
    const startIndex = day % filteredArtworks.length
    const selected: Artwork[] = []

    for (let i = 0; i < count; i++) {
      selected.push(filteredArtworks[(startIndex + i) % filteredArtworks.length])
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

        // Select up to 2 artworks for categories section
        const selectedCategoryArtworks = selectArtworksToDisplay(artData, Math.min(2, artData.length))
        // Select up to 2 artworks for featured section excluding those selected for categories
        const selectedFeaturedArtworks = selectArtworksToDisplay(artData, Math.min(2, artData.length - selectedCategoryArtworks.length), selectedCategoryArtworks.map(a => a.id))

        setCategoryArtworks(selectedCategoryArtworks)
        setFeaturedArtworks(selectedFeaturedArtworks)
      } catch (error) {
        console.error("Failed to fetch artworks:", error)
        setCategoryArtworks([])
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
            <h1>Discover Authentic Maasai Market Goods</h1>
            <p className="slogan">"Name it, we have it!"</p>
            <p className="hero-description">
              Arts Afrik brings the vibrant spirit of Kenya's Maasai Market to the digital world. We partner directly with local artisans to showcase authentic handmade crafts including beadwork, textiles, jewelry, paintings, home décor, carvings, masks, sculptures, and other handcrafted African art that embody the soul of African design.
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
            Discover our collection of handcrafted Maasai Market goods and African art pieces, from colorful Maasai beadwork and hand-carved sculptures to woven baskets, textiles, jewelry, paintings, home décor, carvings, masks, sculptures, and traditional crafts that embody the soul of African design.
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
            ) : categoryArtworks.length === 0 ? (
              <p>No artworks available</p>
            ) : (
              categoryArtworks.map((art) => (
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
            Unique Maasai Market goods and artworks from each category, showcasing the rich diversity of African craftsmanship including beadwork, textiles, jewelry, paintings, home décor, carvings, masks, sculptures, and other handcrafted art.
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

      <section className="about-preview section">
        <div className="container">
          <div className="about-preview-content">
            <div className="about-preview-text">
              <h2 className="section-title">About Arts Afrik</h2>
              <p>
                Arts Afrik brings the vibrant spirit of Kenya's Maasai Market to the digital world. We partner directly with local artisans, creators, and cooperatives across Kenya to showcase authentic handmade crafts and traditional African art including beadwork, textiles, jewelry, paintings, home décor, carvings, masks, sculptures, and other handcrafted goods.
              </p>
              <p>
                Each piece tells a story of cultural significance, artistic skill, and the natural beauty of African materials. Our mission is to empower artisans, preserve culture, and share African artistry with the world.
              </p>
              <p>
                Our platform includes a comprehensive admin dashboard where administrators can manage art listings, process order requests, create and edit blog posts, and add team members. The admin interface provides full control over content and operations.
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
