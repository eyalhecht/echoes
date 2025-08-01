import React from 'react';
import { Navigate } from 'react-router-dom';
import {useAuthStore} from "../stores/useAuthStore.js";
import LoadingScreen from "@/components/LoadingScreen.jsx";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuthStore();

    if (loading) {
        return <LoadingScreen/>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;