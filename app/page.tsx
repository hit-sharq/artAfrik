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

interface Artisan {
  id: string
  shopName: string | null
  shopSlug: string | null
  shopLogo: string | null
  fullName: string
  specialty: string
  shopBio: string | null
  status: string
}

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  order: number
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([])
  const [featuredArtworks, setFeaturedArtworks] = useState<Artwork[]>([])
  const [featuredArtisans, setFeaturedArtisans] = useState<Artisan[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        // Fetch categories
        const categoriesRes = await fetch("/api/categories")
        if (!categoriesRes.ok) {
          throw new Error("Failed to fetch categories")
        }
        const categoriesData = await categoriesRes.json()
        console.log("Fetched categories:", categoriesData.length, categoriesData)
        setCategories(categoriesData)

        // Try to fetch featured artworks first
        let featuredData: Artwork[] = []
        try {
          const featuredRes = await fetch("/api/featured-artworks")
          if (featuredRes.ok) {
            featuredData = await featuredRes.json()
            console.log("Fetched featured artworks:", featuredData.length)
          }
        } catch (featError) {
          console.log("Could not fetch featured artworks, trying general listings:", featError)
        }

        // If no featured artworks, fetch from general listings as fallback
        if (!featuredData || featuredData.length === 0) {
          console.log("No featured artworks, fetching from general listings...")
          try {
            const listingsRes = await fetch("/api/art-listings?limit=8")
            if (listingsRes.ok) {
              const listingsData = await listingsRes.json()
              console.log("Fetched artworks from listings:", listingsData.length, listingsData)
              featuredData = listingsData
            }
          } catch (listError) {
            console.log("Could not fetch listings either:", listError)
          }
        }

        setFeaturedArtworks(featuredData || [])

        // Fetch featured artisans (approved only)
        try {
          const artisansRes = await fetch("/api/artisans?status=APPROVED")
          if (artisansRes.ok) {
            const artisansData = await artisansRes.json()
            console.log("Fetched artisans:", artisansData.length)
            // Select up to 4 featured artisans
            const selectedArtisans = artisansData.slice(0, 4)
            setFeaturedArtisans(selectedArtisans)
          }
        } catch (artisanError) {
          console.log("Could not fetch artisans:", artisanError)
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
        setCategories([])
        setFeaturedArtworks([])
        setFeaturedArtisans([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Get category icon/symbol based on category name
  const getCategoryIcon = (name: string) => {
    const icons: Record<string, string> = {
      paintings: "🎨",
      sculptures: "🗿",
      textiles: "🧵",
      jewelry: "💍",
      pottery: "🏺",
      woodcarving: "🪵",
      basketry: "🧺",
      masks: "👺",
      leatherwork: "👜",
      metalwork: "⚙️",
    }
    const key = name.toLowerCase()
    return icons[key] || "🎁"
  }

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
              <Link href="/artisan/register" className="artisan-cta">
                🎨 Sell on ArtAfrik
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Artisans Section */}
      {featuredArtisans.length > 0 && (
        <section className="featured-artisans section">
          <div className="container">
            <h2 className="section-title">Meet Our Artisans</h2>
            <p className="section-subtitle">
              Discover the talented creators behind our authentic African art. Each artisan brings unique skills and cultural heritage to their craft.
            </p>

            <div className="artisans-showcase">
              {isLoading ? (
                Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div className="artisan-showcase-card skeleton" key={i}>
                      <div className="artisan-avatar skeleton-image"></div>
                      <div className="skeleton-text"></div>
                      <div className="skeleton-text short"></div>
                    </div>
                  ))
              ) : (
                featuredArtisans.map((artisan) => (
                  <Link 
                    href={`/shop/${artisan.shopSlug}`} 
                    key={artisan.id} 
                    className="artisan-showcase-card"
                    target="_blank"
                  >
                    <div className="artisan-avatar">
                      {artisan.shopLogo ? (
                        <Image
                          src={artisan.shopLogo}
                          alt={artisan.shopName || artisan.fullName}
                          width={80}
                          height={80}
                          style={{ objectFit: "cover", borderRadius: "50%" }}
                        />
                      ) : (
                        (artisan.shopName || artisan.fullName).charAt(0)
                      )}
                    </div>
                    <h3>{artisan.shopName || artisan.fullName}</h3>
                    <p className="artisan-specialty">{artisan.specialty}</p>
                    {artisan.shopBio && (
                      <p className="artisan-bio">
                        {artisan.shopBio.length > 80 
                          ? `${artisan.shopBio.substring(0, 80)}...` 
                          : artisan.shopBio}
                      </p>
                    )}
                    <span className="visit-shop-link">
                      Visit Shop →
                    </span>
                  </Link>
                ))
              )}
            </div>

            <div className="section-cta">
              <Link href="/artisan/register" className="button primary-button">
                🎨 Become an Artisan
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="categories section">
        <div className="container">
          <h2 className="section-title">Explore Our Categories</h2>
          <p className="section-subtitle">
            Discover our collection of handcrafted Maasai Market goods and African art pieces, from colorful Maasai beadwork and hand-carved sculptures to woven baskets, textiles, jewelry, paintings, home décor, carvings, masks, sculptures, and traditional crafts that embody the soul of African design.
          </p>

          <div className="categories-grid">
            {isLoading ? (
              Array(6)
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
                <Link 
                  href={`/gallery?category=${category.slug}`} 
                  key={category.id} 
                  className="category-card"
                >
                  <div className="category-image">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        style={{ objectFit: "cover" }}
                        loader={cloudinaryLoader}
                      />
                    ) : (
                      <div className="category-icon-placeholder">
                        <span className="category-icon">{getCategoryIcon(category.name)}</span>
                      </div>
                    )}
                  </div>
                  <h3>{category.name}</h3>
                  {category.description && (
                    <p>{category.description}</p>
                  )}
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured Artworks Section */}
      <section className="featured section">
        <div className="container">
          <h2 className="section-title">Featured Artworks</h2>
          <p className="section-subtitle">
            Unique handpicked Maasai Market goods and artworks, showcasing the rich diversity of African craftsmanship including beadwork, textiles, jewelry, paintings, home décor, carvings, masks, sculptures, and other handcrafted art.
          </p>

          <div className="featured-grid">
            {isLoading ? (
              Array(4)
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
              <p className="empty-message">No featured artworks at the moment. Check back soon!</p>
            ) : (
              featuredArtworks.map((art) => (
                <div className="art-card" key={art.id}>
                  <Link href={`/gallery/${art.id}`}>
                    <div className="art-image">
                      <Image
                        src={art.images?.[0] || "/placeholder.svg"}
                        alt={art.title}
                        fill
                        style={{ objectFit: "cover" }}
                        loader={cloudinaryLoader}
                      />
                      {art.category && (
                        <span className="art-category-badge">{art.category.name}</span>
                      )}
                    </div>
                  </Link>
                  <div className="art-info">
                    <Link href={`/gallery/${art.id}`}>
                      <h3>{art.title}</h3>
                    </Link>
                    <p className="art-origin">{art.region}</p>
                    <p className="art-price">${art.price?.toFixed(2) || "0.00"}</p>
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
              View All Artworks →
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
                Arts Afrik brings the vibrant spirit of Kenya's Maasai Market to the digital world. We partner directly with local artisans, creators, and cooperatives across Kenya to showcase authentic handmade crafts and traditional African art including beadwork, textiles, jewelry, paintings, home décor, carvings, masks, sculptures, and other handcrafted goods.
              </p>
              <p>
                Each piece tells a story of cultural significance, artistic skill, and the natural beauty of African materials. Our mission is to empower artisans, preserve culture, and share African artistry with the world.
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

