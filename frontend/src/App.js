import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

// Import pages
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import NotFoundPage from './pages/NotFoundPage';

// Import admin pages
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import ProjectsManager from './admin/ProjectsManager';
import TeamManager from './admin/TeamManager';
import ServicesManager from './admin/ServicesManager';
import VideosManager from './admin/VideosManager';
import MessagesManager from './admin/MessagesManager';

// Import WhatsApp Button
import WhatsAppButton from './components/common/WhatsAppButton';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/admin/login';
    return null;
  }
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/project/:id" element={<ProjectDetailPage />} />
            
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="projects" element={<ProjectsManager />} />
              <Route path="team" element={<TeamManager />} />
              <Route path="services" element={<ServicesManager />} />
              <Route path="videos" element={<VideosManager />} />
              <Route path="messages" element={<MessagesManager />} />
            </Route>
            
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          
          {/* WhatsApp Button - Appears on all pages */}
          <WhatsAppButton />
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;