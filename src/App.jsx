// src/App.jsx
import React, { useEffect } from 'react';
import {Routes, Route, Navigate, Link} from 'react-router-dom'; // <--- Import Routing components


// Import your Firebase services for the initial connection tests (if you still want them)
import { auth, db, callApiGateway } from './firebaseConfig.js';

// Import your components
import Layout from './components/Layout.jsx'; // This will be the protected content
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import ProtectedRoute from './components/ProtectedRoute.jsx'; // Your gatekeeper component
import {useAuthStore} from "./stores/useAuthStore.js"; // Your gatekeeper component
import { Toaster } from "@/components/ui/toaster";

function App() {
    const { loading: authLoading, isAuthenticated, error: authError } = useAuthStore();

    // This useEffect sets up the Firebase Auth listener and runs optional connection tests.
    useEffect(() => {
        console.log("App.jsx: Setting up Firebase Auth listener via Redux...");
        useAuthStore.getState().startListeningForAuthChanges();
    }, []);

    return (
        <>
            {authError && <p style={{ color: 'red', fontWeight: 'bold', textAlign: 'center' }}>Authentication Error: {authError}</p>}

            <Routes>
                {/* Public Routes */}
                <Route
                    path="/"
                    element={isAuthenticated ? <Navigate to="/home" replace /> : <Login />}
                />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected Layout - Single route that protects everything */}
                <Route
                    path="/home"
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                />

                {/* 404 for unmatched routes */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster />
        </>
    );
}

export default App;