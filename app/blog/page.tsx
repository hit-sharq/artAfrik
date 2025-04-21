"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import MainLayout from "@/components/MainLayout"
import "./blog.css"

// Import the cloudinaryLoader
import { cloudinaryLoader } from "@/lib/cloudinary"

// Mock data for blog posts
const blogPosts = [
  {
    id: "1",
    title: "The Rich History of West African Masks",
    slug: "west-african-masks-history",
    excerpt:
      "Explore the cultural significance and artistic traditions behind West African ceremonial masks and their importance in various rituals and celebrations.",
    category: "Art History",
    author: "Lilian Ndanu",
    date: "April 15, 2025",
    image: "/placeholder.svg?height=400&width=600",
    featured: true,
  },
  {
    id: "2",
    title: "Sustainable Wood Sourcing in African Art",
    slug: "sustainable-wood-sourcing",
    excerpt:
      "Learn about how modern African artisans are balancing traditional craftsmanship with sustainable practices to preserve both cultural heritage and natural resources.",
    category: "Sustainability",
    author: "Joshua Mwendwa",
    date: "April 10, 2025",
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
  },
  {
    id: "3",
    title: "Symbolism in East African Sculptures",
    slug: "east-african-sculpture-symbolism",
    excerpt:
      "Discover the hidden meanings and symbolic elements commonly found in traditional East African wooden sculptures and their connection to spiritual beliefs.",
    category: "Art Appreciation",
    author: "Mutuku Moses",
    date: "April 5, 2025",
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
  },
  {
    id: "4",
    title: "The Modern Market for Traditional African Art",
    slug: "modern-market-traditional-art",
    excerpt:
      "An analysis of how global appreciation for traditional African art has evolved and the current market trends affecting artisans and collectors alike.",
    category: "Market Trends",
    author: "Lilian Ndanu",
    date: "March 28, 2025",
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
  },
  {
    id: "5",
    title: "Caring for Your Wooden Art Pieces",
    slug: "caring-for-wooden-art",
    excerpt:
      "Essential tips for maintaining and preserving your wooden African art pieces to ensure they remain beautiful for generations to come.",
    category: "Care Guide",
    author: "Joshua Mwendwa",
    date: "March 20, 2025",
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
  },
  {
    id: "6",
    title: "The Art of Ebony Carving",
    slug: "ebony-carving-techniques",
    excerpt:
      "A deep dive into the specialized techniques used by master carvers to transform ebony wood into intricate and stunning works of art.",
    category: "Craftsmanship",
    author: "Mutuku Moses",
    date: "March 15, 2025",
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
  },
]

// Get all unique categories from blog posts
const allCategories = ["All", ...new Set(blogPosts.map((post) => post.category))]

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter posts based on selected category and search query
  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Get featured post
  const featuredPost = blogPosts.find((post) => post.featured)

  return (
    <MainLayout>
      <div className="blog-page">
        <div className="container">
          <h1 className="page-title">Arts Afrik Blog</h1>
          <p className="blog-intro">
            Discover the stories, traditions, and craftsmanship behind African art. Our blog features insights from
            experts, care tips, and the cultural significance of traditional pieces.
          </p>

          {featuredPost && (
            <div className="featured-post">
              <div className="featured-image">
                <Image
                  src={featuredPost.image || "/placeholder.svg"}
                  alt={featuredPost.title}
                  width={800}
                  height={500}
                  className="featured-img"
                  loader={cloudinaryLoader}
                />
                <div className="featured-badge">Featured</div>
              </div>
              <div className="featured-content">
                <div className="post-meta">
                  <span className="post-category">{featuredPost.category}</span>
                  <span className="post-date">{featuredPost.date}</span>
                </div>
                <h2 className="featured-title">{featuredPost.title}</h2>
                <p className="featured-excerpt">{featuredPost.excerpt}</p>
                <div className="post-footer">
                  <span className="post-author">By {featuredPost.author}</span>
                  <Link href={`/blog/${featuredPost.slug}`} className="read-more">
                    Read Full Article
                  </Link>
                </div>
              </div>
            </div>
          )}

          <div className="blog-controls">
            <div className="category-filter">
              <label htmlFor="category">Filter by Category:</label>
              <select id="category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                {allCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="blog-grid">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <div className="blog-card" key={post.id}>
                  <div className="blog-image">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      width={400}
                      height={250}
                      loader={cloudinaryLoader}
                    />
                  </div>
                  <div className="blog-content">
                    <div className="post-meta">
                      <span className="post-category">{post.category}</span>
                      <span className="post-date">{post.date}</span>
                    </div>
                    <h3 className="blog-title">{post.title}</h3>
                    <p className="blog-excerpt">{post.excerpt}</p>
                    <div className="post-footer">
                      <span className="post-author">By {post.author}</span>
                      <Link href={`/blog/${post.slug}`} className="read-more">
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <p>No blog posts match your search criteria. Please try a different search or category.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
