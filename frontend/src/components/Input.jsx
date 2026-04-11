import React from 'react';

export function Input({ 
  variant = 'default',
  error = null, 
  label = null, 
  helperText = null, 
  className = '',
  ...props 
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
          {props.required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <input
        className={`input-base ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
        {...props}
      />
      
      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-slate-500">{helperText}</p>
      )}
    </div>
  );
}

export default Input;
