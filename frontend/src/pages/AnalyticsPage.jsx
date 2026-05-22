import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import AdminSidebar from '../components/layout/AdminSidebar';
import './AdminDashboard.css';

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/analytics/dashboard').then(res => setStats(res.data)).catch(console.error);
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header">
          <h1 className="admin-page-title">Analytics</h1>
        </div>

        {stats && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <p className="stat-label">Total Views</p>
                <p className="stat-value">{stats.totalViews.toLocaleString()}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Subscribers</p>
                <p className="stat-value">{stats.subscribers}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Published Posts</p>
                <p className="stat-value">{stats.publishedPosts}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Affiliate Clicks</p>
                <p className="stat-value">{stats.affiliateClicks}</p>
              </div>
            </div>

            <div className="admin-section">
              <h2 className="admin-section-title">Top Posts by Views</h2>
              <table className="admin-table">
                <thead>
                  <tr><th>Rank</th><th>Title</th><th>Views</th><th></th></tr>
                </thead>
                <tbody>
                  {stats.topPosts.map((p, i) => (
                    <tr key={p._id}>
                      <td style={{ color: '#a0a0a0', fontWeight: 600 }}>#{i + 1}</td>
                      <td style={{ fontWeight: 500 }}>{p.title}</td>
                      <td>{p.views.toLocaleString()}</td>
                      <td><Link to={`/post/${p.slug}`} target="_blank" style={{ fontSize: '12px', color: '#505050', textDecoration: 'underline' }}>View →</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
