import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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

function AppRouter() {
  const { isAuthenticated, loading } = useAuthStore();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
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