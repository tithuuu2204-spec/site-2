import React, { useEffect } from 'react';
import { useLocation, Link, useNavigate, Navigate } from 'react-router-dom';
import { CheckCircle, Calendar, MapPin, Users, Download, Share2, ArrowRight } from 'lucide-react';

export default function BookingConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, finalTotal } = location.state || {};

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!booking) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 relative overflow-hidden">
      {/* Confetti BG elements (CSS) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-green-500/20 to-transparent blur-3xl pointer-events-none rounded-b-full" />
      
      <div className="container-custom max-w-2xl relative z-10 text-center">
        
        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/30 animate-slide-up">
          <CheckCircle size={48} className="text-white" />
        </div>

        <h1 className="font-display font-bold text-4xl text-gray-900 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-600 text-lg mb-8">You're all set for an amazing experience.</p>

        {/* Ticket Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 text-left border border-gray-100">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Confirmation ID</p>
              <p className="font-mono text-xl font-bold">{booking.confirmationCode}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Amount Paid</p>
              <p className="font-bold text-xl">₹{finalTotal?.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="p-6 md:p-8">
            <h3 className="font-bold text-2xl text-gray-900 mb-6">{booking.title || booking.tripTitle}</h3>
            
            <div className="grid grid-cols-2 gap-y-6">
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase mb-1 flex items-center gap-1.5"><Calendar size={14}/> Date</p>
                <p className="font-medium text-gray-900">{booking.date ? new Date(booking.date).toLocaleDateString('en-IN', {weekday:'long', month:'long', day:'numeric'}) : 'TBD'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase mb-1 flex items-center gap-1.5"><Users size={14}/> Guests</p>
                <p className="font-medium text-gray-900">{booking.travelers} People</p>
              </div>
              {booking.type !== 'full_trip' && (
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 font-semibold uppercase mb-1 flex items-center gap-1.5"><MapPin size={14}/> Meeting Point</p>
                  <p className="font-medium text-gray-900">Check host instructions in email</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Tear line */}
          <div className="relative h-4 bg-gray-50 flex items-center justify-between border-t border-b border-gray-100 overflow-hidden">
            {Array.from({length: 40}).map((_, i) => (
              <div key={i} className="w-2 h-2 bg-gray-200 rounded-full" />
            ))}
            <div className="absolute left-0 w-4 h-4 bg-gray-50 rounded-r-full -ml-1 shadow-inner border border-gray-200" />
            <div className="absolute right-0 w-4 h-4 bg-gray-50 rounded-l-full -mr-1 shadow-inner border border-gray-200" />
          </div>

          <div className="p-6 bg-gray-50 flex justify-center gap-4">
            <button className="btn-secondary py-2 text-sm flex-1 justify-center bg-white"><Download size={16}/> Save PDF</button>
            <button className="btn-secondary py-2 text-sm flex-1 justify-center bg-white"><Share2 size={16}/> Share</button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/dashboard" className="btn-primary justify-center py-3 px-8">
            Go to My Dashboard
          </Link>
          <Link to="/explore" className="btn-ghost justify-center py-3 px-8 bg-white border border-gray-200 shadow-sm">
            Explore More <ArrowRight size={16} />
          </Link>
        </div>
        
        <p className="text-gray-500 text-sm mt-8">
          A confirmation email has been sent to your registered email address.
        </p>

      </div>
    </div>
  );
}
