import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api'; 
import './HomePage.css';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80';

export default function HomePage() {
  const [featured, setFeatured] = useState(null);
  const [sidebarPosts, setSidebarPosts] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [email, setEmail] = useState('');
  const [subMsg, setSubMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [featRes, allRes] = await Promise.all([
        api.get('/api/posts/featured').catch(() => ({ data: null })),
        api.get('/api/posts?limit=6')
      ]);
      setFeatured(featRes.data);
      const posts = allRes.data.posts || [];
      setSidebarPosts(posts.slice(0, 2));
      setLatestPosts(posts.slice(0, 3));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/newsletter/subscribe', { email });
      setSubMsg('Subscribed!');
      setEmail('');
    } catch {
      setSubMsg('Already subscribed or error.');
    }
  };

  const displayPost = featured || (sidebarPosts[0] && { ...sidebarPosts[0], featured: true });

  return (
    <main className="homepage">
      {/* Hero Section */}
      <section className="home-hero container">
        <div className="hero-main">
          {displayPost && (
            <Link to={`/post/${displayPost.slug}`} className="hero-featured">
              <div className="hero-image-wrap">
                <span className="featured-badge">FEATURED</span>
                <img
                  src={displayPost.coverImage || PLACEHOLDER}
                  alt={displayPost.title}
                  className="hero-image"
                />
              </div>
              <div className="hero-text">
                <span className="category-tag">{displayPost.category?.toUpperCase()}</span>
                <h1 className="hero-title">{displayPost.title}</h1>
                <p className="hero-excerpt">{displayPost.excerpt}</p>
                <div className="hero-meta">
                  <span>By {displayPost.authorName || 'The Editorial'}</span>
                  <span className="meta-dot">·</span>
                  <span>{displayPost.readTime}</span>
                </div>
              </div>
            </Link>
          )}
        </div>

        <aside className="hero-sidebar">
          {sidebarPosts.map((post, i) => (
            <div key={post._id}>
              <Link to={`/post/${post.slug}`} className="sidebar-post">
                <span className="category-tag">{post.category?.toUpperCase()}</span>
                <h3 className="sidebar-post-title">{post.title}</h3>
                <p className="sidebar-post-excerpt">{post.excerpt}</p>
              </Link>
              {i < sidebarPosts.length - 1 && <hr className="divider" style={{ margin: '20px 0' }} />}
            </div>
          ))}

          <hr className="divider" style={{ margin: '24px 0' }} />

          {/* Newsletter widget */}
          <div className="sidebar-newsletter">
            <p className="sidebar-newsletter-label">THE WEEKLY DISPATCH</p>
            <p className="sidebar-newsletter-desc">Curated insights on design and technology delivered to your inbox every Sunday.</p>
            <form onSubmit={handleSubscribe} className="sidebar-newsletter-form">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email@address.com"
                required
                className="sidebar-newsletter-input"
              />
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>SUBSCRIBE</button>
            </form>
            {subMsg && <p style={{ fontSize: '12px', color: '#707070', marginTop: '8px' }}>{subMsg}</p>}
          </div>
        </aside>
      </section>

      {/* Latest Perspectives */}
      <section className="latest-section container">
        <div className="latest-header">
          <h2 className="latest-title">Latest Perspectives</h2>
          <Link to="/posts" className="view-all-link">View All Posts</Link>
        </div>
        <div className="latest-grid">
          {latestPosts.map(post => (
            <Link to={`/post/${post.slug}`} key={post._id} className="latest-card">
              <div className="latest-card-image">
                <img src={post.coverImage || PLACEHOLDER} alt={post.title} />
              </div>
              <div className="latest-card-body">
                <span className="category-tag">{post.category?.toUpperCase()}</span>
                <h3 className="latest-card-title">{post.title}</h3>
                <p className="latest-card-excerpt">{post.excerpt}</p>
                <div className="latest-card-footer">
                  <span className="latest-card-date">
                    {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="latest-card-arrow">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="home-newsletter-cta">
        <div className="container home-newsletter-inner">
          <div className="newsletter-cta-text">
            <h2 className="newsletter-cta-title">Deepen your perspective.</h2>
            <p className="newsletter-cta-desc">Join 45,000+ thinkers receiving our monthly analysis of the intersections between design, technology, and culture.</p>
          </div>
          <div className="newsletter-cta-action">
            <Link to="/posts" className="btn-primary" style={{ fontSize: '12px', letterSpacing: '0.1em' }}>
              JOIN THE NEWSLETTER ✉
            </Link>
            <p className="newsletter-cta-note">No spam. Only essential thinking. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
