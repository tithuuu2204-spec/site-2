import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/ui/LoadingSpinner';
import { useAuth } from './contexts/AuthContext';

// Lazy-loaded pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ExplorePage = lazy(() => import('./pages/ExplorePage'));
const ExperienceDetailPage = lazy(() => import('./pages/ExperienceDetailPage'));
const AIPlannerPage = lazy(() => import('./pages/AIPlannerPage'));
const TripResultPage = lazy(() => import('./pages/TripResultPage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const BookingConfirmationPage = lazy(() => import('./pages/BookingConfirmationPage'));
const TravelerDashboard = lazy(() => import('./pages/TravelerDashboard'));
const HostDashboard = lazy(() => import('./pages/HostDashboard'));
const HostCreateExperience = lazy(() => import('./pages/HostCreateExperience'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const CrowdInsightsPage = lazy(() => import('./pages/CrowdInsightsPage'));
const DestinationsPage = lazy(() => import('./pages/DestinationsPage'));
const SavedPage = lazy(() => import('./pages/SavedPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Protected route wrapper
function ProtectedRoute({ children, requiredRole }) {
  const { user, role, loading } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && role !== requiredRole) return <Navigate to="/" replace />;
  return children;
}

// Pages with no footer (clean full-screen layouts)
const NO_FOOTER_PATHS = [];

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<LoadingSpinner fullScreen />}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/experience/:id" element={<ExperienceDetailPage />} />
            <Route path="/destinations" element={<DestinationsPage />} />
            <Route path="/ai-planner" element={<AIPlannerPage />} />
            <Route path="/trip-result" element={<TripResultPage />} />
            <Route path="/crowd-insights" element={<CrowdInsightsPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Semi-protected (works without login but better with) */}
            <Route path="/saved" element={<SavedPage />} />

            {/* Traveler protected */}
            <Route
              path="/booking/:id"
              element={
                <ProtectedRoute>
                  <BookingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking-confirmation"
              element={
                <ProtectedRoute>
                  <BookingConfirmationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <TravelerDashboard />
                </ProtectedRoute>
              }
            />

            {/* Host routes */}
            <Route
              path="/host/dashboard"
              element={
                <ProtectedRoute>
                  <HostDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/host/create"
              element={
                <ProtectedRoute>
                  <HostCreateExperience />
                </ProtectedRoute>
              }
            />

            {/* Admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
