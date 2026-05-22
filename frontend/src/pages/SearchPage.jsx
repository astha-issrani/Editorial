import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../utils/api'; 
import './SearchPage.css';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      doSearch(q);
    }
  }, [searchParams]);

  const doSearch = async (q) => {
    setLoading(true);
    setSearched(true);
    try {
      const res = await api.get(`/api/posts?search=${encodeURIComponent(q)}&limit=20`);
      setResults(res.data.posts || []);
    } catch { setResults([]); }
    finally { setLoading(false); }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) setSearchParams({ q: query });
  };

  return (
    <main className="search-page container">
      <h1 className="search-heading">Search</h1>

      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search articles, topics, authors..."
          className="search-input"
          autoFocus
        />
        <button type="submit" className="btn-primary">Search</button>
      </form>

      {loading && <p className="search-status">Searching...</p>}

      {searched && !loading && (
        <div className="search-results">
          <p className="search-count">
            {results.length} result{results.length !== 1 ? 's' : ''} for "{searchParams.get('q')}"
          </p>
          {results.length === 0 ? (
            <p className="search-empty">No articles found. Try a different search term.</p>
          ) : (
            <div className="search-list">
              {results.map(post => (
                <div key={post._id}>
                  <Link to={`/post/${post.slug}`} className="search-result-row">
                    <img src={post.coverImage || PLACEHOLDER} alt={post.title} className="search-result-img" />
                    <div className="search-result-text">
                      <div className="search-result-meta">
                        <span className="category-tag">{post.category?.toUpperCase()}</span>
                        <span className="search-result-date">
                          {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="search-result-title">{post.title}</h3>
                      <p className="search-result-excerpt">{post.excerpt}</p>
                    </div>
                  </Link>
                  <hr className="divider" style={{ margin: '24px 0' }} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
