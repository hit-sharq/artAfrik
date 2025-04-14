import Link from "next/link"
import "./Footer.css"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Arts Afrik</h3>
            <p>Connecting global buyers with authentic traditional African art and curios.</p>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/gallery">Gallery</Link>
              </li>
              <li>
                <Link href="/about">About Us</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Connect With Us</h3>
            <ul className="footer-links">
              <li>
                <a href="https://instagram.com/artsafrik" target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://twitter.com/artsafrik" target="_blank" rel="noopener noreferrer">
                  X (Twitter)
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Arts Afrik. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
