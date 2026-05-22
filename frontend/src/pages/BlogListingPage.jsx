import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './BlogListingPage.css';

const CATEGORIES = ['All Topics', 'Culture', 'Design', 'Tech', 'Business', 'Sustainability', 'Art', 'Architecture', 'Travel'];
const PLACEHOLDER = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80';

const TRENDING = [
  { name: 'Minimalism', count: '12 posts' },
  { name: 'AI Ethics', count: '08 posts' },
  { name: 'Urbanism', count: '15 posts' },
  { name: 'Sustainability', count: '10 posts' },
];

export default function BlogListingPage() {
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [email, setEmail] = useState('');
  const [subMsg, setSubMsg] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = searchParams.get('category') || 'All Topics';

  useEffect(() => {
    fetchPosts(1);
    setPage(1);
  }, [activeCategory]);

  const fetchPosts = async (p = 1) => {
    try {
      const cat = activeCategory !== 'All Topics' ? `&category=${activeCategory}` : '';
      const res = await axios.get(`/api/posts?page=${p}&limit=4${cat}`);
      if (p === 1) setPosts(res.data.posts || []);
      else setPosts(prev => [...prev, ...(res.data.posts || [])]);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error(err);
    }
  };

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchPosts(next);
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/newsletter/subscribe', { email });
      setSubMsg('Subscribed!');
      setEmail('');
    } catch { setSubMsg('Already subscribed.'); }
  };

  const setCategory = (cat) => {
    if (cat === 'All Topics') setSearchParams({});
    else setSearchParams({ category: cat });
  };

  const [featured, ...rest] = posts;

  return (
    <main className="listing-page">
      {/* Top nav with categories */}
      <div className="listing-category-bar">
        <div className="container listing-category-inner">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`category-filter-btn${activeCategory === cat ? ' active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="container listing-body">
        <div className="listing-header">
          <h1 className="listing-title">Latest Insights</h1>
          <p className="listing-subtitle">Exploring the intersection of modern aesthetics, human-centric design, and the digital frontier.</p>
        </div>

        <div className="listing-layout">
          {/* Main content */}
          <div className="listing-main">
            {/* Featured large post */}
            {featured && (
              <Link to={`/post/${featured.slug}`} className="listing-featured-post">
                <img
                  src={featured.coverImage || PLACEHOLDER}
                  alt={featured.title}
                  className="listing-featured-img"
                />
                <div className="listing-featured-meta">
                  <span className="category-tag">{featured.category?.toUpperCase()}</span>
                  <span className="listing-date">
                    {new Date(featured.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}
                  </span>
                </div>
                <h2 className="listing-featured-title">{featured.title}</h2>
                <p className="listing-featured-excerpt">{featured.excerpt}</p>
              </Link>
            )}

            <hr className="divider" style={{ margin: '0 0 32px' }} />

            {/* List posts */}
            <div className="listing-list">
              {rest.map(post => (
                <div key={post._id}>
                  <Link to={`/post/${post.slug}`} className="listing-row">
                    <img
                      src={post.coverImage || PLACEHOLDER}
                      alt={post.title}
                      className="listing-row-img"
                    />
                    <div className="listing-row-text">
                      <div className="listing-row-meta">
                        <span className="category-tag">{post.category?.toUpperCase()}</span>
                        <span className="listing-date">
                          {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}
                        </span>
                      </div>
                      <h3 className="listing-row-title">{post.title}</h3>
                      <p className="listing-row-excerpt">{post.excerpt}</p>
                    </div>
                  </Link>
                  <hr className="divider" style={{ margin: '32px 0' }} />
                </div>
              ))}
            </div>

            {posts.length < total && (
              <div style={{ textAlign: 'center', paddingBottom: '48px' }}>
                <button className="btn-primary" onClick={loadMore}>Load More Posts</button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="listing-sidebar">
            <div className="listing-sidebar-newsletter">
              <p className="sidebar-section-label">NEWSLETTER</p>
              <p style={{ fontSize: '13px', color: '#505050', lineHeight: '1.7', marginBottom: '16px' }}>
                Receive our weekly curation of design and technology insights directly in your inbox.
              </p>
              <form onSubmit={handleSubscribe} className="listing-newsletter-form">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  className="sidebar-newsletter-input"
                />
                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Subscribe</button>
              </form>
              {subMsg && <p style={{ fontSize: '12px', color: '#707070', marginTop: '8px' }}>{subMsg}</p>}
            </div>

            <div className="listing-sidebar-trending">
              <p className="sidebar-section-label">TRENDING TOPICS</p>
              <ul className="trending-list">
                {TRENDING.map(t => (
                  <li key={t.name} className="trending-item">
                    <button
                      className="trending-name"
                      onClick={() => setCategory(t.name)}
                    >{t.name}</button>
                    <span className="trending-count">{t.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
