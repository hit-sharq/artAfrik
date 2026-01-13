
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { prisma } from "lib/prisma"
import { cloudinaryLoader } from "lib/cloudinary"
import "./shop.css"

interface ShopPageProps {
  params: Promise<{ slug: string }>
}

async function getShopData(slug: string) {
  const artisan = await prisma.artisan.findFirst({
    where: {
      shopSlug: slug,
      status: "APPROVED",
    },
    include: {
      artListings: {
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: { artListings: true },
      },
    },
  })

  return artisan
}

export async function generateMetadata({ params }: ShopPageProps) {
  const { slug } = await params
  const artisan = await getShopData(slug)

  if (!artisan) {
    return {
      title: "Shop Not Found | ArtAfrik",
    }
  }

  return {
    title: `${artisan.shopName || artisan.fullName} | ArtAfrik`,
    description: artisan.shopBio?.substring(0, 160) || `Shop of ${artisan.fullName}, a ${artisan.specialty} artisan from ${artisan.region}`,
  }
}

export default async function ArtisanShopPage({ params }: ShopPageProps) {
  const { slug } = await params
  const artisan = await getShopData(slug)

  if (!artisan) {
    notFound()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  return (
    <div className="artisan-shop-page">
      {/* Shop Header */}
      <div className="shop-header">
        {artisan.shopBanner && (
          <div className="shop-banner">
            <Image
              src={artisan.shopBanner}
              alt={`${artisan.shopName || artisan.fullName} banner`}
              fill
              style={{ objectFit: "cover" }}
              loader={cloudinaryLoader}
              priority
            />
          </div>
        )}
        <div className="shop-header-content">
          <div className="shop-logo-container">
            {artisan.shopLogo ? (
              <Image
                src={artisan.shopLogo}
                alt={`${artisan.shopName || artisan.fullName} logo`}
                width={120}
                height={120}
                className="shop-logo"
                loader={cloudinaryLoader}
              />
            ) : (
              <div className="shop-logo-placeholder">
                {artisan.fullName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="shop-info">
            <h1>{artisan.shopName || artisan.fullName}</h1>
            <div className="shop-meta">
              <span className="location">
                📍 {artisan.location || artisan.region}
              </span>
              <span className="specialty">
                🎨 {artisan.specialty}
              </span>
              <span className="product-count">
                📦 {artisan._count.artListings} products
              </span>
            </div>
            {artisan.shopBio && (
              <p className="shop-bio">{artisan.shopBio}</p>
            )}
            <div className="shop-social">
              {artisan.website && (
                <a href={artisan.website} target="_blank" rel="noopener noreferrer">
                  🌐 Website
                </a>
              )}
              {artisan.instagram && (
                <a href={`https://instagram.com/${artisan.instagram}`} target="_blank" rel="noopener noreferrer">
                  📷 Instagram
                </a>
              )}
              {artisan.facebook && (
                <a href={artisan.facebook} target="_blank" rel="noopener noreferrer">
                  📘 Facebook
                </a>
              )}
              {artisan.whatsapp && (
                <a href={`https://wa.me/${artisan.whatsapp}`} target="_blank" rel="noopener noreferrer">
                  💬 WhatsApp
                </a>
              )}
            </div>
          </div>
          <div className="shop-contact">
            <a href={`mailto:${artisan.email}`} className="contact-button">
              Contact Artisan
            </a>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="shop-content">
        <section className="products-section">
          <h2>
            {artisan.shopName || artisan.fullName}&apos;s Products
            <span className="product-count-badge">
              {artisan._count.artListings} items
            </span>
          </h2>

          {artisan.artListings.length === 0 ? (
            <div className="empty-products">
              <p>No products available yet.</p>
              <p>Check back soon for new handcrafts!</p>
            </div>
          ) : (
            <div className="products-grid">
              {artisan.artListings.map((product) => (
                <Link
                  key={product.id}
                  href={`/gallery/${product.id}`}
                  className="product-card"
                >
                  <div className="product-image">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        style={{ objectFit: "cover" }}
                        loader={cloudinaryLoader}
                      />
                    ) : (
                      <div className="placeholder-image">No Image</div>
                    )}
                    {product.featured && (
                      <span className="featured-badge">Featured</span>
                    )}
                  </div>
                  <div className="product-info">
                    <h3>{product.title}</h3>
                    <p className="product-price">{formatPrice(product.price)}</p>
                    <p className="product-region">📍 {product.region}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

