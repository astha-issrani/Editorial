import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">THE EDITORIAL</Link>
          <p>An authoritative platform dedicated to minimalist design, profound technology, and the future of cultural discourse.</p>
          <p className="footer-copy">© 2024 Editorial. All rights reserved.</p>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <h4>EDITIONS</h4>
            <ul>
              <li><Link to="/posts">Newsletter</Link></li>
              <li><Link to="/posts">Print Archive</Link></li>
              <li><Link to="/posts">Digital Back-issues</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>ORGANIZATION</h4>
            <ul>
              <li><Link to="/">About</Link></li>
              <li><Link to="/">Careers</Link></li>
              <li><Link to="/">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>SOCIAL</h4>
            <ul>
              <li><a href="#twitter">Twitter</a></li>
              <li><a href="#instagram">Instagram</a></li>
              <li><a href="#linkedin">LinkedIn</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
