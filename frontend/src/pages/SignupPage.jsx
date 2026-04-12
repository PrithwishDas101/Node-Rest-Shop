import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export function SignupPage() {
  const navigate = useNavigate();
  const { signup, loading, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);

  // ⚠️ OPTIONAL redirect ONLY if already logged in
  useEffect(() => {
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
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    const hasErrors = Object.keys(newErrors).length > 0;

    if (hasErrors) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }

    return !hasErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) return;

    const result = await signup(formData.email, formData.password);

    // ❌ FAILED SIGNUP
    if (!result.success) {
      setErrors({
        password: result.message || 'Signup failed'
      });

      setShake(true);
      setTimeout(() => setShake(false), 400);

      return;
    }

    // ✅ SUCCESS ONLY
    navigate('/products');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className={`w-full max-w-md ${shake ? 'animate-pulse' : ''}`}>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Create Account
          </h1>
          <p className="text-slate-600">
            Join us today and start shopping
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
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            helperText="At least 6 characters"
          />

          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />

          <Button
            variant="primary"
            type="submit"
            className="w-full"
            isLoading={loading}
          >
            Create Account
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-slate-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;