import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { Calendar, Map, Heart, Star, Settings, LogOut, ChevronRight, CheckCircle, Clock } from 'lucide-react';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';

const MOCK_BOOKINGS = [
  {id:'bk001', confirmationCode:'EH-284731', experienceTitle:'Traditional Garba Night', date:'2026-10-20', time:'8:00 PM', location:'Ahmedabad, Gujarat', travelers:2, amount:1000, status:'confirmed', isUpcoming:true},
  {id:'bk002', confirmationCode:'EH-391842', experienceTitle:'Ganga Aarti Boat Experience', date:'2026-09-15', time:'6:30 AM', location:'Varanasi, UP', travelers:3, amount:1950, status:'completed', isUpcoming:false},
];

export default function TravelerDashboard() {
  const { user, userProfile, logout } = useAuth();
  const { favorites } = useApp();
  const [activeTab, setActiveTab] = useState('overview');

  const upcomingBookings = MOCK_BOOKINGS.filter(b => b.isUpcoming);
  const pastBookings = MOCK_BOOKINGS.filter(b => !b.isUpcoming);

  return (
    <div className="bg-gray-50 min-h-screen pt-20 pb-12">
      <div className="container-custom flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="flex flex-col items-center text-center">
              <img src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'User'}`} className="w-20 h-20 rounded-full mb-3" alt="" />
              <h2 className="font-bold text-lg">{user?.displayName || 'Traveler'}</h2>
              <p className="text-gray-500 text-sm mb-4">{user?.email}</p>
              <Badge variant="purple" className="mb-2">Traveler Account</Badge>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'overview', icon: Map, label: 'Overview' },
              { id: 'bookings', icon: Calendar, label: 'My Bookings' },
              { id: 'saved', icon: Heart, label: 'Saved (' + favorites.size + ')' },
              { id: 'reviews', icon: Star, label: 'My Reviews' },
              { id: 'settings', icon: Settings, label: 'Settings' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tab.id ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
            <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-4">
              <LogOut size={18} /> Sign Out
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Welcome back, {user?.displayName?.split(' ')[0]}!</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="text-gray-500 mb-1">Upcoming Trips</div>
                  <div className="text-3xl font-bold text-primary-600">{upcomingBookings.length}</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="text-gray-500 mb-1">Past Trips</div>
                  <div className="text-3xl font-bold text-gray-900">{pastBookings.length}</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="text-gray-500 mb-1">Saved</div>
                  <div className="text-3xl font-bold text-gray-900">{favorites.size}</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="text-gray-500 mb-1">Reviews</div>
                  <div className="text-3xl font-bold text-gray-900">2</div>
                </div>
              </div>

              {/* Upcoming */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-xl">Upcoming Bookings</h3>
                  <button className="text-primary-600 text-sm font-medium" onClick={() => setActiveTab('bookings')}>View All</button>
                </div>
                
                {upcomingBookings.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingBookings.map(b => (
                      <div key={b.id} className="flex flex-col md:flex-row items-center justify-between border border-gray-100 p-4 rounded-2xl bg-gray-50 gap-4">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                          <div className="w-16 h-16 bg-white rounded-xl flex flex-col items-center justify-center border border-gray-200 shrink-0">
                            <span className="text-xs text-gray-500 font-bold uppercase">{new Date(b.date).toLocaleString('default', { month: 'short' })}</span>
                            <span className="text-xl font-bold text-primary-600 leading-none mt-1">{new Date(b.date).getDate()}</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{b.experienceTitle}</h4>
                            <p className="text-sm text-gray-500">{b.location} • {b.time}</p>
                            <Badge variant="success" className="mt-2"><CheckCircle size={10} className="mr-1"/> Confirmed</Badge>
                          </div>
                        </div>
                        <button className="btn-secondary py-2 text-sm w-full md:w-auto">View Details</button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState variant="noBookings" action={<button className="btn-primary" onClick={() => window.location.href='/explore'}>Find Experiences</button>} />
                )}
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm min-h-[400px]">
              <h2 className="text-2xl font-bold mb-6">All Bookings</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 text-sm">
                      <th className="pb-3 font-semibold">Experience</th>
                      <th className="pb-3 font-semibold">Date</th>
                      <th className="pb-3 font-semibold">Amount</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_BOOKINGS.map(b => (
                      <tr key={b.id} className="border-b border-gray-100 last:border-0">
                        <td className="py-4 font-medium">{b.experienceTitle}</td>
                        <td className="py-4 text-gray-600">{b.date}</td>
                        <td className="py-4">₹{b.amount}</td>
                        <td className="py-4">
                          <Badge variant={b.status === 'confirmed' ? 'success' : 'default'}>{b.status}</Badge>
                        </td>
                        <td className="py-4">
                          <button className="text-primary-600 hover:underline text-sm font-medium">Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {(activeTab === 'saved' || activeTab === 'reviews' || activeTab === 'settings') && (
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm min-h-[400px] flex items-center justify-center text-center">
              <div>
                <Settings size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Section under construction</h3>
                <p className="text-gray-500">This feature will be available in the next update.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
