import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './SingleBlogPost.css';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80';

export default function SingleBlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [subMsg, setSubMsg] = useState('');
  const [affiliates, setAffiliates] = useState([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchPost();
    window.scrollTo(0, 0);
  }, [slug]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/posts/${slug}`);
      setPost(res.data);
      const [relRes, affRes] = await Promise.all([
        axios.get(`/api/posts?category=${res.data.category}&limit=3`),
        axios.get('/api/affiliates')
      ]);
      setRelated((relRes.data.posts || []).filter(p => p._id !== res.data._id).slice(0, 3));
      setAffiliates(affRes.data.slice(0, 3));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/newsletter/subscribe', { email });
      setSubMsg('Subscribed!');
      setEmail('');
    } catch { setSubMsg('Already subscribed.'); }
  };

  if (loading) return <div className="single-loading"><p>Loading...</p></div>;
  if (!post) return <div className="single-loading"><p>Post not found.</p></div>;

  return (
    <main className="single-page">
      <div className="container single-container">
        {/* Back link */}
        <div className="single-back">
          <Link to="/posts" className="back-link">← All Posts</Link>
        </div>

        <article className="single-article">
          {/* Header */}
          <header className="single-header">
            <span className="category-tag">{post.category?.toUpperCase()}</span>
            <h1 className="single-title">{post.title}</h1>
            <p className="single-excerpt">{post.excerpt}</p>
            <div className="single-meta">
              <span>By <strong>{post.authorName || 'The Editorial'}</strong></span>
              <span className="meta-dot">·</span>
              <span>{post.readTime}</span>
              <span className="meta-dot">·</span>
              <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </header>

          {/* Cover image */}
          <div className="single-cover">
            <img src={post.coverImage || PLACEHOLDER} alt={post.title} />
          </div>

          {/* Body */}
          <div
            className="single-body"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* Affiliate recommendations */}
        {affiliates.length > 0 && (
          <div className="single-affiliates">
            <p className="single-affiliates-label">RECOMMENDED</p>
            <div className="single-affiliates-grid">
              {affiliates.map(aff => (
                <a
                  key={aff._id}
                  href={aff.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="single-affiliate-card"
                  onClick={() => axios.put(`/api/affiliates/${aff._id}/click`).catch(() => {})}
                >
                  <span className="single-affiliate-name">{aff.name}</span>
                  <span className="single-affiliate-desc">{aff.description}</span>
                  <span className="single-affiliate-cta">Visit →</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="single-tags">
            {post.tags.map(tag => (
              <span key={tag} className="single-tag">{tag}</span>
            ))}
          </div>
        )}

        <hr className="divider" style={{ margin: '48px 0' }} />

        {/* Newsletter inline */}
        <div className="single-newsletter">
          <p className="single-newsletter-label">NEVER MISS AN ISSUE</p>
          <h3 className="single-newsletter-title">Deepen your perspective.</h3>
          <form onSubmit={handleSubscribe} className="single-newsletter-form">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="single-newsletter-input"
            />
            <button type="submit" className="btn-primary">Subscribe</button>
          </form>
          {subMsg && <p style={{ fontSize: '12px', color: '#707070', marginTop: '8px' }}>{subMsg}</p>}
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="single-related">
            <h2 className="single-related-title">Related Reading</h2>
            <div className="single-related-grid">
              {related.map(rp => (
                <Link to={`/post/${rp.slug}`} key={rp._id} className="related-card">
                  <img src={rp.coverImage || PLACEHOLDER} alt={rp.title} />
                  <span className="category-tag" style={{ display: 'block', marginTop: '12px', marginBottom: '6px' }}>
                    {rp.category?.toUpperCase()}
                  </span>
                  <h4 className="related-card-title">{rp.title}</h4>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}