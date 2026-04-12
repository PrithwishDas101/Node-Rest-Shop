import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useState } from 'react';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, loading, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/products');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await login(formData.email, formData.password);

    // ✅ SUCCESS
    if (result.success) {
      navigate('/products');
      return;
    }

    // ❌ FAILURE → show backend error under password field
    setErrors({
      password: result.message || 'Invalid credentials'
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-600">
            Sign in to your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card p-8 space-y-6">

          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />

          <Button
            variant="primary"
            type="submit"
            className="w-full"
            isLoading={loading}
          >
            Sign In
          </Button>

        </form>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-slate-600">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Create one
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;