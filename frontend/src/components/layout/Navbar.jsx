import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';


export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    
    <header className="navbar">
      <div className="navbar-inner">
        {/* Left: hamburger + nav links */}
        <div className="navbar-left">
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span /><span /><span />
          </button>
          <nav className="navbar-links">
            <NavLink to="/posts" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Posts</NavLink>
            <NavLink to="/posts?category=Culture" className="nav-link">Culture</NavLink>
            <NavLink to="/posts?category=Design" className="nav-link">Design</NavLink>
            <NavLink to="/posts?category=Tech" className="nav-link">Tech</NavLink>
          </nav>
        </div>

        {/* Center: logo */}
        <Link to="/" className="navbar-logo">THE EDITORIAL</Link>

        {/* Right: search + admin */}
        <div className="navbar-right">
          {searchOpen ? (
            <form className="navbar-search-form" onSubmit={handleSearch}>
              <input
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="navbar-search-input"
              />
              <button type="button" className="search-close" onClick={() => setSearchOpen(false)}>✕</button>
            </form>
          ) : (
            <button className="search-btn" onClick={() => setSearchOpen(true)} aria-label="Search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
          )}
          {user ? (
  <>
    <Link to="/admin" className="nav-link" style={{ marginLeft: '16px' }}>Admin</Link>
    <button onClick={logout} className="nav-link" style={{ marginLeft: '16px', background: 'none', border: 'none', cursor: 'pointer' }}>Logout</button>
  </>
) : (
  <Link to="/login" className="nav-link" style={{ marginLeft: '16px' }}>Login</Link>
)}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <NavLink to="/posts" onClick={() => setMenuOpen(false)}>Posts</NavLink>
          <NavLink to="/posts?category=Culture" onClick={() => setMenuOpen(false)}>Culture</NavLink>
          <NavLink to="/posts?category=Design" onClick={() => setMenuOpen(false)}>Design</NavLink>
          <NavLink to="/posts?category=Tech" onClick={() => setMenuOpen(false)}>Tech</NavLink>
          <NavLink to="/posts?category=Business" onClick={() => setMenuOpen(false)}>Business</NavLink>
          <NavLink to="/posts?category=Sustainability" onClick={() => setMenuOpen(false)}>Sustainability</NavLink>
          <NavLink to="/affiliates" onClick={() => setMenuOpen(false)}>Affiliate Links</NavLink>
        </div>
      )}
    </header>
  );
}
