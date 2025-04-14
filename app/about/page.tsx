import Image from "next/image"
import MainLayout from "@/components/MainLayout"
import "./about.css"

export default function About() {
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
                <Image src="/placeholder.svg?height=400&width=600" alt="Arts Afrik Mission" width={600} height={400} />
              </div>
            </div>
          </section>

          <section className="value-section">
            <h2>Cultural & Artistic Value</h2>
            <div className="value-grid">
              <div className="value-card">
                <h3>Cultural Significance</h3>
                <p>
                  Each piece in our collection carries deep cultural significance, often representing spiritual beliefs,
                  historical events, or social customs. These artworks serve as tangible connections to Africa's rich
                  and diverse cultural heritage.
                </p>
              </div>
              <div className="value-card">
                <h3>Artistic Excellence</h3>
                <p>
                  African art is renowned for its distinctive aesthetic qualities, innovative techniques, and masterful
                  craftsmanship. We celebrate the artistic excellence embodied in these traditional forms, from
                  intricate wood carving to symbolic design elements.
                </p>
              </div>
              <div className="value-card">
                <h3>Sustainable Practices</h3>
                <p>
                  We are committed to ethical sourcing and sustainable practices. Our artworks are created using
                  responsibly harvested materials, and we ensure fair compensation for the artisans who create these
                  magnificent pieces.
                </p>
              </div>
              <div className="value-card">
                <h3>Educational Impact</h3>
                <p>
                  Beyond their aesthetic appeal, our art pieces serve an educational purpose, offering insights into
                  African cultures, traditions, and worldviews. We provide detailed information about each piece's
                  origin, meaning, and creation process.
                </p>
              </div>
            </div>
          </section>

          <section className="sourcing-section">
            <div className="sourcing-content">
              <div className="sourcing-image">
                <Image src="/placeholder.svg?height=400&width=600" alt="Arts Afrik Sourcing" width={600} height={400} />
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
              <div className="team-member">
                <div className="member-image">
                  <Image src="/placeholder.svg?height=300&width=300" alt="Team Member" width={300} height={300} />
                </div>
                <h3>Mutuku Moses</h3>
                <p className="member-title">Founder & Curator</p>
                <p className="member-bio">
                  With over 7 years of experience working with African art, Musa founded Arts Afrik to share his
                  passion for traditional craftsmanship with the world.
                </p>
              </div>
              <div className="team-member">
                <div className="member-image" style={{ width: 300, height: 300, position: 'relative' }}>
                  <Image src="/images/7386.jpg" alt="Joshua Mwendwa" fill style={{ objectFit: 'contain' }} />
                </div>
                <h3>Joshua Mwendwa</h3>
                <p className="member-title">Artisan Relations</p>
                <p className="member-bio">
                  Joshua works directly with artisan communities, ensuring fair partnerships and helping to bring their
                  unique creations to a global audience.
                </p>
              </div>
              <div className="team-member">
                <div className="member-image">
                  <Image src="/placeholder.svg?height=300&width=300" alt="Team Member" width={300} height={300} />
                </div>
                <h3>Lilian Ndanu</h3>
                <p className="member-title">Cultural Specialist</p>
                <p className="member-bio">
                  With a PhD in Arts, Lilian provides expert knowledge on the cultural context and
                  historical significance of each art piece.
                </p>
              </div>

              <div className="team-member">
                <div className="member-image">
                  <Image src="/placeholder.svg?height=300&width=300" alt="Team Member" width={300} height={300} />
                </div>
                <h3>New Member 1</h3>
                <p className="member-title">Title 1</p>
                <p className="member-bio">
                  Bio for new member 1.
                </p>
              </div>
              <div className="team-member">
                <div className="member-image">
                  <Image src="/placeholder.svg?height=300&width=300" alt="Team Member" width={300} height={300} />
                </div>
                <h3>New Member 2</h3>
                <p className="member-title">Title 2</p>
                <p className="member-bio">
                  Bio for new member 2.
                </p>
              </div>
              <div className="team-member">
                <div className="member-image">
                  <Image src="/placeholder.svg?height=300&width=300" alt="Team Member" width={300} height={300} />
                </div>
                <h3>New Member 3</h3>
                <p className="member-title">Title 3</p>
                <p className="member-bio">
                  Bio for new member 3.
                </p>
              </div>
              <div className="team-member">
                <div className="member-image">
                  <Image src="/placeholder.svg?height=300&width=300" alt="Team Member" width={300} height={300} />
                </div>
                <h3>New Member 4</h3>
                <p className="member-title">Title 4</p>
                <p className="member-bio">
                  Bio for new member 4.
                </p>
              </div>
              <div className="team-member">
                <div className="member-image">
                  <Image src="/placeholder.svg?height=300&width=300" alt="Team Member" width={300} height={300} />
                </div>
                <h3>New Member 5</h3>
                <p className="member-title">Title 5</p>
                <p className="member-bio">
                  Bio for new member 5.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  )
}
