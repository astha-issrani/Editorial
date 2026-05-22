import { useState, useEffect } from 'react';
import api from '../utils/api';
import AdminSidebar from '../components/layout/AdminSidebar';
import './AdminDashboard.css';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => { fetchCats(); }, []);

  const fetchCats = async () => {
    const res = await api.get('/api/categories');
    setCategories(res.data);
  };

  const addCategory = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/api/categories', {
        name: newName,
        slug: newName.toLowerCase().replace(/\s+/g, '-')
      });
      setCategories([...categories, res.data]);
      setNewName('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding category');
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    await api.delete(`/api/categories/${id}`);
    setCategories(categories.filter(c => c._id !== id));
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header">
          <h1 className="admin-page-title">Categories</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>
          <div className="admin-section">
            <h2 className="admin-section-title">All Categories</h2>
            {categories.length === 0 ? (
              <p style={{ color: '#707070', fontSize: '14px' }}>No categories yet.</p>
            ) : (
              <table className="admin-table">
                <thead><tr><th>Name</th><th>Slug</th><th>Actions</th></tr></thead>
                <tbody>
                  {categories.map(cat => (
                    <tr key={cat._id}>
                      <td style={{ fontWeight: 500 }}>{cat.name}</td>
                      <td style={{ color: '#707070' }}>{cat.slug}</td>
                      <td>
                        <button
                          style={{ background: 'none', border: 'none', color: '#c00', cursor: 'pointer', fontSize: '12px', textDecoration: 'underline' }}
                          onClick={() => deleteCategory(cat._id)}
                        >Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="admin-section">
            <h2 className="admin-section-title">Add Category</h2>
            {error && <div className="form-error" style={{ marginBottom: '16px' }}>{error}</div>}
            <form onSubmit={addCategory} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#505050' }}>
                  Category Name
                </label>
                <input
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Photography"
                  required
                  style={{ border: '1px solid #d0d0d0', padding: '10px 14px', fontSize: '14px', outline: 'none' }}
                />
              </div>
              <button type="submit" className="btn-primary">Add Category</button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
