import React from 'react';

export default function Badge({ children, variant = 'default', size = 'sm', className = '' }) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-primary-100 text-primary-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-saffron-100 text-saffron-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
    teal: 'bg-teal-100 text-teal-700',
    // Crowd levels
    'crowd-low': 'bg-green-50 text-green-700 border border-green-200',
    'crowd-moderate': 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    'crowd-busy': 'bg-orange-50 text-orange-700 border border-orange-200',
    'crowd-very-busy': 'bg-red-50 text-red-700 border border-red-200',
    // Verification
    verified: 'bg-teal-50 text-teal-700 border border-teal-200',
    pending: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    rejected: 'bg-red-50 text-red-700 border border-red-200',
  };

  const sizes = {
    xs: 'text-xs px-2 py-0.5',
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5',
  };

  return (
    <span className={`badge ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
}
