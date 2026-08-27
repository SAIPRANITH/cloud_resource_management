import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, Loader2 } from 'lucide-react';
import LoadingScreen from './components/ui/LoadingScreen';

// Pages lazy imports
const Landing = React.lazy(() => import('./pages/Landing'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Projects = React.lazy(() => import('./pages/Projects'));
const Resources = React.lazy(() => import('./pages/Resources'));
const Billing = React.lazy(() => import('./pages/Billing'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const Monitoring = React.lazy(() => import('./pages/Monitoring'));
const Alerts = React.lazy(() => import('./pages/Alerts'));

const SplashLoadingScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gray-950 text-white overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-gray-950 to-violet-900/30 animate-pulse" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="p-5 rounded-3xl bg-indigo-500/10 shadow-[0_0_50px_rgba(99,102,241,0.25)] backdrop-blur-xl border border-indigo-500/30"
        >
          <Cloud className="w-16 h-16 text-indigo-400" />
        </motion.div>
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400 drop-shadow-sm">
            VIT Cloud
          </h1>
          <div className="mt-5 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-indigo-500/80 animate-spin" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return <Layout>{children}</Layout>;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (!user.roles || !user.roles.includes('Admin')) return <Navigate to="/dashboard" />;
  return <Layout>{children}</Layout>;
};

// Animated route wrapper
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
    className="h-full w-full"
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public */}
        <Route path="/"         element={<PageWrapper><Landing /></PageWrapper>} />
        <Route path="/login"    element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />

        {/* User routes */}
        <Route path="/dashboard"  element={<ProtectedRoute><PageWrapper><Dashboard /></PageWrapper></ProtectedRoute>} />
        <Route path="/projects"   element={<ProtectedRoute><PageWrapper><Projects /></PageWrapper></ProtectedRoute>} />
        <Route path="/resources"  element={<ProtectedRoute><PageWrapper><Resources /></PageWrapper></ProtectedRoute>} />
        <Route path="/billing"    element={<ProtectedRoute><PageWrapper><Billing /></PageWrapper></ProtectedRoute>} />
        <Route path="/monitoring" element={<ProtectedRoute><PageWrapper><Monitoring /></PageWrapper></ProtectedRoute>} />
        <Route path="/alerts"     element={<ProtectedRoute><PageWrapper><Alerts /></PageWrapper></ProtectedRoute>} />

        {/* Admin-only route */}
        <Route path="/admin" element={<AdminRoute><PageWrapper><AdminDashboard /></PageWrapper></AdminRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300 relative">
          <AnimatePresence mode="wait">
            {loading && <SplashLoadingScreen key="splash" />}
          </AnimatePresence>
          
          {!loading && (
            <Router>
              <Suspense fallback={<LoadingScreen />}>
                <AnimatedRoutes />
              </Suspense>
            </Router>
          )}
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
