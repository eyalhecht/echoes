// src/App.jsx
import React, { useEffect } from 'react';
    import { Routes, Route, Navigate } from 'react-router-dom';

// Import your Firebase services for the initial connection tests (if you still want them)
import { useAuthStore } from "./stores/useAuthStore.js";
import { Toaster } from "@/components/ui/toaster";

// Import the router
import AppRouter from './routes/AppRouter.jsx';

function App() {
    const { error: authError } = useAuthStore();

    // This useEffect sets up the Firebase Auth listener and runs optional connection tests.
    useEffect(() => {
        useAuthStore.getState().startListeningForAuthChanges();
    }, []);

    return (
        <>
            {authError && <p style={{ color: 'red', fontWeight: 'bold', textAlign: 'center' }}>Authentication Error: {authError}</p>}
            <AppRouter />
            <Toaster />
        </>
    );
}

export default App;