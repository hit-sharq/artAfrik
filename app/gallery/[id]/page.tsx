"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import MainLayout from "@/components/MainLayout"
import "./product-detail.css"

// Mock data for art listings
const mockArtListings = [
  {
    id: "1",
    title: "Traditional Mask",
    description:
      "This traditional mask is hand-carved from ebony wood by skilled artisans in West Africa. Each piece is unique and carries cultural significance, representing ancestral spirits and traditional ceremonies.",
    woodType: "Ebony",
    region: "West Africa",
    size: '12" x 6" x 3"',
    price: 120,
    images: [
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
    ],
  },
  {
    id: "2",
    title: "Tribal Statue",
    description:
      "This tribal statue is meticulously crafted from rosewood, showcasing the rich artistic traditions of East Africa. The statue represents fertility and abundance, and is often used in ceremonial contexts.",
    woodType: "Rosewood",
    region: "East Africa",
    size: '18" x 5" x 5"',
    price: 150,
    images: [
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
      "/placeholder.svg?height=600&width=400",
    ],
  },
  // Add more mock data as needed
]

export default function ProductDetail() {
  const { id } = useParams()
  const [activeImage, setActiveImage] = useState(0)

  // Find the art piece with the matching ID
  const art = mockArtListings.find((item) => item.id === id)

  if (!art) {
    return (
      <MainLayout>
        <div className="container">
          <div className="not-found">
            <h1>Art Piece Not Found</h1>
            <p>Sorry, we couldn't find the art piece you're looking for.</p>
            <Link href="/gallery" className="button">
              Return to Gallery
            </Link>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="product-detail">
        <div className="container">
          <div className="product-content">
            <div className="product-gallery">
              <div className="main-image">
                <Image src={art.images[activeImage] || "/placeholder.svg"} alt={art.title} width={400} height={600} />
              </div>
              <div className="thumbnail-gallery">
                {art.images.map((image, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${activeImage === index ? "active" : ""}`}
                    onClick={() => setActiveImage(index)}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${art.title} - View ${index + 1}`}
                      width={100}
                      height={100}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="product-info">
              <h1>{art.title}</h1>

              <div className="product-meta">
                <div className="meta-item">
                  <span className="meta-label">Wood Type:</span>
                  <span className="meta-value">{art.woodType}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Origin:</span>
                  <span className="meta-value">{art.region}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Size:</span>
                  <span className="meta-value">{art.size}</span>
                </div>
                <div className="meta-item price">
                  <span className="meta-label">Price:</span>
                  <span className="meta-value">${art.price.toFixed(2)}</span>
                </div>
              </div>

              <div className="product-description">
                <h2>Description</h2>
                <p>{art.description}</p>
              </div>

              <Link href={`/order/${art.id}`} className="button request-button">
                Request This Piece
              </Link>
            </div>
          </div>

          <div className="related-products">
            <h2>You May Also Like</h2>
            <div className="related-grid">
              {mockArtListings
                .filter((item) => item.id !== id)
                .slice(0, 3)
                .map((item) => (
                  <div className="art-card" key={item.id}>
                    <div className="art-image">
                      <Image src={item.images[0] || "/placeholder.svg"} alt={item.title} width={300} height={400} />
                    </div>
                    <div className="art-info">
                      <h3>{item.title}</h3>
                      <p className="art-details">
                        {item.woodType} • {item.region}
                      </p>
                      <p className="art-price">${item.price.toFixed(2)}</p>
                      <Link href={`/gallery/${item.id}`} className="button view-button">
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
