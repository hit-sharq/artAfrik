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
  const artListings = await prisma.artListing.findMany()
  // Flatten all images from all art listings into a single array
  const allImages: GalleryImage[] = []
  artListings.forEach((listing) => {
    if (listing.images && listing.images.length > 0) {
      listing.images.forEach((img) => {
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
                <h2>Our Mission</h2>
                <p>
                  Arts Afrik is dedicated to connecting global art enthusiasts with authentic traditional African art
                  and curios. Our mission is to showcase the rich artistic heritage of Africa while supporting local
                  artisans and preserving cultural traditions.
                </p>
                <p>
                  We believe that art is a powerful medium for cultural exchange and understanding. By bringing these
                  unique pieces to a global audience, we hope to foster appreciation for African artistic traditions and
                  create sustainable opportunities for talented artisans.
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
                  We believe in transparent representation, providing accurate information about each artwork's origin,
                  materials, and cultural context. Our commitment to authenticity means that every piece in our
                  collection is a genuine expression of African artistic tradition.
                </p>
                <p>
                  By choosing Arts Afrik, you're not just acquiring a beautiful art piece – you're supporting
                  sustainable livelihoods for talented artisans and helping to preserve cultural heritage for future
                  generations.
                </p>
              </div>
            </div>
          </section>

          <section className="team-section">
            <h2>Our Team</h2>
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
                <>
                  <div className="team-member">
                    <div className="member-image" style={{ width: 300, height: 300, position: "relative" }}>
                      <TeamMemberImage src="/images/musa.JPG" alt="Mutuku Moses" fill style={{ objectFit: "contain" }} />
                    </div>
                    <h3>Mutuku Moses</h3>
                    <p className="member-title">Founder & Curator</p>
                    <p className="member-bio">
                      With over 7 years of experience working with African art, Musa founded Arts Afrik to share his
                      passion for traditional craftsmanship with the world.
                    </p>
                  </div>
                  <div className="team-member">
                    <div className="member-image" style={{ width: 300, height: 300, position: "relative" }}>
                      <TeamMemberImage src="/images/7386.jpg" alt="Joshua Mwendwa" fill style={{ objectFit: "contain" }} />
                    </div>
                    <h3>Joshua Mwendwa</h3>
                    <p className="member-title">Artisan Relations</p>
                    <p className="member-bio">
                      Joshua works directly with artisan communities, ensuring fair partnerships and helping to bring
                      their unique creations to a global audience.
                    </p>
                  </div>
                  <div className="team-member">
                    <div className="member-image" style={{ width: 300, height: 300, position: "relative" }}>
                      <TeamMemberImage src="/images/lilian.jpg" alt="Lilian Ndanu" fill style={{ objectFit: "contain" }} />
                    </div>
                    <h3>Lilian Ndanu</h3>
                    <p className="member-title">Cultural Specialist</p>
                    <p className="member-bio">
                      With a PhD in Arts, Lilian provides expert knowledge on the cultural context and historical
                      significance of each art piece.
                    </p>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  )
}
