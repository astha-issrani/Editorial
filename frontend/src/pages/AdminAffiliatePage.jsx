import { useState, useEffect } from 'react';
import api from '../utils/api';
import AdminSidebar from '../components/layout/AdminSidebar';
import './AdminDashboard.css';

export default function AdminAffiliatePage() {
  const [affiliates, setAffiliates] = useState([]);
  const [form, setForm] = useState({ name: '', url: '', description: '', category: '' });
  const [error, setError] = useState('');

  useEffect(() => { fetchAffiliates(); }, []);

  const fetchAffiliates = async () => {
    const res = await api.get('/api/affiliates/admin');
    setAffiliates(res.data);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addAffiliate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/api/affiliates', form);
      setAffiliates([res.data, ...affiliates]);
      setForm({ name: '', url: '', description: '', category: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Error');
    }
  };

  const deleteAffiliate = async (id) => {
    if (!window.confirm('Delete this affiliate?')) return;
    await api.delete(`/affiliates/${id}`);
    setAffiliates(affiliates.filter(a => a._id !== id));
  };

  const toggleActive = async (aff) => {
    const res = await api.put(`/api/affiliates/${aff._id}`, { active: !aff.active });
    setAffiliates(affiliates.map(a => a._id === aff._id ? res.data : a));
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header">
          <h1 className="admin-page-title">Affiliate Links</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px', alignItems: 'start' }}>
          <div className="admin-section" style={{ padding: 0 }}>
            <table className="admin-table" style={{ padding: 0 }}>
              <thead>
                <tr>
                  <th style={{ paddingLeft: '20px' }}>Name</th>
                  <th>Category</th>
                  <th>Clicks</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {affiliates.map(aff => (
                  <tr key={aff._id}>
                    <td style={{ paddingLeft: '20px' }}>
                      <strong>{aff.name}</strong>
                      <div style={{ fontSize: '12px', color: '#707070', marginTop: '2px' }}>{aff.url}</div>
                    </td>
                    <td>{aff.category}</td>
                    <td>{aff.clicks}</td>
                    <td>
                      <span className={`status-badge ${aff.active ? 'published' : 'draft'}`}>
                        {aff.active ? 'active' : 'inactive'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                          style={{ background: 'none', border: 'none', fontSize: '12px', color: '#505050', cursor: 'pointer', textDecoration: 'underline' }}
                          onClick={() => toggleActive(aff)}
                        >{aff.active ? 'Deactivate' : 'Activate'}</button>
                        <button
                          style={{ background: 'none', border: 'none', fontSize: '12px', color: '#c00', cursor: 'pointer', textDecoration: 'underline' }}
                          onClick={() => deleteAffiliate(aff._id)}
                        >Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="admin-section">
            <h2 className="admin-section-title">Add Affiliate</h2>
            {error && <div style={{ color: '#c00', fontSize: '13px', marginBottom: '12px' }}>{error}</div>}
            <form onSubmit={addAffiliate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { name: 'name', label: 'Name', placeholder: 'Brand name' },
                { name: 'url', label: 'URL', placeholder: 'https://...' },
                { name: 'category', label: 'Category', placeholder: 'e.g. Tools' },
                { name: 'description', label: 'Description', placeholder: 'Short description' }
              ].map(f => (
                <div key={f.name} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#505050' }}>{f.label}</label>
                  <input
                    name={f.name}
                    value={form[f.name]}
                    onChange={handleChange}
                    placeholder={f.placeholder}
                    required={f.name === 'name' || f.name === 'url'}
                    style={{ border: '1px solid #d0d0d0', padding: '10px 14px', fontSize: '14px', outline: 'none' }}
                  />
                </div>
              ))}
              <button type="submit" className="btn-primary">Add Affiliate</button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
