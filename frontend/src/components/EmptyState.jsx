import React from 'react';

export function EmptyState({ 
  title = 'No data found', 
  description = 'There is nothing to display', 
  icon = '📭',
  action = null,
  className = ''
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 mb-6">{description}</p>
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
}

export default EmptyState;
