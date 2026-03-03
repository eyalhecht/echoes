import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spinner } from "@/components/ui/spinner";
import Layout from '../components/Layout.jsx';
import Login from '../components/Login.jsx';
import Signup from '../components/Signup.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import { useAuthStore } from '../stores/useAuthStore.js';

// Import your page components
import Home from '../components/Home.jsx';
import { Explore } from '../components/Explore.jsx';
import Profile from '../components/Profile.jsx';
import MapPostsView from '../components/MapPostsView.jsx';
import UploadPost from '../components/UploadPost.jsx';
import Bookmarks from '../components/Bookmarks.jsx';
import LandingPage from "@/components/LandingPage.jsx";
import PrivacyPolicy from '../components/PrivacyPolicy.jsx';
import TermsOfService from '../components/TermsOfService.jsx';

function AppRouter() {
  const { isAuthenticated, loading } = useAuthStore();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Spinner size="lg" className="mx-auto" />
          <p className="text-sm text-stone-400" style={{ fontFamily: "'Lora', Georgia, serif" }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/home" replace /> : <LandingPage />}
      />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/home" replace /> : <Login />}
      />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />

      {/* Protected Routes with Layout wrapper */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Nested routes - these will render inside Layout */}
        <Route path="/home" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/profile/:userId?" element={<Profile />} />
        <Route path="/map" element={<MapPostsView />} />
        <Route path="/upload" element={<UploadPost />} />
        <Route path="/bookmarks" element={<Bookmarks />} />

        {/* Default redirect to home for any unmatched nested routes */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;