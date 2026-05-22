import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import AdminSidebar from '../components/layout/AdminSidebar';
import './AdminDashboard.css';
import './EditPost.css';

const CATEGORIES = ['Culture', 'Design', 'Tech', 'Business', 'Sustainability', 'Art', 'Architecture', 'Travel', 'Science', 'Typography', 'Workspace'];

function RichTextEditor({ value, onChange }) {
  const editorRef = useRef(null);
  const savedRange = useRef(null);
  const [showLink, setShowLink] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  useEffect(() => {
    if (editorRef.current && value && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fmt = (cmd, val) => {
    editorRef.current.focus();
    document.execCommand(cmd, false, val || null);
    onChange(editorRef.current.innerHTML);
  };

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel.rangeCount) savedRange.current = sel.getRangeAt(0).cloneRange();
  };

  const restoreSelection = () => {
    if (!savedRange.current) return;
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(savedRange.current);
  };

  const confirmLink = () => {
    if (!linkUrl) return;
    restoreSelection();
    document.execCommand('createLink', false, linkUrl);
    editorRef.current.querySelectorAll('a').forEach(a => {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    });
    setShowLink(false);
    setLinkUrl('');
    onChange(editorRef.current.innerHTML);
  };

  return (
    <div className="rich-editor-wrapper">
      <div className="rich-toolbar">
        <button type="button" onClick={() => fmt('bold')} className="toolbar-btn bold" title="Bold">B</button>
        <button type="button" onClick={() => fmt('italic')} className="toolbar-btn italic" title="Italic">I</button>
        <div className="toolbar-divider" />
        <button
          type="button"
          title="Insert link"
          className="toolbar-btn"
          onClick={() => { saveSelection(); setShowLink(s => !s); }}
        >
          🔗
        </button>
        <div className="toolbar-divider" />
        <button type="button" onClick={() => fmt('insertUnorderedList')} className="toolbar-btn" title="Bullet list">• List</button>
        <button type="button" onClick={() => fmt('insertOrderedList')} className="toolbar-btn" title="Numbered list">1. List</button>
        <div className="toolbar-divider" />
        <select
          className="toolbar-select"
          defaultValue=""
          onChange={e => { fmt('formatBlock', e.target.value); e.target.value = ''; }}
        >
          <option value="" disabled>Format</option>
          <option value="p">Paragraph</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="blockquote">Blockquote</option>
        </select>
      </div>

      {showLink && (
        <div className="link-modal">
          <input
            type="url"
            placeholder="https://..."
            value={linkUrl}
            onChange={e => setLinkUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && confirmLink()}
            autoFocus
          />
          <button type="button" onClick={confirmLink}>Insert</button>
          <button type="button" onClick={() => { setShowLink(false); setLinkUrl(''); }}>Cancel</button>
        </div>
      )}

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className="rich-editor-body"
        onInput={() => onChange(editorRef.current.innerHTML)}
      />
    </div>
  );
}

export default function EditPostPage() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '', excerpt: '', content: '', category: 'Design',
    coverImage: '', tags: '', readTime: '5 Min Read',
    featured: false, status: 'draft'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!isNew) {
      api.get(`/api/posts/admin/all`).then(res => {
        const post = res.data.find(p => p._id === id);
        if (post) setForm({ ...post, tags: (post.tags || []).join(', ') });
      }).catch(console.error);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean)
      };
      if (isNew) await api.post('/api/posts', payload);
else await api.put(`/api/posts/${id}`, payload);
      navigate('/admin/posts');
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-header">
          <h1 className="admin-page-title">{isNew ? 'New Post' : 'Edit Post'}</h1>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="edit-post-form">
          <div className="edit-post-main">
            <div className="form-field">
              <label>Title *</label>
              <input name="title" value={form.title} onChange={handleChange} required placeholder="Article title" />
            </div>
            <div className="form-field">
              <label>Excerpt *</label>
              <textarea name="excerpt" value={form.excerpt} onChange={handleChange} required rows={3} placeholder="Brief summary of the article" />
            </div>
            <div className="form-field">
              <label>Content *</label>
              <RichTextEditor
                value={form.content}
                onChange={(html) => setForm(prev => ({ ...prev, content: html }))}
              />
            </div>
          </div>

          <div className="edit-post-sidebar">
            <div className="edit-sidebar-section">
              <h3 className="edit-sidebar-title">Publish</h3>
              <div className="form-field">
                <label>Status</label>
                <select name="status" value={form.status} onChange={handleChange}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <label className="checkbox-label">
                <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
                Featured post
              </label>
              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}
                disabled={loading}
              >
                {loading ? 'Saving...' : isNew ? 'Publish Post' : 'Update Post'}
              </button>
            </div>

            <div className="edit-sidebar-section">
              <h3 className="edit-sidebar-title">Details</h3>
              <div className="form-field">
                <label>Category</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-field">
                <label>Read Time</label>
                <input name="readTime" value={form.readTime} onChange={handleChange} placeholder="5 Min Read" />
              </div>
              <div className="form-field">
                <label>Cover Image URL</label>
                <input name="coverImage" value={form.coverImage} onChange={handleChange} placeholder="https://..." />
              </div>
              {form.coverImage && (
                <img src={form.coverImage} alt="Cover preview" className="cover-preview" />
              )}
              <div className="form-field">
                <label>Tags (comma-separated)</label>
                <input name="tags" value={form.tags} onChange={handleChange} placeholder="design, technology, culture" />
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}