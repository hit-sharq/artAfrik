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
              Connecting global buyers with authentic Maasai Market goods and handcrafted African art, sourced directly from skilled
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
              //whatsapp link
                href="https://wa.me/+25492687584"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <i className="fab fa-whatsapp"></i>
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
                <Link href="/blog">Blog</Link>
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
                <Link href="/gallery?category=Beadwork">Maasai Beadwork</Link>
              </li>
              <li>
                <Link href="/gallery?category=Textiles">African Textiles</Link>
              </li>
              <li>
                <Link href="/gallery?category=Jewelry">Traditional Jewelry</Link>
              </li>
              <li>
                <Link href="/gallery?category=Paintings">African Paintings</Link>
              </li>
              <li>
                <Link href="/gallery?category=Carvings">Wood Carvings</Link>
              </li>
              <li>
                <Link href="/gallery?category=Home%20Décor">Home Décor</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>Email: artafrik.gallery@gmail.com</p>
            <p>Phone: +254 794 773 452</p>
            <p>Hours: Mon- Sun, 9am - 5pm</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Arts Afrik. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
