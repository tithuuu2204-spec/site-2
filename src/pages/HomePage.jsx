import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search, MapPin, Sparkles, ChevronRight, TrendingUp, Star,
  Gem, Users, Clock, ArrowRight, Shield, Globe, Zap,
  ChevronLeft, Calendar, IndianRupee, Play
} from 'lucide-react';
import ExperienceCard from '../components/experiences/ExperienceCard';
import { ExperienceCardSkeleton } from '../components/ui/Skeleton';
import { useAuth } from '../contexts/AuthContext';

// Inline seed data for immediate render (no API wait)
const HERO_BG = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920&auto=format&fit=crop&q=80';

const CATEGORIES = [
  { id: 'cultural', name: 'Cultural Events', emoji: '🎭', color: 'from-purple-500 to-purple-700', count: 42 },
  { id: 'heritage', name: 'Heritage Walks', emoji: '🏛️', color: 'from-amber-500 to-amber-700', count: 28 },
  { id: 'food', name: 'Food Experiences', emoji: '🍛', color: 'from-orange-500 to-red-600', count: 35 },
  { id: 'adventure', name: 'Adventure', emoji: '🏔️', color: 'from-teal-500 to-teal-700', count: 19 },
  { id: 'workshops', name: 'Workshops', emoji: '🎨', color: 'from-pink-500 to-pink-700', count: 24 },
  { id: 'nature', name: 'Nature & Wildlife', emoji: '🌿', color: 'from-green-500 to-green-700', count: 16 },
  { id: 'festivals', name: 'Festivals', emoji: '🎉', color: 'from-yellow-500 to-orange-500', count: 12 },
  { id: 'photography', name: 'Photography Tours', emoji: '📸', color: 'from-blue-500 to-blue-700', count: 8 },
];

const DESTINATIONS = [
  { city: 'Jaipur', state: 'Rajasthan', emoji: '🏰', count: 24, image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&auto=format&fit=crop' },
  { city: 'Varanasi', state: 'Uttar Pradesh', emoji: '🕌', count: 18, image: 'https://images.unsplash.com/photo-1561361058-c24e01b7a7f9?w=400&auto=format&fit=crop' },
  { city: 'Udaipur', state: 'Rajasthan', emoji: '🛶', count: 15, image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=400&auto=format&fit=crop' },
  { city: 'Ahmedabad', state: 'Gujarat', emoji: '🏛️', count: 21, image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&auto=format&fit=crop' },
  { city: 'Goa', state: 'Goa', emoji: '🌊', count: 19, image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&auto=format&fit=crop' },
  { city: 'Rishikesh', state: 'Uttarakhand', emoji: '🧘', count: 14, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&auto=format&fit=crop' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma', city: 'Mumbai', avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=f97316&color=fff', text: 'ExploreHub planned my entire Rajasthan trip in minutes! The AI itinerary was incredibly well-organized. Highly recommend!', rating: 5 },
  { name: 'Arjun Mehta', city: 'Bengaluru', avatar: 'https://ui-avatars.com/api/?name=Arjun+Mehta&background=0d9488&color=fff', text: 'Found an amazing Garba experience in Ahmedabad through ExploreHub. The host was verified and everything was seamless.', rating: 5 },
  { name: 'Kavitha Reddy', city: 'Hyderabad', avatar: 'https://ui-avatars.com/api/?name=Kavitha+Reddy&background=7c3aed&color=fff', text: 'The Varanasi Ganga Aarti experience was magical. Loved how ExploreHub built the whole trip around it.', rating: 5 },
];

const WHY_US = [
  { icon: Shield, title: 'Verified Hosts', desc: 'Every host undergoes identity and GST verification before listing.', color: 'text-teal-600 bg-teal-50' },
  { icon: Sparkles, title: 'AI Trip Planner', desc: 'Our AI builds complete journeys — flights, hotels, food — around your chosen experience.', color: 'text-purple-600 bg-purple-50' },
  { icon: Globe, title: '15+ Indian Cities', desc: 'From Ahmedabad to Shillong — authentic local experiences across India.', color: 'text-blue-600 bg-blue-50' },
  { icon: Zap, title: 'One-Click Booking', desc: 'Discover → Plan → Book in under 3 minutes. No more endless tab switching.', color: 'text-orange-600 bg-orange-50' },
];

// Hardcoded trending experiences for instant render
const TRENDING_MOCK = [
  {
    id: 'exp-garba-001',
    title: 'Traditional Garba Night',
    category: 'Cultural Events',
    city: 'Ahmedabad',
    location: 'Ahmedabad, Gujarat',
    price: 500,
    rating: 4.8,
    reviewCount: 124,
    bookingCount: 287,
    spotsRemaining: 18,
    capacity: 100,
    date: '2026-10-20',
    duration: '3 hrs',
    coverImage: 'https://images.unsplash.com/photo-1574052329388-12c5b4e72401?w=600&auto=format&fit=crop',
    images: [],
    hostName: 'Meera Patel',
    hostVerified: true,
    isTrending: true,
    isHiddenGem: false,
    isFeatured: true,
    tags: ['garba', 'navratri', 'culture'],
  },
  {
    id: 'exp-heritage-001',
    title: 'Old City Heritage Walk',
    category: 'Heritage Walks',
    city: 'Ahmedabad',
    location: 'Ahmedabad, Gujarat',
    price: 350,
    rating: 4.7,
    reviewCount: 89,
    bookingCount: 156,
    spotsRemaining: 12,
    capacity: 20,
    date: '2026-10-15',
    duration: '2.5 hrs',
    coverImage: 'https://images.unsplash.com/photo-1524230572899-a752b3835840?w=600&auto=format&fit=crop',
    images: [],
    hostName: 'Rajan Desai',
    hostVerified: true,
    isTrending: false,
    isHiddenGem: false,
    isFeatured: true,
    tags: ['heritage', 'history', 'walking'],
  },
  {
    id: 'exp-jaipur-001',
    title: 'Jaipur Block Printing Workshop',
    category: 'Workshops',
    city: 'Jaipur',
    location: 'Jaipur, Rajasthan',
    price: 800,
    rating: 4.9,
    reviewCount: 203,
    bookingCount: 412,
    spotsRemaining: 8,
    capacity: 15,
    date: '2026-10-18',
    duration: '4 hrs',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop',
    images: [],
    hostName: 'Anita Sharma',
    hostVerified: true,
    isTrending: true,
    isHiddenGem: false,
    isFeatured: false,
    tags: ['workshop', 'craft', 'rajasthan'],
  },
  {
    id: 'exp-varanasi-001',
    title: 'Ganga Aarti Boat Experience',
    category: 'Cultural Events',
    city: 'Varanasi',
    location: 'Varanasi, Uttar Pradesh',
    price: 650,
    rating: 4.9,
    reviewCount: 341,
    bookingCount: 689,
    spotsRemaining: 5,
    capacity: 12,
    date: '2026-10-22',
    duration: '2 hrs',
    coverImage: 'https://images.unsplash.com/photo-1561361058-c24e01b7a7f9?w=600&auto=format&fit=crop',
    images: [],
    hostName: 'Pandit Ramesh',
    hostVerified: true,
    isTrending: true,
    isHiddenGem: false,
    isFeatured: true,
    tags: ['aarti', 'spiritual', 'varanasi'],
  },
  {
    id: 'exp-goa-001',
    title: 'Goa Konkani Food Trail',
    category: 'Food Experiences',
    city: 'Goa',
    location: 'Panaji, Goa',
    price: 1200,
    rating: 4.6,
    reviewCount: 78,
    bookingCount: 134,
    spotsRemaining: 10,
    capacity: 12,
    date: '2026-10-25',
    duration: '3.5 hrs',
    coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop',
    images: [],
    hostName: 'Carlos Fernandes',
    hostVerified: true,
    isTrending: false,
    isHiddenGem: true,
    isFeatured: false,
    tags: ['food', 'goa', 'konkani'],
  },
  {
    id: 'exp-amritsar-001',
    title: 'Golden Temple Sunrise Walk',
    category: 'Heritage Walks',
    city: 'Amritsar',
    location: 'Amritsar, Punjab',
    price: 400,
    rating: 4.9,
    reviewCount: 512,
    bookingCount: 1034,
    spotsRemaining: 20,
    capacity: 25,
    date: '2026-10-19',
    duration: '2 hrs',
    coverImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&auto=format&fit=crop',
    images: [],
    hostName: 'Gurpreet Singh',
    hostVerified: true,
    isTrending: true,
    isHiddenGem: false,
    isFeatured: true,
    tags: ['golden temple', 'spiritual', 'history'],
  },
];

const HIDDEN_GEMS_MOCK = [
  {
    id: 'exp-hidden-001',
    title: 'Secret Stepwell Photography Tour',
    category: 'Photography Tours',
    city: 'Ahmedabad',
    location: 'Ahmedabad, Gujarat',
    price: 600,
    rating: 4.8,
    reviewCount: 23,
    bookingCount: 45,
    spotsRemaining: 6,
    capacity: 8,
    date: '2026-10-21',
    duration: '3 hrs',
    coverImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&auto=format&fit=crop',
    images: [],
    hostName: 'Dhruv Shah',
    hostVerified: true,
    isHiddenGem: true,
    isTrending: false,
    isFeatured: false,
    tags: ['photography', 'hidden', 'stepwell'],
  },
  {
    id: 'exp-hidden-002',
    title: 'Village Farm Stay & Cooking',
    category: 'Food Experiences',
    city: 'Udaipur',
    location: 'Near Udaipur, Rajasthan',
    price: 1500,
    rating: 4.7,
    reviewCount: 31,
    bookingCount: 62,
    spotsRemaining: 4,
    capacity: 6,
    date: '2026-10-23',
    duration: '8 hrs',
    coverImage: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=600&auto=format&fit=crop',
    images: [],
    hostName: 'Vikram Singh',
    hostVerified: true,
    isHiddenGem: true,
    isTrending: false,
    isFeatured: false,
    tags: ['farm', 'rural', 'cooking'],
  },
  {
    id: 'exp-hidden-003',
    title: 'Silk Weaving Workshop in Mysuru',
    category: 'Workshops',
    city: 'Mysuru',
    location: 'Mysuru, Karnataka',
    price: 900,
    rating: 4.8,
    reviewCount: 19,
    bookingCount: 38,
    spotsRemaining: 5,
    capacity: 6,
    date: '2026-10-24',
    duration: '4 hrs',
    coverImage: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=600&auto=format&fit=crop',
    images: [],
    hostName: 'Lakshmi Devi',
    hostVerified: true,
    isHiddenGem: true,
    isTrending: false,
    isFeatured: false,
    tags: ['silk', 'weaving', 'craft'],
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { user, loginWithGoogle } = useAuth();
  const [searchWhere, setSearchWhere] = useState('');
  const [searchWhat, setSearchWhat] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [searchTravelers, setSearchTravelers] = useState(2);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((c) => (c + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchWhere) params.set('city', searchWhere);
    if (searchWhat) params.set('q', searchWhat);
    if (searchDate) params.set('date', searchDate);
    if (searchTravelers) params.set('travelers', searchTravelers);
    navigate(`/explore?${params.toString()}`);
  };

  const handleAIPlanner = () => {
    navigate('/ai-planner');
  };

  return (
    <div className="min-h-screen">
      {/* ============ HERO ============ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={HERO_BG}
            alt="India tourism"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 hero-overlay" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container-custom text-center text-white pt-20 pb-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6 animate-fade-in">
            <Sparkles size={14} className="text-saffron-300" />
            <span>AI-Powered Smart Tourism Platform</span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6 animate-slide-up">
            Discover India<br />
            <span className="text-saffron-300">Like Never Before</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Authentic local experiences. AI-powered journeys.<br />One seamless trip.
          </p>

          {/* Search Box */}
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-2xl shadow-2xl p-3 max-w-4xl mx-auto animate-slide-up"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              {/* Where */}
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Where to go?"
                  value={searchWhere}
                  onChange={(e) => setSearchWhere(e.target.value)}
                  className="w-full pl-9 pr-3 py-3 text-gray-900 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              {/* What */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="What experience?"
                  value={searchWhat}
                  onChange={(e) => setSearchWhat(e.target.value)}
                  className="w-full pl-9 pr-3 py-3 text-gray-900 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              {/* Date */}
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-9 pr-3 py-3 text-gray-700 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              {/* Search Button */}
              <button type="submit" className="btn-primary justify-center w-full py-3">
                <Search size={16} /> Explore India
              </button>
            </div>
            {/* AI Planner CTA */}
            <div className="flex items-center justify-center mt-2 gap-2">
              <span className="text-gray-400 text-xs">or</span>
              <button
                type="button"
                onClick={handleAIPlanner}
                className="flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              >
                <Sparkles size={14} /> Let AI plan my complete trip
                <ArrowRight size={12} />
              </button>
            </div>
          </form>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-12 text-white/80">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">500+</p>
              <p className="text-sm">Experiences</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-3xl font-bold text-white">15+</p>
              <p className="text-sm">Cities</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-3xl font-bold text-white">10K+</p>
              <p className="text-sm">Happy Travelers</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-3xl font-bold text-white">4.8★</p>
              <p className="text-sm">Average Rating</p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* ============ TRENDING EXPERIENCES ============ */}
      <section className="page-section bg-gray-50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title flex items-center gap-2">
                <TrendingUp className="text-primary-600" size={28} />
                Trending Experiences
              </h2>
              <p className="section-subtitle">Most booked right now across India</p>
            </div>
            <Link to="/explore?sort=trending" className="btn-secondary text-sm py-2 px-4 hidden md:flex">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TRENDING_MOCK.slice(0, 6).map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
          <div className="text-center mt-8 md:hidden">
            <Link to="/explore?sort=trending" className="btn-secondary">View All Trending <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* ============ EXPLORE BY CATEGORY ============ */}
      <section className="page-section">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="section-title">Explore by Category</h2>
            <p className="section-subtitle">Find experiences that match your passion</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/explore?category=${encodeURIComponent(cat.name)}`}
                className="group relative rounded-2xl overflow-hidden cursor-pointer"
              >
                <div className={`bg-gradient-to-br ${cat.color} p-6 text-white h-full min-h-[120px] flex flex-col justify-between transition-transform duration-300 group-hover:scale-105`}>
                  <span className="text-3xl">{cat.emoji}</span>
                  <div>
                    <p className="font-semibold text-sm">{cat.name}</p>
                    <p className="text-white/70 text-xs">{cat.count} experiences</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ POPULAR DESTINATIONS ============ */}
      <section className="page-section bg-gray-50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">Popular Destinations</h2>
              <p className="section-subtitle">India's most beloved travel destinations</p>
            </div>
            <Link to="/destinations" className="btn-ghost text-sm hidden md:flex">
              All Destinations <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {DESTINATIONS.map((dest) => (
              <Link
                key={dest.city}
                to={`/explore?city=${dest.city}`}
                className="group relative rounded-2xl overflow-hidden h-48 cursor-pointer"
              >
                <img
                  src={dest.image}
                  alt={dest.city}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <p className="font-display font-bold text-lg">{dest.emoji} {dest.city}</p>
                  <p className="text-white/70 text-xs">{dest.state} • {dest.count} experiences</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ AI TRIP PLANNER PROMO ============ */}
      <section className="page-section bg-gradient-to-br from-primary-600 via-primary-700 to-saffron-600 text-white overflow-hidden relative">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="container-custom relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
                <Sparkles size={14} className="text-saffron-200" />
                AI-Powered Trip Planning
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
                Let AI Build Your<br />Perfect Journey
              </h2>
              <p className="text-white/80 text-lg mb-8 leading-relaxed">
                Pick any experience. Our AI instantly creates a complete trip — flights, hotels, restaurants, attractions — all optimized for your budget, schedule, and interests.
              </p>
              <div className="flex flex-wrap gap-4">
                <button onClick={handleAIPlanner} className="bg-white text-primary-600 font-bold px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-lg">
                  <Sparkles size={18} /> Plan My Trip Free
                </button>
                <button className="border-2 border-white/40 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-2">
                  <Play size={16} /> Watch Demo
                </button>
              </div>
            </div>

            {/* Mock itinerary preview card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
              <p className="font-semibold mb-4 flex items-center gap-2">
                <Sparkles size={16} className="text-saffron-300" />
                AI Generated: 3-Day Jaipur Trip
              </p>
              <div className="space-y-3">
                {[
                  { day: 'Day 1', icon: '✈️', title: 'Ahmedabad → Jaipur', sub: 'IndiGo 6E-214 · Hotel Check-in · Hawa Mahal sunset' },
                  { day: 'Day 2', icon: '🏰', title: 'Rajput Heritage + Block Printing', sub: 'Amber Fort · Workshop 2PM · Local dinner at Laxmi Misthan' },
                  { day: 'Day 3', icon: '🛍️', title: 'Bazaars + Return', sub: 'Johri Bazaar shopping · IndiGo 6E-217 back to Ahmedabad' },
                ].map((item) => (
                  <div key={item.day} className="flex gap-3 p-3 bg-white/10 rounded-xl">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-sm shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs text-white/60">{item.day}</p>
                      <p className="font-semibold text-sm">{item.title}</p>
                      <p className="text-xs text-white/70">{item.sub}</p>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-2 border-t border-white/20">
                  <span className="text-sm text-white/70">Total Estimated Cost</span>
                  <span className="font-bold text-lg flex items-center gap-1">
                    <IndianRupee size={16} />12,400
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ HIDDEN GEMS ============ */}
      <section className="page-section">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title flex items-center gap-2">
                <Gem className="text-purple-500" size={24} />
                Hidden Gems
              </h2>
              <p className="section-subtitle">Less crowded, equally magical local experiences</p>
            </div>
            <Link to="/explore?filter=hidden-gems" className="btn-ghost text-sm hidden md:flex">
              Discover All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {HIDDEN_GEMS_MOCK.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHY CHOOSE US ============ */}
      <section className="page-section bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title">Why ExploreHub?</h2>
            <p className="section-subtitle max-w-xl mx-auto">
              We're building the smartest way to experience India — connecting travelers with authentic local hosts, powered by AI.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_US.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mx-auto mb-4`}>
                  <Icon size={24} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="page-section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="section-title">Traveler Stories</h2>
            <p className="section-subtitle">What our explorers say about ExploreHub</p>
          </div>
          <div className="relative max-w-2xl mx-auto">
            <div className="card p-8 text-center">
              <div className="flex justify-center mb-4">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} size={20} className="fill-saffron-400 text-saffron-400" />
                ))}
              </div>
              <p className="text-gray-600 text-lg italic mb-6">
                "{TESTIMONIALS[currentTestimonial].text}"
              </p>
              <img
                src={TESTIMONIALS[currentTestimonial].avatar}
                alt={TESTIMONIALS[currentTestimonial].name}
                className="w-14 h-14 rounded-full mx-auto mb-2 ring-4 ring-primary-100"
              />
              <p className="font-bold text-gray-900">{TESTIMONIALS[currentTestimonial].name}</p>
              <p className="text-sm text-gray-500">{TESTIMONIALS[currentTestimonial].city}</p>
            </div>
            {/* Dots */}
            <div className="flex justify-center gap-2 mt-4">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentTestimonial(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === currentTestimonial ? 'bg-primary-600 w-6' : 'bg-gray-300'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ BECOME A HOST ============ */}
      <section className="page-section bg-gray-900 text-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-4xl font-bold mb-4">
                Share Your Passion.<br />
                <span className="text-saffron-400">Earn Doing What You Love.</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Host your unique local experience — from cooking classes to heritage walks. Join 2,000+ verified hosts earning on ExploreHub.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/host/create" className="btn-primary">
                  Become a Host <ArrowRight size={16} />
                </Link>
                <Link to="/host/dashboard" className="btn-secondary border-gray-600 text-gray-300 hover:bg-gray-800">
                  Host Dashboard
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Avg. Monthly Earnings', value: '₹18,000', icon: '💰' },
                { label: 'Active Hosts', value: '2,100+', icon: '👥' },
                { label: 'Avg. Rating', value: '4.8/5', icon: '⭐' },
                { label: 'Traveler Reach', value: '10K+', icon: '🌍' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center hover:bg-white/10 transition-colors">
                  <span className="text-3xl mb-2 block">{stat.icon}</span>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-gray-400 text-xs mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
