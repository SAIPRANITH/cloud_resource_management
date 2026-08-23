import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Resources from './pages/Resources';
import Billing from './pages/Billing';
import AdminDashboard from './pages/AdminDashboard';
import Monitoring from './pages/Monitoring';
import Alerts from './pages/Alerts';

/* ─── Protected Route: any logged-in user ─── */
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return <Layout>{children}</Layout>;
};

/* ─── Admin-only Route ─── */
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (!user.roles || !user.roles.includes('Admin')) return <Navigate to="/dashboard" />;
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
          <Router>
            <Routes>
              {/* Public */}
              <Route path="/"         element={<Landing />} />
              <Route path="/login"    element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* User routes */}
              <Route path="/dashboard"  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/projects"   element={<ProtectedRoute><Projects /></ProtectedRoute>} />
              <Route path="/resources"  element={<ProtectedRoute><Resources /></ProtectedRoute>} />
              <Route path="/billing"    element={<ProtectedRoute><Billing /></ProtectedRoute>} />
              <Route path="/monitoring" element={<ProtectedRoute><Monitoring /></ProtectedRoute>} />
              <Route path="/alerts"     element={<ProtectedRoute><Alerts /></ProtectedRoute>} />

              {/* Admin-only route */}
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
