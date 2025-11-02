import MainLayout from "components/MainLayout"
import "./about.css"
import { getTeamMembers } from "../actions/team-actions"
import TeamMemberImage from "components/TeamMemberImage"
import { prisma } from "lib/prisma"

type GalleryImage = {
  image: string
  title?: string
}

function selectImageByDay(images: GalleryImage[]) {
  if (!images || images.length === 0) return null
  const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % images.length
  return images[dayIndex]
}

export default async function About() {
  const { teamMembers = [] } = await getTeamMembers()
  let artListings: Array<{
    id: string
    title: string
    description: string
    price: number
    category: {
      id: string
      name: string
      slug: string
    }
    material: string | null
    region: string
    size: string
    images: string[]
    featured: boolean
    createdAt: Date
    updatedAt: Date
  }> = []
  try {
    artListings = await prisma.artListing.findMany({
      include: {
        category: true,
      },
    })
  } catch (error) {
    console.error("Error fetching art listings:", error)
  }
  // Flatten all images from all art listings into a single array
  const allImages: GalleryImage[] = []
  artListings.forEach((listing) => {
    if (listing.images && listing.images.length > 0) {
      listing.images.forEach((img: string) => {
        allImages.push({ image: img, title: listing.title })
      })
    }
  })
  const selectedImage = selectImageByDay(allImages)

  return (
    <MainLayout>
      <div className="about-page">
        <div className="container">
          <h1 className="page-title">About Arts Afrik</h1>

          <section className="mission-section">
            <div className="mission-content">
              <div className="mission-text">
                <h2>About Arts Afrik</h2>
                <p className="subtitle">Celebrating African Creativity, One Craft at a Time</p>
                <p>
                  At Arts Afrik, we bring the vibrant spirit of Kenya's Maasai Market to the digital world — a space where tradition meets technology, and every product tells a story.
                </p>
                <p>
                  We partner directly with local artisans, creators, and cooperatives across Kenya to showcase authentic handmade crafts and traditional African art, from colorful Maasai beadwork and hand-carved sculptures to woven baskets, textiles, jewelry, paintings, home décor, carvings, masks, and other handcrafted goods that embody the soul of African design.
                </p>
                <p>
                  Our mission is simple: to empower artisans, preserve culture, and share African artistry with the world through a modern, fair, and accessible marketplace.
                </p>
                <p>
                  By shopping on Sanaa, you're not just buying beautiful crafts — you're supporting local communities, sustaining traditional skills, and helping artisans earn a fair income for their work.
                </p>

                <h3>What We Stand For</h3>
                <ul>
                  <li><strong>Authenticity:</strong> Every piece on Arts Afrik is handmade, unique, and rich in cultural meaning.</li>
                  <li><strong>Empowerment:</strong> We give artisans direct access to global buyers, removing middlemen.</li>
                  <li><strong>Sustainability:</strong> Our crafts are made with locally sourced, eco-friendly materials.</li>
                  <li><strong>Connection:</strong> We bridge cultures by sharing the creativity, heritage, and stories behind every creation.</li>
                </ul>

                <h3>Our Vision</h3>
                <p>
                  To become Africa's leading online marketplace for authentic Maasai Market goods and handmade art — connecting global admirers of culture with the talented hands that shape it.
                </p>

                <h3>Join Us</h3>
                <p>
                  Explore. Discover. Celebrate the beauty of African craftsmanship. Together, let's make Arts Afrik a home for creativity and cultural pride.
                </p>
              </div>
              <div className="mission-image">
                {selectedImage ? (
                  <TeamMemberImage
                    src={selectedImage.image || "/placeholder.svg?height=400&width=600"}
                    alt={selectedImage.title || "Arts Afrik Mission"}
                    width={600}
                    height={400}
                    style={{ objectFit: "contain" }}
                  />
                ) : (
                  <TeamMemberImage
                    src="/placeholder.svg?height=400&width=600"
                    alt="Arts Afrik Sourcing"
                    width={600}
                    height={400}
                    style={{ objectFit: "contain" }}
                  />
                )}
              </div>
              <div className="sourcing-text">
                <h2>How We Source & Represent</h2>
                <p>
                  Our team works directly with artisan communities across Africa, building relationships based on mutual
                  respect and fair trade principles. We travel to various regions to personally select pieces that
                  exemplify the highest standards of craftsmanship and cultural authenticity.
                </p>
                <p>
                  We believe in transparent representation, providing accurate information about each Maasai Market good's origin,
                  materials, and cultural context. Our commitment to authenticity means that every piece in our
                  collection is a genuine expression of African artistic tradition.
                </p>
                <p>
                  By choosing Arts Afrik, you're not just acquiring a beautiful Maasai Market good or art piece – you're supporting
                  sustainable livelihoods for talented artisans and helping to preserve cultural heritage for future
                  generations.
                </p>
                <p>
                  Our platform includes a comprehensive admin dashboard where administrators can manage art listings, process order requests, create and edit blog posts, and add team members. The admin interface provides full control over content and operations.
                </p>
              </div>
            </div>
          </section>

          <section className="team-section">
            <h2>Meet Our Team</h2>
            <div className="team-grid">
              {teamMembers.length > 0 ? (
                teamMembers.map((member) => (
                  <div className="team-member" key={member.id}>
                    <div className="member-image" style={{ width: 300, height: 300, position: "relative" }}>
                      <TeamMemberImage
                        src={member.image || "/placeholder.svg"}
                        alt={member.name}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <h3>{member.name}</h3>
                    <p className="member-title">{member.title}</p>
                    <p className="member-bio">{member.bio}</p>
                  </div>
                ))
              ) : (
                <div className="no-team-members">
                  <p>Team members will be added by administrators through the admin dashboard.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  )
}
