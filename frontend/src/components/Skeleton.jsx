import React from 'react';

export function Skeleton({ className = 'w-full h-12' }) {
  return (
    <div className={`${className} bg-slate-200 rounded-lg animate-pulse`} />
  );
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className="h-4 w-full"
          style={{ 
            width: i === lines - 1 ? '75%' : '100%'
          }}
        />
      ))}
    </div>
  );
}

export function SkeletonGrid({ count = 6, className = '' }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card p-4 space-y-4">
          <Skeleton className="h-48 w-full" />
          <SkeletonText lines={2} />
          <Skeleton className="h-10" />
        </div>
      ))}
    </div>
  );
}

export default Skeleton;
