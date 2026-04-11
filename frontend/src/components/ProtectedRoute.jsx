import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function ProtectedRoute({ children }) {
  const { isAuthenticated, isInitialized } = useAuth();

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

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
