"use client"

import React, { useEffect, useState } from "react"
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

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories")
        const data = await res.json()
        setCategories(data)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }

    async function fetchFeaturedArtworks() {
      try {
        const res = await fetch("/api/featured-artworks")
        const data = await res.json()
        setFeaturedArtworks(data)
      } catch (error) {
        console.error("Failed to fetch featured artworks:", error)
      }
    }

    fetchCategories()
    fetchFeaturedArtworks()
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
          <div className="categories-grid">
            {categories.length === 0 && <p>Loading categories...</p>}
            {categories.map((category) => (
              <div className="category-card" key={category.name}>
                <div className="category-image">
                  <Image
                    src={category.image}
                    alt={`${category.name} Art`}
                    width={300}
                    height={300}
                    priority={true}
                  />
                </div>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="featured section">
        <div className="container">
          <h2 className="section-title">Featured Artworks</h2>
          <div className="featured-grid">
            {featuredArtworks.length === 0 && <p>Loading featured artworks...</p>}
            {featuredArtworks.map((art) => (
              <div className="art-card" key={art.id}>
                <div className="art-image">
                  <Image
                    src={art.images[0] || "/placeholder.svg"}
                    alt={art.title}
                    width={300}
                    height={400}
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
            ))}
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
                materials.
              </p>
              <Link href="/about" className="button secondary-button">
                Learn More About Us
              </Link>
            </div>
            <div className="about-preview-image">
              <Image
                src="/images/about art artafriks.jpg"
                alt="African Artisan at Work"
                width={600}
                height={400}
              />
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
