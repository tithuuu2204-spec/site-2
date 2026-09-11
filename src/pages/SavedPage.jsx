import React, { useEffect, useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { experienceService } from '../services/experienceService';
import ExperienceCard from '../components/experiences/ExperienceCard';
import EmptyState from '../components/ui/EmptyState';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function SavedPage() {
  const { favorites, clearFavorites } = useApp();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavs = async () => {
      if (favorites.size === 0) {
        setExperiences([]);
        setLoading(false);
        return;
      }
      // Since mock data is fast, we fetch all and filter locally
      const all = await experienceService.fetchExperiences();
      setExperiences(all.filter(e => favorites.has(e.id)));
      setLoading(false);
    };
    loadFavs();
  }, [favorites]);

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-16">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Heart size={28} className="text-red-500 fill-red-500" /> Saved Experiences
          </h1>
          {experiences.length > 0 && (
            <button onClick={clearFavorites} className="text-sm text-gray-500 hover:text-red-600 font-medium transition-colors">
              Clear All
            </button>
          )}
        </div>

        {!loading && experiences.length === 0 ? (
          <EmptyState 
            variant="noFavorites" 
            action={<Link to="/explore" className="btn-primary mt-4">Discover Experiences</Link>} 
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {experiences.map(exp => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
