import React, { useState } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { ShieldCheck, IndianRupee, Loader2, ArrowLeft, Calendar, Users, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { bookingService } from '../services/bookingService';
import { paymentService } from '../services/paymentService';
import toast from 'react-hot-toast';

export default function BookingPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loginWithGoogle } = useAuth();
  
  const { travelers = 1, totalPrice = 0, experience = null, isFullTrip = false, tripData = null } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    specialReqs: ''
  });

  // Guard clause if user navigated here directly without state
  if (!isFullTrip && !experience) {
    return (
      <div className="min-h-screen pt-32 text-center container-custom">
        <h2 className="text-2xl font-bold mb-4">No booking details found</h2>
        <Link to="/explore" className="btn-primary">Browse Experiences</Link>
      </div>
    );
  }

  const baseTotal = isFullTrip ? tripData.totalEstimatedCost : totalPrice;
  const serviceFee = isFullTrip ? 500 : 50;
  const gst = baseTotal * 0.18;
  const finalTotal = baseTotal + serviceFee + gst;

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to complete booking');
      return;
    }
    if (!formData.phone) {
      toast.error('Please enter phone number');
      return;
    }

    setLoading(true);
    try {
      // 1. Mock Payment
      const order = paymentService.createOrder(finalTotal);
      await paymentService.initiatePayment(order.id, finalTotal, formData.name);

      // 2. Create Booking record
      let bkData;
      if (isFullTrip) {
        bkData = { type: 'full_trip', tripTitle: tripData.tripTitle, amount: finalTotal, travelers: tripData.travelers || 2 };
      } else {
        bkData = { type: 'experience', experienceId: experience.id, title: experience.title, date: experience.date, amount: finalTotal, travelers };
      }
      
      const booking = await bookingService.createBooking({
        userId: user.uid,
        ...formData,
        ...bkData,
        paymentStatus: 'paid',
        paymentOrderId: order.id
      });

      navigate('/booking-confirmation', { state: { booking, finalTotal } });
    } catch (err) {
      toast.error('Payment failed or cancelled.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-12">
      <div className="container-custom max-w-5xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 font-medium">
          <ArrowLeft size={18} /> Back
        </button>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left: Forms */}
          <div className="lg:col-span-7 space-y-6">
            {!user && (
              <div className="bg-white p-6 rounded-2xl border border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900">Have an account?</h3>
                  <p className="text-sm text-gray-500">Sign in for faster checkout</p>
                </div>
                <button onClick={loginWithGoogle} className="btn-secondary py-2">Sign In</button>
              </div>
            )}

            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <h2 className="text-xl font-bold mb-6 text-gray-900">Traveler Details</h2>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                    <input type="text" className="input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                    <input type="email" className="input bg-gray-100" value={formData.email} readOnly={!!user} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input type="tel" className="input" placeholder="+91" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Special Requirements (Optional)</label>
                  <textarea className="input min-h-[100px]" placeholder="Allergies, accessibility needs, etc." value={formData.specialReqs} onChange={(e) => setFormData({...formData, specialReqs: e.target.value})}></textarea>
                </div>
              </form>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Cancellation Policy</h2>
              <p className="text-sm text-gray-600 font-medium mb-2">{isFullTrip ? 'Moderate Policy' : experience?.cancellationPolicy}</p>
              <p className="text-sm text-gray-500">Review the host's cancellation policy before confirming your booking. Our standard platform protection applies to all bookings.</p>
            </div>
          </div>

          {/* Right: Summary & Payment */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden sticky top-24">
              
              {/* Item Details */}
              <div className="p-6 border-b border-gray-100 bg-gray-50">
                {isFullTrip ? (
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary-600 mb-1 block">Full Trip Package</span>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{tripData.tripTitle}</h3>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1"><Calendar size={14}/> {tripData.days.length} Days</span>
                      <span className="flex items-center gap-1"><MapPin size={14}/> {tripData.toCity}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <img src={experience.coverImage} className="w-24 h-24 rounded-xl object-cover shrink-0" alt="" />
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">{experience.category}</span>
                      <h3 className="font-bold text-gray-900 leading-tight mb-2">{experience.title}</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1.5"><Calendar size={14}/> {new Date(experience.date).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1.5"><Users size={14}/> {travelers} Guests</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="p-6">
                <h3 className="font-bold text-lg mb-4">Price Details</h3>
                <div className="space-y-3 mb-4 text-gray-700">
                  <div className="flex justify-between">
                    <span>Base Price {isFullTrip ? '' : `(₹${experience.price} x ${travelers})`}</span>
                    <span>₹{baseTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee</span>
                    <span>₹{serviceFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes (GST 18%)</span>
                    <span>₹{gst.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 flex justify-between items-center mb-6">
                  <span className="font-bold text-xl">Total (INR)</span>
                  <span className="font-bold text-2xl flex items-center"><IndianRupee size={22}/>{finalTotal.toLocaleString()}</span>
                </div>

                <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 mb-6 flex gap-3">
                  <ShieldCheck size={24} className="text-teal-600 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-teal-900">Safe & Secure Payment</h4>
                    <p className="text-xs text-teal-700 mt-0.5">ExploreHub securely holds your payment until 24 hours after the experience starts.</p>
                  </div>
                </div>

                <button 
                  onClick={handleBook} 
                  disabled={loading || !user} 
                  className="btn-primary w-full justify-center py-4 text-lg"
                >
                  {loading ? (
                    <span className="flex items-center gap-2"><Loader2 size={20} className="animate-spin" /> Processing Securely...</span>
                  ) : (
                    `Pay ₹${finalTotal.toLocaleString()}`
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
