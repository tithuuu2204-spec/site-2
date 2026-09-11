import React from 'react';
import { AlertTriangle, Info, Search, Heart, Compass } from 'lucide-react';

const VARIANTS = {
  noResults: {
    icon: Search,
    title: 'No results found',
    description: 'Try adjusting your search or filters.',
    color: 'text-gray-400',
  },
  noBookings: {
    icon: Compass,
    title: 'No trips yet',
    description: "You haven't booked any experiences yet. Start exploring!",
    color: 'text-primary-400',
  },
  noFavorites: {
    icon: Heart,
    title: 'No saved experiences',
    description: 'Save experiences you love by tapping the heart icon.',
    color: 'text-red-400',
  },
  error: {
    icon: AlertTriangle,
    title: 'Something went wrong',
    description: 'We ran into an issue. Please try again.',
    color: 'text-red-400',
  },
  info: {
    icon: Info,
    title: 'Nothing here yet',
    description: '',
    color: 'text-blue-400',
  },
};

export default function EmptyState({
  variant = 'noResults',
  title,
  description,
  action,
  className = '',
}) {
  const config = VARIANTS[variant] || VARIANTS.info;
  const Icon = config.icon;

  return (
    <div className={`flex flex-col items-center justify-center py-16 text-center ${className}`}>
      <div className={`${config.color} mb-4 opacity-60`}>
        <Icon size={48} />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title || config.title}</h3>
      {(description || config.description) && (
        <p className="text-gray-500 text-sm max-w-sm mb-6">{description || config.description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
