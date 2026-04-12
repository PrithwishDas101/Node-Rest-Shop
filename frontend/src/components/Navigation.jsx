import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from './Button';

export function Navigation() {
  const { isAuthenticated, logout, isInitialized } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // 🔥 FIX: prevent rendering before auth state is ready
  if (!isInitialized) {
    return null;
  }

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-primary-600 hover:text-primary-700"
          >
            <span className="text-2xl">🛍️</span>
            Shop
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">

            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-6">

                  <Link
                    to="/products"
                    className={`text-sm font-medium transition-colors ${
                      isActive('/products')
                        ? 'text-primary-600'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Products
                  </Link>

                  <Link
                    to="/orders"
                    className={`text-sm font-medium transition-colors ${
                      isActive('/orders')
                        ? 'text-primary-600'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Orders
                  </Link>

                  <Link
                    to="/account"
                    className={`text-sm font-medium transition-colors ${
                      isActive('/account')
                        ? 'text-primary-600'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Account
                  </Link>

                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={logout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-4">

                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>

                <Link to="/signup">
                  <Button size="sm">
                    Sign up
                  </Button>
                </Link>

              </div>
            )}

          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navigation;