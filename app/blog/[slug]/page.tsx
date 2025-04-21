"use client"

import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import MainLayout from "@/components/MainLayout"
import "./blog-post.css"

// Import the cloudinaryLoader
import { cloudinaryLoader } from "@/lib/cloudinary"

// Mock data for blog posts
const blogPosts = [
  {
    id: "1",
    title: "The Rich History of West African Masks",
    slug: "west-african-masks-history",
    content: `
      <p>West African masks represent one of the most distinctive and celebrated art forms to emerge from the African continent. These masks are not merely decorative objects but serve as important cultural artifacts with deep spiritual and social significance.</p>
      
      <h2>Cultural Significance</h2>
      <p>In many West African societies, masks are used in ritual ceremonies, initiations, and social events. They often represent spirits, ancestors, or mythological characters and are believed to transform the wearer, allowing them to embody the spirit represented by the mask.</p>
      
      <p>The Dogon people of Mali, for example, use masks in ceremonies that connect the living with their ancestors. The intricate designs and patterns carved into these masks tell stories of creation myths and important historical events.</p>
      
      <h2>Artistic Traditions</h2>
      <p>The craftsmanship involved in creating these masks requires years of training and apprenticeship. Master carvers use techniques passed down through generations, working primarily with local hardwoods like ebony, iroko, and mahogany.</p>
      
      <p>Regional variations in style are significant. Masks from the Dan people of Liberia and Côte d'Ivoire often feature smooth, oval faces with delicate features, while Senufo masks might incorporate geometric patterns and animal motifs.</p>
      
      <h2>Modern Relevance</h2>
      <p>Today, these masks continue to play an important role in cultural preservation efforts. While some are still used in traditional ceremonies, others have found their way into museums and private collections worldwide, serving as ambassadors of African artistic heritage.</p>
      
      <p>Contemporary African artists also draw inspiration from these traditional forms, creating modern interpretations that bridge the gap between ancient traditions and contemporary artistic expression.</p>
      
      <h2>Preservation Challenges</h2>
      <p>The preservation of authentic mask-making traditions faces several challenges, including the commercialization of African art, the decline of traditional religious practices, and the aging of master craftsmen without sufficient numbers of apprentices to carry on their knowledge.</p>
      
      <p>Organizations across West Africa are working to document these traditions and support artisans who maintain the authentic techniques and cultural knowledge associated with mask-making.</p>
    `,
    category: "Art History",
    author: "Lilian Ndanu",
    authorTitle: "Cultural Specialist, PhD in Arts",
    authorBio:
      "Lilian specializes in the cultural and historical context of traditional African art forms. She has conducted extensive field research across West Africa.",
    authorImage: "/images/lilian.jpg",
    date: "April 15, 2025",
    image: "/placeholder.svg?height=600&width=1200",
    tags: ["Masks", "West Africa", "Cultural Heritage", "Rituals", "Woodcarving"],
  },
  {
    id: "2",
    title: "Sustainable Wood Sourcing in African Art",
    slug: "sustainable-wood-sourcing",
    content: `
      <p>The creation of traditional African wooden art pieces has relied on local hardwoods for centuries. Today, as environmental concerns grow and forests face increasing pressure, artisans are adapting their practices to ensure sustainability.</p>
      
      <h2>Traditional Woods in African Art</h2>
      <p>Historically, African artisans have favored dense hardwoods like ebony, rosewood, and mahogany for their durability, beautiful grain patterns, and ability to hold intricate carving details. These woods have been central to creating masks, statues, and functional items that have defined African artistic traditions.</p>
      
      <p>However, many of these wood species now face threats from overexploitation, illegal logging, and habitat loss. Ebony, in particular, has become increasingly rare and is now protected in many regions.</p>
      
      <h2>Sustainable Alternatives</h2>
      <p>Forward-thinking artisans are exploring several approaches to sustainability:</p>
      
      <ul>
        <li><strong>Alternative Woods:</strong> Using faster-growing local species that can provide similar aesthetic qualities while being more abundant and renewable.</li>
        <li><strong>Reclaimed Wood:</strong> Repurposing wood from old buildings, furniture, or fallen trees to create new art pieces.</li>
        <li><strong>Managed Forestry:</strong> Working with certified sustainable forestry operations that ensure trees are replanted and ecosystems maintained.</li>
      </ul>
      
      <h2>Community Forestry Initiatives</h2>
      <p>In several regions across Africa, community-based forestry programs are helping to balance artistic traditions with environmental stewardship. These programs give local communities control over their forest resources while providing training in sustainable harvesting methods.</p>
      
      <p>In Ghana, for example, the Kumasi Wood Carvers Association works with forestry officials to ensure members have access to legally and sustainably harvested wood, while also participating in reforestation efforts.</p>
      
      <h2>Certification and Market Access</h2>
      <p>International certification programs like the Forest Stewardship Council (FSC) are helping artisans demonstrate their commitment to sustainability. These certifications can also provide access to environmentally conscious markets where consumers are willing to pay premium prices for sustainably sourced art.</p>
      
      <p>The challenge remains to make these certification processes accessible and affordable for small-scale artisans and cooperatives.</p>
      
      <h2>The Path Forward</h2>
      <p>Balancing tradition with sustainability requires ongoing innovation and adaptation. By embracing sustainable practices, African artisans are not only preserving their natural resources but also ensuring that their artistic traditions can continue for generations to come.</p>
      
      <p>As consumers, we can support these efforts by seeking out art pieces that come with information about their sourcing and by being willing to pay fair prices that reflect the true environmental and cultural value of these works.</p>
    `,
    category: "Sustainability",
    author: "Joshua Mwendwa",
    authorTitle: "Artisan Relations Specialist",
    authorBio:
      "Joshua works directly with artisan communities across Africa, focusing on sustainable practices and fair trade partnerships.",
    authorImage: "/images/7386.jpg",
    date: "April 10, 2025",
    image: "/placeholder.svg?height=600&width=1200",
    tags: ["Sustainability", "Wood Sourcing", "Environmental Conservation", "Artisan Practices"],
  },
  {
    id: "3",
    title: "Symbolism in East African Sculptures",
    slug: "east-african-sculpture-symbolism",
    content: `<p>Sample content for East African Sculptures article...</p>`,
    category: "Art Appreciation",
    author: "Mutuku Moses",
    authorTitle: "Founder & Curator",
    authorBio:
      "With over 7 years of experience working with African art, Musa founded Arts Afrik to share his passion for traditional craftsmanship.",
    authorImage: "/images/musa.JPG",
    date: "April 5, 2025",
    image: "/placeholder.svg?height=600&width=1200",
    tags: ["East Africa", "Symbolism", "Sculpture", "Cultural Meaning"],
  },
  {
    id: "4",
    title: "The Modern Market for Traditional African Art",
    slug: "modern-market-traditional-art",
    content: `<p>Sample content for Modern Market article...</p>`,
    category: "Market Trends",
    author: "Lilian Ndanu",
    authorTitle: "Cultural Specialist, PhD in Arts",
    authorBio:
      "Lilian provides expert knowledge on the cultural context and historical significance of each art piece.",
    authorImage: "/images/lilian.jpg",
    date: "March 28, 2025",
    image: "/placeholder.svg?height=600&width=1200",
    tags: ["Market Trends", "Collectors", "Global Art Market", "Valuation"],
  },
  {
    id: "5",
    title: "Caring for Your Wooden Art Pieces",
    slug: "caring-for-wooden-art",
    content: `<p>Sample content for Caring for Wooden Art article...</p>`,
    category: "Care Guide",
    author: "Joshua Mwendwa",
    authorTitle: "Artisan Relations Specialist",
    authorBio:
      "Joshua works directly with artisan communities, ensuring fair partnerships and helping to bring their unique creations to a global audience.",
    authorImage: "/images/7386.jpg",
    date: "March 20, 2025",
    image: "/placeholder.svg?height=600&width=1200",
    tags: ["Care Guide", "Preservation", "Maintenance", "Wood Care"],
  },
  {
    id: "6",
    title: "The Art of Ebony Carving",
    slug: "ebony-carving-techniques",
    content: `<p>Sample content for Ebony Carving article...</p>`,
    category: "Craftsmanship",
    author: "Mutuku Moses",
    authorTitle: "Founder & Curator",
    authorBio:
      "With over 7 years of experience working with African art, Musa founded Arts Afrik to share his passion for traditional craftsmanship.",
    authorImage: "/images/musa.JPG",
    date: "March 15, 2025",
    image: "/placeholder.svg?height=600&width=1200",
    tags: ["Ebony", "Carving Techniques", "Craftsmanship", "Traditional Skills"],
  },
]

export default function BlogPost() {
  const { slug } = useParams()
  const router = useRouter()

  // Find the blog post with the matching slug
  const post = blogPosts.find((post) => post.slug === slug)

  // Get related posts (same category, excluding current post)
  const relatedPosts = post ? blogPosts.filter((p) => p.category === post.category && p.id !== post.id).slice(0, 3) : []

  if (!post) {
    return (
      <MainLayout>
        <div className="container">
          <div className="not-found">
            <h1>Blog Post Not Found</h1>
            <p>Sorry, we couldn't find the blog post you're looking for.</p>
            <Link href="/blog" className="button">
              Return to Blog
            </Link>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="blog-post-page">
        <div className="blog-post-header">
          <div className="container">
            <div className="post-meta-top">
              <span className="post-category">{post.category}</span>
              <span className="post-date">{post.date}</span>
            </div>
            <h1 className="post-title">{post.title}</h1>
            <div className="post-author-brief">
              <div className="author-image">
                <Image
                  src={post.authorImage || "/placeholder.svg"}
                  alt={post.author}
                  width={50}
                  height={50}
                  loader={cloudinaryLoader}
                />
              </div>
              <div className="author-info">
                <span className="author-name">By {post.author}</span>
                <span className="author-title">{post.authorTitle}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="featured-image-container">
          <Image
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            width={1200}
            height={600}
            className="featured-post-image"
            loader={cloudinaryLoader}
          />
        </div>

        <div className="container">
          <div className="blog-post-content">
            <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />

            <div className="post-tags">
              {post.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>

            <div className="author-bio">
              <div className="author-image">
                <Image
                  src={post.authorImage || "/placeholder.svg"}
                  alt={post.author}
                  width={80}
                  height={80}
                  loader={cloudinaryLoader}
                />
              </div>
              <div className="author-details">
                <h3>About {post.author}</h3>
                <p className="author-title">{post.authorTitle}</p>
                <p className="bio-text">{post.authorBio}</p>
              </div>
            </div>
          </div>

          {relatedPosts.length > 0 && (
            <div className="related-posts">
              <h2>Related Articles</h2>
              <div className="related-grid">
                {relatedPosts.map((relatedPost) => (
                  <div className="related-card" key={relatedPost.id}>
                    <div className="related-image">
                      <Image
                        src={relatedPost.image || "/placeholder.svg"}
                        alt={relatedPost.title}
                        width={400}
                        height={250}
                        loader={cloudinaryLoader}
                      />
                    </div>
                    <div className="related-content">
                      <h3>{relatedPost.title}</h3>
                      <div className="related-meta">
                        <span className="related-date">{relatedPost.date}</span>
                      </div>
                      <Link href={`/blog/${relatedPost.slug}`} className="read-more">
                        Read Article
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="post-navigation">
            <Link href="/blog" className="back-to-blog">
              ← Back to Blog
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
