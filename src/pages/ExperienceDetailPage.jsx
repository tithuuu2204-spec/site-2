import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  MapPin, Star, Share2, Heart, Clock, Calendar, Check, AlertCircle, 
  ChevronRight, Users, IndianRupee, Sparkles, ShieldCheck
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

import { experienceService } from '../services/experienceService';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import TrustBadge from '../components/host/TrustBadge';
import StarRating from '../components/ui/StarRating';
import Badge from '../components/ui/Badge';
import { DetailPageSkeleton } from '../components/ui/Skeleton';
import ExperienceCard from '../components/experiences/ExperienceCard';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MOCK_REVIEWS = [
  {id:1, name:'Priya Sharma', city:'Mumbai', rating:5, date:'2026-09-10', comment:'Absolutely magical experience! The host was incredibly knowledgeable and the whole thing was perfectly organized.', avatar:'https://ui-avatars.com/api/?name=Priya+Sharma&background=f97316&color=fff'},
  {id:2, name:'Arjun Mehta', city:'Bengaluru', rating:5, date:'2026-09-08', comment:'One of the best local experiences I have ever had. 100% authentic and the host is verified and trustworthy.', avatar:'https://ui-avatars.com/api/?name=Arjun+Mehta&background=0d9488&color=fff'},
  {id:3, name:'Kavitha Reddy', city:'Hyderabad', rating:4, date:'2026-09-05', comment:'Really enjoyed it. Would have liked a bit more time but overall fantastic value.', avatar:'https://ui-avatars.com/api/?name=Kavitha+Reddy&background=7c3aed&color=fff'},
];

export default function ExperienceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFavorite, addFavorite, removeFavorite } = useApp();
  
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [travelers, setTravelers] = useState(1);
  const [similar, setSimilar] = useState([]);

  useEffect(() => {
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    const data = await experienceService.fetchExperienceById(id);
    if (data) {
      setExperience(data);
      experienceService.incrementView(id);
      
      // Fetch similar
      const all = await experienceService.fetchExperiences({ city: data.city });
      setSimilar(all.filter(e => e.id !== id).slice(0, 3));
    }
    setLoading(false);
  };

  if (loading) return <DetailPageSkeleton />;
  if (!experience) return <div className="text-center py-20 text-2xl font-bold">Experience not found</div>;

  const allImages = experience.images?.length > 0 ? experience.images : [experience.coverImage];
  const fav = isFavorite(id);
  const totalPrice = experience.price * travelers;

  const handleBook = () => {
    navigate(`/booking/${id}`, { state: { travelers, totalPrice, experience } });
  };

  return (
    <div className="bg-white min-h-screen pb-20 md:pb-12">
      {/* Breadcrumb Header */}
      <div className="border-b border-gray-100 mt-16 bg-white">
        <div className="container-custom py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-primary-600">Home</Link>
            <ChevronRight size={14} />
            <Link to={`/explore?category=${experience.category}`} className="hover:text-primary-600">{experience.category}</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 truncate max-w-[200px]">{experience.title}</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 text-sm font-medium hover:text-primary-600">
              <Share2 size={16} /> Share
            </button>
            <button 
              onClick={() => user ? (fav ? removeFavorite(id) : addFavorite(id)) : navigate('/login')}
              className={`flex items-center gap-1.5 text-sm font-medium ${fav ? 'text-red-500' : 'hover:text-red-500'}`}
            >
              <Heart size={16} className={fav ? 'fill-red-500' : ''} /> {fav ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      <div className="container-custom py-6">
        {/* Title Section */}
        <div className="mb-6">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-3">{experience.title}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
            <StarRating rating={experience.rating} reviewCount={experience.reviewCount} />
            <span className="flex items-center gap-1"><MapPin size={14} /> {experience.location}</span>
            <span className="flex items-center gap-1"><Badge>{experience.category}</Badge></span>
            {experience.isFeatured && <Badge variant="warning">Featured</Badge>}
            {experience.isHiddenGem && <Badge variant="purple">Hidden Gem</Badge>}
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 h-[50vh] md:h-[60vh] max-h-[500px]">
          <div className="md:col-span-3 h-full rounded-2xl overflow-hidden cursor-pointer relative group">
            <img src={allImages[activeImage]} alt={experience.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
          </div>
          <div className="hidden md:flex flex-col gap-4 h-full">
            {allImages.slice(0, 3).map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveImage(idx)}
                className={`flex-1 rounded-2xl overflow-hidden relative ${activeImage === idx ? 'ring-2 ring-primary-500 ring-offset-2' : 'opacity-70 hover:opacity-100'} transition-all`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column (2/3) */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Host overview */}
            <div className="flex items-center justify-between pb-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold mb-1">Hosted by {experience.hostName}</h2>
                <p className="text-gray-500 text-sm">Member since 2024</p>
              </div>
              <img src={experience.hostAvatar} alt={experience.hostName} className="w-14 h-14 rounded-full border-2 border-white shadow-md" />
            </div>

            {/* Description */}
            <section>
              <h3 className="text-xl font-bold mb-4">About this experience</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{experience.description}</p>
            </section>

            {/* What's Included */}
            <section>
              <h3 className="text-xl font-bold mb-4">What's included</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {experience.included?.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-gray-700">
                    <Check size={18} className="text-green-500 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              {experience.notIncluded?.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-3 text-gray-900">Not included</h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {experience.notIncluded.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-gray-500">
                        <X size={18} className="text-gray-400 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Info Cards */}
            <section className="grid sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <div className="flex items-center gap-3 mb-3 text-primary-600">
                  <Clock size={20} />
                  <h4 className="font-semibold">Duration & Time</h4>
                </div>
                <p className="text-sm text-gray-700">Takes {experience.duration}</p>
                <p className="text-sm text-gray-700 mt-1">Starts at {experience.startTime}</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <div className="flex items-center gap-3 mb-3 text-primary-600">
                  <Calendar size={20} />
                  <h4 className="font-semibold">Cancellation Policy</h4>
                </div>
                <p className="text-sm text-gray-700">{experience.cancellationPolicy}</p>
              </div>
            </section>

            {/* Location / Map */}
            <section>
              <h3 className="text-xl font-bold mb-4">Where we'll meet</h3>
              <p className="text-gray-600 mb-4">{experience.location}</p>
              <div className="h-64 rounded-2xl overflow-hidden shadow-inner border border-gray-200 z-0">
                <MapContainer center={[experience.lat, experience.lng]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
                  <Marker position={[experience.lat, experience.lng]}>
                    <Popup>{experience.title}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </section>

            {/* Host Trust Badge */}
            <section>
              <h3 className="text-xl font-bold mb-4">Host Verification</h3>
              <TrustBadge host={{
                hostName: experience.hostName,
                identityVerified: experience.hostVerified,
                gstVerified: true,
                completedEvents: experience.bookingCount,
                trustScore: 95
              }} />
            </section>

            {/* Reviews */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <h3 className="text-xl font-bold">Reviews</h3>
                <StarRating rating={experience.rating} reviewCount={experience.reviewCount} size="md" />
              </div>
              <div className="space-y-6">
                {MOCK_REVIEWS.map(rev => (
                  <div key={rev.id} className="pb-6 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3 mb-3">
                      <img src={rev.avatar} alt={rev.name} className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="font-semibold text-sm">{rev.name}</p>
                        <p className="text-xs text-gray-500">{rev.date}</p>
                      </div>
                    </div>
                    <StarRating rating={rev.rating} showValue={false} />
                    <p className="text-gray-700 text-sm mt-2">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column (1/3) - Sticky Booking Card */}
          <div className="relative">
            <div className="sticky top-24 bg-white border border-gray-200 rounded-3xl p-6 shadow-xl hidden md:block">
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-2xl font-bold text-gray-900 flex items-center">
                  <IndianRupee size={20} className="mt-1" />{experience.price}
                </span>
                <span className="text-gray-500">/ person</span>
              </div>

              {experience.spotsRemaining <= 5 && (
                <div className="bg-orange-50 text-orange-700 text-sm p-3 rounded-xl flex items-center gap-2 mb-4 border border-orange-100">
                  <AlertCircle size={16} />
                  <strong>Rare find!</strong> Only {experience.spotsRemaining} spots left.
                </div>
              )}

              <div className="border border-gray-300 rounded-xl mb-4 overflow-hidden divide-y divide-gray-300">
                <div className="p-3">
                  <label className="block text-xs font-bold text-gray-900 uppercase">Date</label>
                  <div className="text-sm text-gray-700">{new Date(experience.date).toLocaleDateString('en-IN', { weekday:'short', month:'short', day:'numeric'})}</div>
                </div>
                <div className="p-3">
                  <label className="block text-xs font-bold text-gray-900 uppercase">Travelers</label>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm">{travelers} {travelers === 1 ? 'Guest' : 'Guests'}</span>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setTravelers(Math.max(1, travelers - 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >-</button>
                      <span className="w-4 text-center text-sm font-semibold">{travelers}</span>
                      <button 
                        onClick={() => setTravelers(Math.min(experience.spotsRemaining, travelers + 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >+</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between py-2 text-gray-600 mb-4">
                <span className="underline">₹{experience.price} x {travelers}</span>
                <span>₹{totalPrice}</span>
              </div>

              <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-4 mb-6">
                <span>Total</span>
                <span>₹{totalPrice}</span>
              </div>

              <button onClick={handleBook} className="btn-primary w-full justify-center py-4 text-lg mb-4">
                Book Now
              </button>

              <button 
                onClick={() => navigate(`/ai-planner?experienceId=${id}`)}
                className="w-full btn-secondary bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 justify-center gap-2"
              >
                <Sparkles size={16} /> Build AI Trip Around This
              </button>

              <p className="text-center text-gray-500 text-xs mt-4">You won't be charged yet.</p>
            </div>
          </div>
        </div>

        {/* Similar Experiences */}
        {similar.length > 0 && (
          <section className="mt-16 border-t border-gray-100 pt-12">
            <h2 className="text-2xl font-bold mb-6">More to explore in {experience.city}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {similar.map(exp => <ExperienceCard key={exp.id} experience={exp} />)}
            </div>
          </section>
        )}
      </div>

      {/* Mobile Sticky Booking Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-40 flex items-center justify-between">
        <div>
          <span className="font-bold text-lg">₹{experience.price}</span>
          <span className="text-gray-500 text-sm"> / person</span>
          <p className="text-xs text-primary-600 font-medium">{new Date(experience.date).toLocaleDateString()}</p>
        </div>
        <button onClick={handleBook} className="btn-primary py-3 px-8">
          Book
        </button>
      </div>
    </div>
  );
}
