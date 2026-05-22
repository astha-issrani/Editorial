import { Link } from 'react-router-dom';
import './NotFoundPage.css';

export default function NotFoundPage() {
  return (
    <main className="notfound-page container">
      <p className="notfound-code">404</p>
      <h1 className="notfound-title">Page Not Found</h1>
      <p className="notfound-desc">The article or page you're looking for doesn't exist or may have moved.</p>
      <Link to="/" className="btn-primary">Return Home</Link>
    </main>
  );
}
