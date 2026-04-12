import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function ProtectedRoute({ children }) {
  const { isAuthenticated, isInitialized } = useAuth();
  const location = useLocation();

  // ✅ still loading auth state → do nothing
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // 🔥 FIX: allow public routes to NEVER be affected by auth logic
  const publicRoutes = ['/login', '/signup'];

  if (publicRoutes.includes(location.pathname)) {
    return children;
  }

  // 🔥 ONLY protect real private routes
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;