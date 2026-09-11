import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Users, IndianRupee, Heart, Star, ShieldCheck, TrendingUp, Gem, Calendar } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import Badge from '../ui/Badge';

export default function ExperienceCard({ experience, compact = false }) {
  const { addFavorite, removeFavorite, isFavorite } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  if (!experience) return null;

  const {
    id,
    title = 'Untitled Experience',
    category = 'Cultural Events',
    location = '',
    city = '',
    price = 0,
    rating = 4.5,
    reviewCount = 0,
    bookingCount = 0,
    spotsRemaining,
    capacity,
    coverImage,
    images = [],
    hostName = 'ExploreHub Host',
    hostVerified = false,
    isTrending = false,
    isHiddenGem = false,
    isFeatured = false,
    date,
    startTime,
    duration,
    tags = [],
  } = experience;

  const imageUrl = imgError
    ? `https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&auto=format&fit=crop`
    : (coverImage || images[0] || `https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&auto=format&fit=crop`);

  const displayCity = city || location.split(',')[0] || location;
  const spotsPercent = spotsRemaining && capacity ? ((capacity - spotsRemaining) / capacity) * 100 : null;
  const isLowAvailability = spotsRemaining && spotsRemaining <= 5;
  const fav = isFavorite(id);

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    fav ? removeFavorite(id) : addFavorite(id);
  };

  if (compact) {
    return (
      <Link to={`/experience/${id}`} className="flex gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
        <img
          src={imageUrl}
          alt={title}
          onError={() => setImgError(true)}
          className="w-16 h-16 rounded-lg object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-primary-600 font-medium mb-0.5">{category}</p>
          <h4 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors">{title}</h4>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
            <MapPin size={10} /> {displayCity}
          </p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm font-bold text-primary-600 flex items-center">
              <IndianRupee size={12} />{price.toLocaleString()}
            </span>
            <span className="flex items-center gap-0.5 text-xs text-gray-500">
              <Star size={10} className="fill-saffron-400 text-saffron-400" />{rating}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/experience/${id}`} className="card group cursor-pointer block">
      {/* Image */}
      <div className="relative overflow-hidden h-52">
        <img
          src={imageUrl}
          alt={title}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isTrending && (
            <Badge variant="warning" size="xs" className="shadow-md">
              <TrendingUp size={10} /> Trending
            </Badge>
          )}
          {isHiddenGem && (
            <Badge variant="purple" size="xs" className="shadow-md">
              <Gem size={10} /> Hidden Gem
            </Badge>
          )}
          {isFeatured && (
            <Badge variant="primary" size="xs" className="shadow-md">
              ⭐ Featured
            </Badge>
          )}
        </div>

        {/* Favorite button */}
        <button
          onClick={handleFavorite}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md ${
            fav ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-600 hover:text-red-500'
          }`}
        >
          <Heart size={16} className={fav ? 'fill-white' : ''} />
        </button>

        {/* Bottom: city + category */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <span className="text-white text-xs font-medium flex items-center gap-1">
            <MapPin size={11} /> {displayCity}
          </span>
          <span className="bg-white/90 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded-full">
            {category}
          </span>
        </div>

        {/* Low availability warning */}
        {isLowAvailability && (
          <div className="absolute bottom-0 inset-x-0 bg-orange-500/90 text-white text-xs font-semibold text-center py-1">
            Only {spotsRemaining} spots left!
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display font-semibold text-gray-900 text-base line-clamp-1 group-hover:text-primary-600 transition-colors mb-1">
          {title}
        </h3>

        {/* Host */}
        <div className="flex items-center gap-1.5 mb-3">
          <p className="text-xs text-gray-500 truncate">{hostName}</p>
          {hostVerified && (
            <ShieldCheck size={13} className="text-teal-500 shrink-0" />
          )}
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-2 mb-3">
          {date && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar size={11} /> {new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
          )}
          {duration && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Clock size={11} /> {duration}
            </span>
          )}
          {bookingCount > 0 && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Users size={11} /> {bookingCount} booked
            </span>
          )}
        </div>

        {/* Rating + Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star size={14} className="fill-saffron-400 text-saffron-400" />
            <span className="text-sm font-semibold text-gray-800">{rating}</span>
            {reviewCount > 0 && (
              <span className="text-xs text-gray-400">({reviewCount})</span>
            )}
          </div>
          <div className="text-right">
            <div className="flex items-center gap-0.5 text-primary-600 font-bold text-lg">
              <IndianRupee size={15} />
              {price.toLocaleString()}
            </div>
            <p className="text-xs text-gray-400">per person</p>
          </div>
        </div>

        {/* Capacity bar */}
        {spotsPercent !== null && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Availability</span>
              <span>{spotsRemaining} left</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  spotsPercent >= 80 ? 'bg-red-400' : spotsPercent >= 50 ? 'bg-orange-400' : 'bg-teal-400'
                }`}
                style={{ width: `${spotsPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
