import React from 'react';

export default function LoadingSpinner({ size = 'md', color = 'primary', fullScreen = false }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12', xl: 'w-16 h-16' };
  const colors = {
    primary: 'border-primary-600',
    white: 'border-white',
    gray: 'border-gray-400',
  };

  const spinner = (
    <div
      className={`${sizes[size]} border-4 ${colors[color]} border-t-transparent rounded-full animate-spin`}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          {spinner}
          <p className="text-gray-600 text-sm font-medium animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return spinner;
}
