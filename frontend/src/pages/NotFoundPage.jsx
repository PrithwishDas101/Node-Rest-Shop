import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="text-center">
        <div className="text-6xl mb-6">🔍</div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Page Not Found</h1>
        <p className="text-slate-600 mb-8">The page you're looking for doesn't exist</p>
        <Button onClick={() => navigate('/products')}>
          Go to Products
        </Button>
      </div>
    </div>
  );
}

export default NotFoundPage;
