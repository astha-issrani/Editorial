import { useState, useEffect } from 'react';
import axios from 'axios';
import './AffiliatePage.css';

export default function AffiliatePage() {
  const [affiliates, setAffiliates] = useState([]);

  useEffect(() => {
    axios.get('/api/affiliates').then(res => setAffiliates(res.data)).catch(console.error);
  }, []);

  const handleClick = async (aff) => {
    await axios.put(`/api/affiliates/${aff._id}/click`).catch(() => {});
    window.open(aff.url, '_blank', 'noopener');
  };

  const grouped = affiliates.reduce((acc, aff) => {
    const cat = aff.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(aff);
    return acc;
  }, {});

  return (
    <main className="affiliate-page container">
      <header className="affiliate-header">
        <h1 className="affiliate-title">Affiliate Links</h1>
        <p className="affiliate-subtitle">
          Carefully selected products and services we trust. We may earn a commission on purchases made through these links, at no extra cost to you.
        </p>
      </header>

      {Object.keys(grouped).length === 0 ? (
        <p style={{ color: '#707070', fontSize: '14px' }}>No affiliate links yet.</p>
      ) : (
        Object.entries(grouped).map(([cat, items]) => (
          <section key={cat} className="affiliate-section">
            <h2 className="affiliate-section-title">{cat.toUpperCase()}</h2>
            <div className="affiliate-grid">
              {items.map(aff => (
                <div key={aff._id} className="affiliate-card">
                  <div className="affiliate-card-body">
                    <h3 className="affiliate-name">{aff.name}</h3>
                    {aff.description && <p className="affiliate-desc">{aff.description}</p>}
                  </div>
                  <button className="btn-primary affiliate-btn" onClick={() => handleClick(aff)}>
                    Visit →
                  </button>
                </div>
              ))}
            </div>
          </section>
        ))
      )}
    </main>
  );
}
