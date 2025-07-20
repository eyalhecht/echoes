import React from 'react';
import { Navigate } from 'react-router-dom';
import {useAuthStore} from "../stores/useAuthStore.js";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuthStore();

    if (loading) {
        return <div style={{textAlign: 'center', padding: '50px'}}>Loading authentication...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;