import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import HomePage from './pages/HomePage';
import BlogListingPage from './pages/BlogListingPage';
import SingleBlogPost from './pages/SingleBlogPost';
import SearchPage from './pages/SearchPage';
import AffiliatePage from './pages/AffiliatePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin pages
import AdminDashboard from './pages/AdminDashboard';
import AdminPostsPage from './pages/AdminPostsPage';
import EditPostPage from './pages/EditPostPage';
import CategoriesPage from './pages/CategoriesPage';
import AdminAffiliatePage from './pages/AdminAffiliatePage';
import AnalyticsPage from './pages/AnalyticsPage';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Public layout (navbar + footer)
const PublicLayout = ({ children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Navbar />
    <div style={{ flex: 1 }}>{children}</div>
    <Footer />
  </div>
);

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
      <Route path="/posts" element={<PublicLayout><BlogListingPage /></PublicLayout>} />
      <Route path="/post/:slug" element={<PublicLayout><SingleBlogPost /></PublicLayout>} />
      <Route path="/search" element={<PublicLayout><SearchPage /></PublicLayout>} />
      <Route path="/affiliates" element={<PublicLayout><AffiliatePage /></PublicLayout>} />
      <Route path="/login" element={<LoginPage />} />

      {/* Admin routes (no public navbar/footer) */}
      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/posts" element={<ProtectedRoute><AdminPostsPage /></ProtectedRoute>} />
      <Route path="/admin/posts/new" element={<ProtectedRoute><EditPostPage /></ProtectedRoute>} />
      <Route path="/admin/posts/edit/:id" element={<ProtectedRoute><EditPostPage /></ProtectedRoute>} />
      <Route path="/admin/categories" element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />
      <Route path="/admin/affiliates" element={<ProtectedRoute><AdminAffiliatePage /></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />

      {/* 404 */}
      <Route path="*" element={<PublicLayout><NotFoundPage /></PublicLayout>} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
