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
            <p>
              Connecting global buyers with authentic traditional African art and curios, sourced directly from skilled
              artisans across the continent.
            </p>
            <div className="social-links">
              <a
                href="https://instagram.com/artsafrik"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://twitter.com/artsafrik" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="https://facebook.com/artsafrik"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
            </div>
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
            <h3>Art Categories</h3>
            <ul className="footer-links">
              <li>
                <Link href="/gallery?woodType=Ebony">Ebony Wood Art</Link>
              </li>
              <li>
                <Link href="/gallery?woodType=Rosewood">Rosewood Sculptures</Link>
              </li>
              <li>
                <Link href="/gallery?woodType=Mahogany">Mahogany Carvings</Link>
              </li>
              <li>
                <Link href="/gallery?region=West%20Africa">West African Art</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>Email: info@artsafrik.com</p>
            <p>Phone: +123 456 7890</p>
            <p>Hours: Monday - Friday, 9am - 5pm</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Arts Afrik. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
