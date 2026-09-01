import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import PublicTrackPage from './pages/PublicTrackPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ReportIssuePage from './pages/ReportIssuePage';
import CitizenDashboard from './pages/CitizenDashboard';
import OfficerDashboard from './pages/OfficerDashboard';
import DepartmentHeadDashboard from './pages/DepartmentHeadDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DepartmentsPage from './pages/DepartmentsPage';
import OfficersPage from './pages/OfficersPage';
import AnalyticsPage from './pages/AnalyticsPage';

// Route Guards
const RequireAuth = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace state={{ from: location.pathname }} />;
};

const RequireAdmin = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!user) return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace state={{ from: location.pathname }} />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
};

const RequireDeptHead = ({ children }) => {
  const { user, isDeptHead, isAdmin, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!user) return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace state={{ from: location.pathname }} />;
  if (!isDeptHead && !isAdmin) return <Navigate to="/" replace />;
  return children;
};

const RequireOfficer = ({ children }) => {
  const { user, isOfficer, isDeptHead, isAdmin, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!user) return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace state={{ from: location.pathname }} />;
  if (!isOfficer && !isDeptHead && !isAdmin) return <Navigate to="/" replace />;
  return children;
};

const RequireCitizen = ({ children }) => {
  const { user, isCitizen, isAdmin, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!user) return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace state={{ from: location.pathname }} />;
  if (!isCitizen && !isAdmin) return <Navigate to="/" replace />;
  return children;
};

function AppRoutes() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public Landing, Login, Register */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Dedicated Track Issue Routes */}
          <Route path="/track" element={<PublicTrackPage />} />
          <Route path="/track/:complaintNumber" element={<PublicTrackPage />} />
          <Route path="/track-issue" element={<Navigate to="/track" replace />} />
          <Route path="/track-issue/:complaintNumber" element={<PublicTrackPage />} />

          {/* Citizen Routes */}
          <Route path="/report" element={<ReportIssuePage />} />
          <Route
            path="/citizen"
            element={
              <RequireCitizen>
                <CitizenDashboard />
              </RequireCitizen>
            }
          />

          {/* Government Department Head Routes */}
          <Route
            path="/dept-head"
            element={
              <RequireDeptHead>
                <DepartmentHeadDashboard />
              </RequireDeptHead>
            }
          />

          {/* Field Officer Routes */}
          <Route
            path="/officer"
            element={
              <RequireOfficer>
                <OfficerDashboard />
              </RequireOfficer>
            }
          />

          {/* Municipality Commissioner / Admin Routes */}
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminDashboard />
              </RequireAdmin>
            }
          />
          <Route
            path="/departments"
            element={
              <RequireAdmin>
                <DepartmentsPage />
              </RequireAdmin>
            }
          />
          <Route
            path="/officers"
            element={
              <RequireAdmin>
                <OfficersPage />
              </RequireAdmin>
            }
          />
          <Route
            path="/analytics"
            element={
              <RequireAdmin>
                <AnalyticsPage />
              </RequireAdmin>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
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
