import React, { useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { MapPin, Calendar, Users, IndianRupee, Plane, Building2, Utensils, Camera, Car, Star, Check, ArrowRight, Save, Share2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export default function TripResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const tripData = location.state?.tripData;
  const formData = location.state?.formData;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!tripData) return <Navigate to="/ai-planner" replace />;

  const getIcon = (type) => {
    switch(type) {
      case 'Flight': case 'Plane': return <Plane size={18} />;
      case 'Hotel': case 'Building': return <Building2 size={18} />;
      case 'Food': return <Utensils size={18} />;
      case 'Attraction': return <Camera size={18} />;
      case 'Transport': return <Car size={18} />;
      case 'Experience': return <Star size={18} className="text-orange-500 fill-orange-500" />;
      default: return <Check size={18} />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-20 pb-20">
      <div className="bg-gray-900 text-white pb-16 pt-8">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 text-xs font-semibold mb-4">
                <Sparkles size={12} className="text-saffron-300" /> AI Generated Itinerary
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{tripData.tripTitle}</h1>
              <p className="text-gray-400 max-w-2xl text-lg">{tripData.summary}</p>
            </div>
            
            <div className="flex gap-3 shrink-0">
              <button className="btn-secondary border-white/30 text-white hover:bg-white/10">
                <Share2 size={18} /> Share
              </button>
              <button className="btn-secondary border-white/30 text-white hover:bg-white/10">
                <Save size={18} /> Save
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            <div className="bg-white/10 p-4 rounded-xl border border-white/10">
              <div className="text-gray-400 text-xs uppercase mb-1">Route</div>
              <div className="font-semibold flex items-center gap-2"><MapPin size={14}/> {tripData.fromCity} → {tripData.toCity}</div>
            </div>
            <div className="bg-white/10 p-4 rounded-xl border border-white/10">
              <div className="text-gray-400 text-xs uppercase mb-1">Duration</div>
              <div className="font-semibold flex items-center gap-2"><Calendar size={14}/> {tripData.days.length} Days</div>
            </div>
            <div className="bg-white/10 p-4 rounded-xl border border-white/10">
              <div className="text-gray-400 text-xs uppercase mb-1">Travelers</div>
              <div className="font-semibold flex items-center gap-2"><Users size={14}/> {formData?.travelers || 2} People</div>
            </div>
            <div className="bg-white/10 p-4 rounded-xl border border-primary-500/50 bg-primary-900/50">
              <div className="text-primary-300 text-xs uppercase mb-1">Est. Total Cost</div>
              <div className="font-bold text-xl flex items-center gap-1"><IndianRupee size={18}/>{tripData.totalEstimatedCost.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom -mt-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Itinerary */}
          <div className="lg:col-span-2 space-y-8">
            {tripData.days.map((day, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{day.day} • {new Date(day.date).toLocaleDateString('en-IN', {weekday:'short', month:'short', day:'numeric'})}</h3>
                    <p className="text-sm text-gray-500">{day.title}</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="relative border-l-2 border-gray-100 ml-4 space-y-8 pb-4">
                    {day.activities.map((act, i) => (
                      <div key={i} className={`relative pl-8 ${act.highlight ? 'bg-orange-50 -ml-4 pl-12 p-4 rounded-xl border border-orange-100' : ''}`}>
                        <div className={`absolute top-0 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm ${act.highlight ? '-left-4 bg-orange-500 ring-4 ring-orange-50' : '-left-[17px] bg-gray-800 ring-4 ring-white'}`}>
                          {getIcon(act.type)}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-bold text-gray-900">{act.time}</span>
                              {act.highlight && <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">Highlight Experience</span>}
                            </div>
                            <h4 className="font-semibold text-lg text-gray-900">{act.title}</h4>
                            <p className="text-gray-600 text-sm mt-1 mb-2">{act.description}</p>
                            
                            <div className="flex flex-wrap gap-3 mt-2">
                              {act.duration && (
                                <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                                  <Clock size={12} /> {act.duration}
                                </span>
                              )}
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700 bg-primary-50 px-2 py-1 rounded-md">
                                <IndianRupee size={12} /> {act.estimatedCost.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-4">Trip Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2"><Plane size={14}/> Transport</span>
                  <span className="font-medium">₹{tripData.costBreakdown.transport.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2"><Building2 size={14}/> Hotels</span>
                  <span className="font-medium">₹{tripData.costBreakdown.hotel.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2"><Camera size={14}/> Activities</span>
                  <span className="font-medium">₹{tripData.costBreakdown.activities.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2"><Utensils size={14}/> Food est.</span>
                  <span className="font-medium">₹{tripData.costBreakdown.food.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-lg text-primary-600">
                  <span>Total Estimate</span>
                  <span>₹{tripData.totalEstimatedCost.toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={() => navigate('/booking/mock-trip', { state: { isFullTrip: true, tripData } })}
                className="btn-primary w-full justify-center py-3"
              >
                Book Entire Trip <ArrowRight size={16} />
              </button>
              
              <p className="text-xs text-center text-gray-400 mt-3">
                Flights & Hotels will be booked via our partners. Experiences are booked directly with verified hosts.
              </p>
            </div>

            {/* Map Placeholder */}
            <div className="bg-gray-200 rounded-2xl h-64 w-full flex flex-col items-center justify-center text-gray-500 shadow-sm border border-gray-200 overflow-hidden relative">
              <MapPin size={32} className="mb-2 opacity-50" />
              <span className="text-sm font-medium">Interactive Map View</span>
              <span className="text-xs opacity-70">Requires GPS coords for all points</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sparkles icon workaround since I didn't import it at the top
const Sparkles = ({size=16, className=''}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
const Clock = ({size=16}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
