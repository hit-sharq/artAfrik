import Link from "next/link"
import Image from "next/image"
import MainLayout from "@/components/MainLayout"
import "./home.css"

export default function Home() {
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
            <div className="category-card">
              <div className="category-image">
                <Image src="/placeholder.svg?height=300&width=300" alt="Rosewood Art" width={300} height={300} />
              </div>
              <h3>Rosewood</h3>
              <p>Elegant sculptures with rich, deep reddish-brown tones</p>
            </div>

            <div className="category-card">
              <div className="category-image">
                <Image src="/placeholder.svg?height=300&width=300" alt="Ebony Art" width={300} height={300} />
              </div>
              <h3>Ebony</h3>
              <p>Striking black wood pieces with exceptional durability</p>
            </div>

            <div className="category-card">
              <div className="category-image">
                <Image src="/placeholder.svg?height=300&width=300" alt="Mahogany Art" width={300} height={300} />
              </div>
              <h3>Mahogany</h3>
              <p>Beautiful reddish-brown wood with straight grain</p>
            </div>
          </div>
        </div>
      </section>

      <section className="featured section">
        <div className="container">
          <h2 className="section-title">Featured Artworks</h2>
          <div className="featured-grid">
            {[1, 2, 3, 4].map((item) => (
              <div className="art-card" key={item}>
                <div className="art-image">
                  <Image
                    src="/placeholder.svg?height=400&width=300"
                    alt={`Featured Art ${item}`}
                    width={300}
                    height={400}
                  />
                </div>
                <div className="art-info">
                  <h3>Traditional Mask</h3>
                  <p className="art-origin">West Africa</p>
                  <p className="art-price">$120.00</p>
                  <Link href={`/gallery/${item}`} className="button view-button">
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
                src="/placeholder.svg?height=400&width=600"
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
