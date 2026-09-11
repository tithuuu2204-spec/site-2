import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Filter, Search, MapPin, X, ArrowUpDown, ChevronDown } from 'lucide-react';
import ExperienceCard from '../components/experiences/ExperienceCard';
import { ExperienceCardSkeleton } from '../components/ui/Skeleton';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { experienceService } from '../services/experienceService';
import { CATEGORIES } from '../data/seedExperiences';

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Filter states
  const [activeFilters, setActiveFilters] = useState({
    city: searchParams.get('city') || '',
    category: searchParams.get('category') || '',
    q: searchParams.get('q') || '',
    sort: searchParams.get('sort') || 'recommended',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    filter: searchParams.get('filter') || '' // e.g., 'hidden-gems'
  });

  useEffect(() => {
    fetchData();
  }, [searchParams]);

  const fetchData = async () => {
    setLoading(true);
    const filters = Object.fromEntries(searchParams.entries());
    let data = await experienceService.fetchExperiences(filters);
    
    // Client-side sort
    const sort = searchParams.get('sort') || 'recommended';
    if (sort === 'trending') data.sort((a,b) => (b.trendingScore || 0) - (a.trendingScore || 0));
    else if (sort === 'rating') data.sort((a,b) => b.rating - a.rating);
    else if (sort === 'price-low') data.sort((a,b) => a.price - b.price);
    else if (sort === 'price-high') data.sort((a,b) => b.price - a.price);

    // Client-side extra filters
    const filterType = searchParams.get('filter');
    if (filterType === 'hidden-gems') data = data.filter(d => d.isHiddenGem);
    if (filterType === 'featured') data = data.filter(d => d.isFeatured);
    if (searchParams.get('minPrice')) data = data.filter(d => d.price >= Number(searchParams.get('minPrice')));
    if (searchParams.get('maxPrice')) data = data.filter(d => d.price <= Number(searchParams.get('maxPrice')));

    setExperiences(data);
    setLoading(false);
  };

  const updateFilters = (key, value) => {
    const newFilters = { ...activeFilters, [key]: value };
    setActiveFilters(newFilters);
    
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setActiveFilters({ city:'', category:'', q:'', sort:'recommended', minPrice:'', maxPrice:'', filter:'' });
    setSearchParams(new URLSearchParams());
  };

  const removeFilter = (key) => updateFilters(key, '');

  return (
    <div className="bg-gray-50 min-h-screen pt-20 pb-12">
      <div className="container-custom">
        {/* Header / Search Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search experiences..." 
              value={activeFilters.q}
              onChange={(e) => updateFilters('q', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="relative w-full md:w-64">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Where to?" 
              value={activeFilters.city}
              onChange={(e) => updateFilters('city', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button 
            className="w-full md:w-auto md:hidden btn-secondary py-2.5 justify-center"
            onClick={() => setShowFiltersMobile(true)}
          >
            <Filter size={18} /> Filters
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Desktop */}
          <aside className={`fixed inset-0 z-50 bg-white p-6 lg:p-0 lg:relative lg:block lg:w-64 lg:bg-transparent lg:z-auto shrink-0 transition-transform ${showFiltersMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            <div className="flex items-center justify-between lg:hidden mb-6">
              <h2 className="text-xl font-bold">Filters</h2>
              <button onClick={() => setShowFiltersMobile(false)} className="p-2"><X size={24} /></button>
            </div>

            <div className="bg-white lg:rounded-2xl lg:shadow-sm lg:p-5 space-y-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center justify-between">
                  Categories
                  {activeFilters.category && <button onClick={()=>removeFilter('category')} className="text-xs text-primary-600">Clear</button>}
                </h3>
                <div className="space-y-2">
                  {CATEGORIES.map(c => (
                    <label key={c.id} className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="category"
                        checked={activeFilters.category === c.name}
                        onChange={() => updateFilters('category', c.name)}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">{c.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5">
                <h3 className="font-semibold mb-3">Price Range</h3>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    placeholder="Min ₹" 
                    value={activeFilters.minPrice}
                    onChange={(e) => updateFilters('minPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                  <span>-</span>
                  <input 
                    type="number" 
                    placeholder="Max ₹" 
                    value={activeFilters.maxPrice}
                    onChange={(e) => updateFilters('maxPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5">
                <h3 className="font-semibold mb-3">Special Filters</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="filter"
                      checked={activeFilters.filter === 'hidden-gems'}
                      onChange={() => updateFilters('filter', 'hidden-gems')}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Hidden Gems</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="filter"
                      checked={activeFilters.filter === 'featured'}
                      onChange={() => updateFilters('filter', 'featured')}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">Featured</span>
                  </label>
                </div>
              </div>
              
              <button onClick={clearFilters} className="w-full py-2 text-sm text-gray-500 hover:text-gray-900 font-medium">
                Clear all filters
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {activeFilters.city ? `Experiences in ${activeFilters.city}` : 'Explore India'}
                </h1>
                <p className="text-sm text-gray-500 mt-1">{experiences.length} results found</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select 
                  value={activeFilters.sort}
                  onChange={(e) => updateFilters('sort', e.target.value)}
                  className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="recommended">Recommended</option>
                  <option value="trending">Trending First</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Active Filters Chips */}
            <div className="flex flex-wrap gap-2 mb-6">
              {Object.entries(activeFilters).map(([key, value]) => {
                if (!value || key === 'sort') return null;
                return (
                  <Badge key={key} variant="default" className="flex items-center gap-1 pl-3 pr-1 py-1">
                    <span className="capitalize">{key}: {value}</span>
                    <button onClick={() => removeFilter(key)} className="p-0.5 hover:bg-gray-200 rounded-full ml-1">
                      <X size={12} />
                    </button>
                  </Badge>
                );
              })}
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map(n => <ExperienceCardSkeleton key={n} />)}
              </div>
            ) : experiences.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {experiences.map(exp => (
                  <ExperienceCard key={exp.id} experience={exp} />
                ))}
              </div>
            ) : (
              <EmptyState 
                variant="noResults" 
                action={<button onClick={clearFilters} className="btn-secondary">Clear Filters</button>} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
