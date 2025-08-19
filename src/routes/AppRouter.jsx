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

function AppRouter() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />}
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes with Layout wrapper */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Nested routes - these will render inside Layout */}
        <Route path="home" element={<Home />} />
        <Route path="explore" element={<Explore />} />
        <Route path="profile/:userId?" element={<Profile />} />
        <Route path="map" element={<MapPostsView />} />
        <Route path="upload" element={<UploadPost />} />
        <Route path="bookmarks" element={<Bookmarks />} />

        {/* Default redirect to home for any unmatched nested routes */}
        <Route index element={<Navigate to="/home" replace />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;