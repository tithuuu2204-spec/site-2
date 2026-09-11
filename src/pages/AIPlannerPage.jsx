import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles, MapPin, Calendar, Users, IndianRupee, Plane, Train, Car, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { aiService } from '../services/aiService';
import { experienceService } from '../services/experienceService';
import toast from 'react-hot-toast';

const INTERESTS = ['Culture & Heritage', 'Food & Culinary', 'Nature & Outdoors', 'Adventure', 'Shopping', 'Relaxation', 'Photography'];

export default function AIPlannerPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const expId = searchParams.get('experienceId');

  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [linkedExp, setLinkedExp] = useState(null);

  const [formData, setFormData] = useState({
    fromCity: '',
    destination: '',
    startDate: '',
    tripDays: 3,
    travelers: 2,
    budget: 'Standard',
    pace: 'Balanced',
    transportation: ['Flight'],
    interests: [],
    hotelPreference: 'Boutique'
  });

  useEffect(() => {
    if (expId) {
      experienceService.fetchExperienceById(expId).then(exp => {
        if (exp) {
          setLinkedExp(exp);
          setFormData(f => ({ ...f, destination: exp.city }));
        }
      });
    }
  }, [expId]);

  const toggleInterest = (i) => {
    setFormData(f => ({
      ...f, 
      interests: f.interests.includes(i) ? f.interests.filter(x => x !== i) : [...f.interests, i]
    }));
  };

  const toggleTransport = (t) => {
    setFormData(f => ({
      ...f, 
      transportation: f.transportation.includes(t) ? f.transportation.filter(x => x !== t) : [...f.transportation, t]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.destination) {
      toast.error("Please enter a destination city");
      return;
    }

    setLoading(true);
    
    // Simulate loading messages
    const msgs = ['Analyzing your preferences...', 'Finding best flights & routes...', 'Curating local experiences...', 'Building your perfect itinerary...'];
    let m = 0;
    setLoadingMessage(msgs[0]);
    const int = setInterval(() => {
      m++;
      if (m < msgs.length) setLoadingMessage(msgs[m]);
    }, 1000);

    try {
      const tripData = await aiService.generateTrip({
        ...formData,
        experienceId: expId
      });
      clearInterval(int);
      navigate('/trip-result', { state: { tripData, formData } });
    } catch (err) {
      clearInterval(int);
      toast.error('Failed to generate trip. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-20 pb-12">
      <div className="container-custom">
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <Sparkles size={16} /> AI Trip Wizard
          </div>
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-3">Plan Your Perfect Trip</h1>
          <p className="text-gray-600">Tell us how you travel. Our AI will instantly build a complete, bookable itinerary around your preferences.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          
          {/* Form Side */}
          <div className="lg:col-span-7 bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Linked Exp Note */}
              {linkedExp && (
                <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 flex gap-4 items-start">
                  <img src={linkedExp.coverImage} className="w-16 h-16 rounded-lg object-cover" alt="" />
                  <div>
                    <h4 className="font-semibold text-primary-900 text-sm">Building trip around:</h4>
                    <p className="font-bold text-gray-900">{linkedExp.title}</p>
                    <p className="text-xs text-primary-600">{linkedExp.city}</p>
                  </div>
                </div>
              )}

              {/* Route */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Leaving From</label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="e.g. Mumbai" value={formData.fromCity} onChange={e => setFormData({...formData, fromCity: e.target.value})} className="input pl-10" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Destination</label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" />
                    <input type="text" placeholder="e.g. Jaipur" value={formData.destination} onChange={e => setFormData({...formData, destination: e.target.value})} className="input pl-10" required />
                  </div>
                </div>
              </div>

              {/* Logistics */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Start Date</label>
                  <div className="relative">
                    <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} min={new Date().toISOString().split('T')[0]} className="input pl-10" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Trip Days</label>
                  <select value={formData.tripDays} onChange={e => setFormData({...formData, tripDays: e.target.value})} className="input">
                    {[1,2,3,4,5,6,7].map(n => <option key={n} value={n}>{n} Days</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Travelers</label>
                  <div className="relative">
                    <Users size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="number" min="1" max="10" value={formData.travelers} onChange={e => setFormData({...formData, travelers: e.target.value})} className="input pl-10" required />
                  </div>
                </div>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Budget Level</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Budget', 'Standard', 'Premium', 'Luxury'].map(b => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setFormData({...formData, budget: b})}
                      className={`py-3 px-2 rounded-xl text-sm font-semibold border-2 transition-all ${formData.budget === b ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-primary-200'}`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Main Interests (Select multiple)</label>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map(i => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggleInterest(i)}
                      className={`py-1.5 px-4 rounded-full text-sm font-medium border transition-all ${formData.interests.includes(i) ? 'bg-primary-600 text-white border-primary-600' : 'bg-white border-gray-300 text-gray-700 hover:border-primary-300'}`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-lg justify-center relative overflow-hidden group">
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <Loader2 size={20} className="animate-spin" />
                      {loadingMessage}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles size={20} /> Generate AI Itinerary <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                </button>
              </div>

            </form>
          </div>

          {/* Right Side Info */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white shadow-xl">
              <h3 className="text-2xl font-display font-bold mb-8">How it works</h3>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center shrink-0 font-bold">1</div>
                  <div>
                    <h4 className="font-semibold text-lg">Tell us your vibe</h4>
                    <p className="text-gray-400 text-sm mt-1">Select your destination, budget, and interests to help AI understand what you love.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center shrink-0 font-bold">2</div>
                  <div>
                    <h4 className="font-semibold text-lg">AI crunches the data</h4>
                    <p className="text-gray-400 text-sm mt-1">Our engine scans thousands of verified local experiences, flights, and hotels in seconds.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center shrink-0 font-bold">3</div>
                  <div>
                    <h4 className="font-semibold text-lg">Get a bookable trip</h4>
                    <p className="text-gray-400 text-sm mt-1">Receive a beautiful day-by-day itinerary with real-time pricing, ready to book in one click.</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 p-5 bg-white/10 rounded-2xl border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldCheck size={20} className="text-teal-400" />
                  <h4 className="font-semibold">Trust & Safety</h4>
                </div>
                <p className="text-sm text-gray-300">All experiences suggested by AI are hosted by ID-verified local experts. Your payments are held securely until the experience starts.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
