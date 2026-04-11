import React from 'react';

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  isLoading = false, 
  children, 
  className = '',
  ...props 
}) {
  const baseClass = 'btn-base font-medium rounded-lg transition-all duration-200';
  
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300 focus:ring-slate-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'text-slate-600 hover:bg-slate-100 focus:ring-slate-400',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseClass} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
