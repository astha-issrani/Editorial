import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminSidebar.css';

const links = [
  { to: '/admin', label: 'Dashboard', exact: true },
  { to: '/admin/posts', label: 'Posts' },
  { to: '/admin/posts/new', label: 'New Post' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/affiliates', label: 'Affiliate Links' },
  { to: '/admin/analytics', label: 'Analytics' },
];

export default function AdminSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="admin-sidebar">
      <a href="/" className="admin-sidebar-logo">THE EDITORIAL</a>
      <nav className="admin-nav">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.exact}
            className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="admin-sidebar-footer">
        <p className="admin-user-name">{user?.name}</p>
        <p className="admin-user-role">{user?.role}</p>
        <button className="admin-logout-btn" onClick={handleLogout}>Sign Out</button>
      </div>
    </aside>
  );
}
