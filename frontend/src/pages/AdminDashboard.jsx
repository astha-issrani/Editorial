import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import AdminSidebar from '../components/layout/AdminSidebar';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/analytics/dashboard').then(res => setStats(res.data)).catch(console.error);
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header">
          <h1 className="admin-page-title">Dashboard</h1>
          <Link to="/admin/posts/new" className="btn-primary">+ New Post</Link>
        </div>

        {stats && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <p className="stat-label">Total Posts</p>
                <p className="stat-value">{stats.totalPosts}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Published</p>
                <p className="stat-value">{stats.publishedPosts}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Drafts</p>
                <p className="stat-value">{stats.draftPosts}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Total Views</p>
                <p className="stat-value">{stats.totalViews.toLocaleString()}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Subscribers</p>
                <p className="stat-value">{stats.subscribers}</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Affiliate Clicks</p>
                <p className="stat-value">{stats.affiliateClicks}</p>
              </div>
            </div>

            <div className="admin-two-col">
              <section className="admin-section">
                <h2 className="admin-section-title">Top Posts by Views</h2>
                <table className="admin-table">
                  <thead>
                    <tr><th>Title</th><th>Views</th></tr>
                  </thead>
                  <tbody>
                    {stats.topPosts.map(p => (
                      <tr key={p._id}>
                        <td><Link to={`/post/${p.slug}`} className="admin-table-link">{p.title}</Link></td>
                        <td>{p.views}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              <section className="admin-section">
                <h2 className="admin-section-title">Recent Posts</h2>
                <table className="admin-table">
                  <thead>
                    <tr><th>Title</th><th>Status</th><th>Date</th></tr>
                  </thead>
                  <tbody>
                    {stats.recentPosts.map(p => (
                      <tr key={p._id}>
                        <td>{p.title}</td>
                        <td>
                          <span className={`status-badge ${p.status}`}>{p.status}</span>
                        </td>
                        <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
