import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import AdminSidebar from '../components/layout/AdminSidebar';
import './AdminDashboard.css';
import './AdminPosts.css';

export default function AdminPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    try {
      const res = await api.get('/posts/admin/all');
      setPosts(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const deletePost = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await api.delete(`/posts/${id}`);
      setPosts(posts.filter(p => p._id !== id));
    } catch (err) { alert('Error deleting post'); }
  };

  const toggleStatus = async (post) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    try {
      const res = await api.put(`/posts/${post._id}`, { status: newStatus });
      setPosts(posts.map(p => p._id === post._id ? res.data : p));
    } catch { alert('Error updating post'); }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header">
          <h1 className="admin-page-title">Posts</h1>
          <Link to="/admin/posts/new" className="btn-primary">+ New Post</Link>
        </div>

        {loading ? <p>Loading...</p> : (
          <div className="admin-section" style={{ padding: 0 }}>
            <table className="admin-table posts-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Views</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post._id}>
                    <td className="posts-table-title">{post.title}</td>
                    <td>{post.category}</td>
                    <td>
                      <button className={`status-badge ${post.status}`} onClick={() => toggleStatus(post)} style={{ cursor: 'pointer', border: 'none', background: 'none', padding: 0 }}>
                        <span className={`status-badge ${post.status}`}>{post.status}</span>
                      </button>
                    </td>
                    <td>{post.views}</td>
                    <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="posts-actions">
                        <Link to={`/admin/posts/edit/${post._id}`} className="posts-action-btn">Edit</Link>
                        <button className="posts-action-btn danger" onClick={() => deletePost(post._id)}>Delete</button>
                        <Link to={`/post/${post.slug}`} target="_blank" className="posts-action-btn">View</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
