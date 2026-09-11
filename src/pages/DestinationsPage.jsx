import React from 'react';
import { Link } from 'react-router-dom';
import { DESTINATIONS } from '../data/seedExperiences';
import { Star, MapPin } from 'lucide-react';

export default function DestinationsPage() {
  return (
    <div className="bg-white min-h-screen pt-20 pb-16">
      <div className="container-custom text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4 mt-8">Explore Incredible India</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">From royal palaces to serene backwaters, discover the diverse landscapes and cultures of India through our verified local hosts.</p>
      </div>

      <div className="container-custom">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DESTINATIONS.map(dest => (
            <Link 
              key={dest.id} 
              to={`/explore?city=${encodeURIComponent(dest.city)}`}
              className="group relative h-80 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all block"
            >
              <img src={dest.image} alt={dest.city} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent" />
              
              <div className="absolute bottom-0 left-0 p-6 w-full text-white">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <h2 className="text-2xl font-bold font-display">{dest.city}</h2>
                    <p className="text-sm text-gray-300 flex items-center gap-1 mt-1"><MapPin size={14}/> {dest.state}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-sm font-semibold">
                    <Star size={14} className="text-saffron-400 fill-saffron-400" /> {dest.rating}
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <span className="text-sm font-medium">{dest.experienceCount} Experiences</span>
                  <span className="text-sm font-bold text-saffron-300">Explore →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
