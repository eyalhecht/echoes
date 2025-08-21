import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import {useAuthStore} from "../stores/useAuthStore.js";
import LoadingScreen from "@/components/LoadingScreen.jsx";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuthStore();
    const location = useLocation();

    if (loading) {
        return <div/>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />;
    }

    return children;
};

export default ProtectedRoute;