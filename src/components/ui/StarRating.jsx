import React from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating, maxStars = 5, size = 'sm', showValue = true, reviewCount }) {
  const sizes = { sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-5 h-5' };
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxStars }).map((_, i) => (
          <Star
            key={i}
            className={`${sizes[size]} ${
              i < fullStars
                ? 'fill-saffron-400 text-saffron-400'
                : i === fullStars && hasHalf
                ? 'fill-saffron-200 text-saffron-400'
                : 'fill-gray-200 text-gray-300'
            }`}
          />
        ))}
      </div>
      {showValue && (
        <span className="text-sm font-semibold text-gray-700">{rating.toFixed(1)}</span>
      )}
      {reviewCount !== undefined && (
        <span className="text-sm text-gray-400">({reviewCount.toLocaleString()})</span>
      )}
    </div>
  );
}
