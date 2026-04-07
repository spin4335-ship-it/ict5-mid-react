import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    const location = useLocation();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                state={{ from: location, requireAuth: true }}
                replace
            />
        );
    }

    return children;
};

export default ProtectedRoute;
