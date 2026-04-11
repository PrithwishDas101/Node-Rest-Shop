import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';
import ToastContainer from './components/ToastContainer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CreateProductPage from './pages/CreateProductPage';
import OrdersPage from './pages/OrdersPage';
import AccountPage from './pages/AccountPage';
import NotFoundPage from './pages/NotFoundPage';

// Styles
import './styles/index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-slate-50">
          <Navigation />
          <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />

              {/* Protected Routes */}
              <Route
                path="/create-product"
                element={
                  <ProtectedRoute>
                    <CreateProductPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <OrdersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <AccountPage />
                  </ProtectedRoute>
                }
              />

              {/* Catch all */}
              <Route path="/" element={<Navigate to="/products" replace />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <ToastContainer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
