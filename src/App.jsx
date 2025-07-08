// src/App.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Routes, Route, Navigate, Link} from 'react-router-dom'; // <--- Import Routing components

// Import your Redux Thunk for listening to auth changes
import { startListeningForAuthChanges } from './store/slices/authSlice';

// Import your Firebase services for the initial connection tests (if you still want them)
import { auth, db, callApiGateway } from './firebaseConfig.js';

// Import your components
import Layout from './components/Layout.jsx'; // This will be the protected content
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import ProtectedRoute from './components/ProtectedRoute.jsx'; // Your gatekeeper component

function App() {
    const dispatch = useDispatch();
    const { loading: authLoading, isAuthenticated, error: authError } = useSelector(state => state.auth);

    // This useEffect sets up the Firebase Auth listener and runs optional connection tests.
    useEffect(() => {
        console.log("App.jsx: Setting up Firebase Auth listener via Redux...");
        dispatch(startListeningForAuthChanges());

        // --- Optional: Initial Firebase Service Connection Tests ---
        // These run once on app load to confirm your Firebase project setup (Firestore, Functions).
        // They are independent of the Redux auth state management, but often depend on a user (even anonymous) being present.
        const testInitialFirebaseConnections = async () => {
            try {
                // Ensure auth.currentUser exists before trying to get a token or interact with other services
                // This will be handled by the Redux auth listener after a short delay or user login.
                if (auth.currentUser) {
                    await auth.currentUser.getIdToken(true); // Refresh token for callable functions
                    console.log(`App.jsx: Successfully refreshed ID token for callable function test.`);
                } else {
                    console.log("App.jsx: No Firebase user active for direct connection tests (expected if not logged in).");
                }

                // Example Firestore test (uncomment if you want to use it)
                // const testDocRef = db.collection('app_startup_logs').doc();
                // await testDocRef.set({
                //     message: 'App started and Firebase connected successfully!',
                //     timestamp: new Date().toISOString(),
                //     userUid: auth.currentUser ? auth.currentUser.uid : 'unauthenticated',
                //     environment: process.env.NODE_ENV,
                // });
                // console.log("App.jsx: Firestore connection test successful. Logged startup.");

                // Example Callable function test (uncomment if you want to use it)
                // const callableTestResult = await callApiGateway({ action: 'testConnection', payload: {} });
                // console.log("App.jsx: Callable function connection test:", callableTestResult.data);

            } catch (error) {
                console.error("App.jsx: Firebase connection test failed (outside Redux auth flow):", error);
                if (error.code) console.error("Error Code:", error.code);
                if (error.message) console.error("Error Message:", error.message);
            }
        };

        // Delay the direct Firebase connection tests slightly to allow Redux auth listener to run first
        const timer = setTimeout(() => {
            // testInitialFirebaseConnections();
        }, 1500);

        return () => clearTimeout(timer); // Clean up the timer
    }, [dispatch]); // Effect depends on dispatch

    return (
        <>
            {authError && <p style={{ color: 'red', fontWeight: 'bold', textAlign: 'center' }}>Authentication Error: {authError}</p>}

            <Routes>
                {/* Public Routes */}
                <Route
                    path="/"
                    element={isAuthenticated ? <Navigate to="/app" replace /> : <Login />}
                />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected Layout - Single route that protects everything */}
                <Route
                    path="/app/*"
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                />

                {/* 404 for unmatched routes */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
}

export default App;