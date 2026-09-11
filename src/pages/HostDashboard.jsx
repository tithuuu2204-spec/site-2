import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { LayoutDashboard, List, PlusCircle, Calendar, PieChart, Star, Settings, ShieldCheck, IndianRupee } from 'lucide-react';
import Badge from '../components/ui/Badge';

const MOCK_HOST_EVENTS = [
  {id:'exp-garba-001', title:'Traditional Garba Night', category:'Cultural Events', status:'live', bookings:12, rating:4.8, revenue:6000},
  {id:'exp-heritage-001', title:'Old City Heritage Walk', category:'Heritage Walks', status:'live', bookings:8, rating:4.7, revenue:2800},
  {id:'exp-cooking-001', title:'Gujarati Cooking Workshop', category:'Workshops', status:'pending', bookings:0, rating:0, revenue:0},
];

export default function HostDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="bg-gray-50 min-h-screen pt-20 pb-12">
      <div className="bg-teal-900 text-white pb-16 pt-8 mb-[-40px]">
        <div className="container-custom">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-teal-800 rounded-full flex items-center justify-center text-2xl font-bold">
              {user?.displayName?.charAt(0) || 'H'}
            </div>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {user?.displayName || 'Host Dashboard'} <ShieldCheck className="text-teal-400" size={20} />
              </h1>
              <p className="text-teal-200">Manage your experiences and bookings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom flex flex-col md:flex-row gap-6 relative z-10">
        
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            <nav className="flex flex-col">
              {[
                { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
                { id: 'listings', icon: List, label: 'My Listings' },
                { id: 'bookings', icon: Calendar, label: 'Bookings' },
                { id: 'analytics', icon: PieChart, label: 'Analytics' },
                { id: 'verification', icon: ShieldCheck, label: 'Trust & Verification' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-5 py-4 text-sm font-medium transition-colors border-l-4 ${
                    activeTab === tab.id ? 'bg-teal-50 text-teal-800 border-teal-600' : 'border-transparent text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon size={18} className={activeTab === tab.id ? 'text-teal-600' : 'text-gray-400'} />
                  {tab.label}
                </button>
              ))}
            </nav>
            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <Link to="/host/create" className="btn-primary w-full justify-center bg-teal-600 hover:bg-teal-700">
                <PlusCircle size={18} className="mr-2"/> Create New
              </Link>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="text-gray-500 text-sm mb-2 flex items-center gap-1.5"><IndianRupee size={14}/> Total Earnings</div>
                  <div className="text-2xl font-bold text-gray-900">₹8,800</div>
                  <div className="text-xs text-green-600 mt-1">+12% this month</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="text-gray-500 text-sm mb-2 flex items-center gap-1.5"><Calendar size={14}/> Total Bookings</div>
                  <div className="text-2xl font-bold text-gray-900">20</div>
                  <div className="text-xs text-green-600 mt-1">+4 this month</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="text-gray-500 text-sm mb-2 flex items-center gap-1.5"><List size={14}/> Active Listings</div>
                  <div className="text-2xl font-bold text-gray-900">2</div>
                  <div className="text-xs text-gray-400 mt-1">1 pending review</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="text-gray-500 text-sm mb-2 flex items-center gap-1.5"><Star size={14}/> Avg Rating</div>
                  <div className="text-2xl font-bold text-gray-900">4.8</div>
                  <div className="text-xs text-gray-400 mt-1">Based on 15 reviews</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <h3 className="font-bold text-lg">My Experiences</h3>
                  <button onClick={() => setActiveTab('listings')} className="text-teal-600 text-sm font-medium">View All</button>
                </div>
                <div className="p-0">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-white border-b border-gray-100 text-gray-500">
                        <th className="px-5 py-3 font-medium">Title</th>
                        <th className="px-5 py-3 font-medium">Status</th>
                        <th className="px-5 py-3 font-medium">Bookings</th>
                        <th className="px-5 py-3 font-medium text-right">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_HOST_EVENTS.map(ev => (
                        <tr key={ev.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-4 font-medium text-gray-900">{ev.title}</td>
                          <td className="px-5 py-4">
                            <Badge variant={ev.status === 'live' ? 'success' : 'warning'}>{ev.status}</Badge>
                          </td>
                          <td className="px-5 py-4">{ev.bookings}</td>
                          <td className="px-5 py-4 text-right font-medium">₹{ev.revenue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'verification' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Trust & Verification</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-green-200 bg-green-50 rounded-xl p-5 relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 text-green-200 opacity-50">
                    <ShieldCheck size={100} />
                  </div>
                  <div className="relative z-10">
                    <Badge variant="success" className="mb-3">Verified Host</Badge>
                    <h3 className="font-bold text-lg text-green-900 mb-1">Identity Verified</h3>
                    <p className="text-sm text-green-800 mb-4">Your Aadhaar and PAN have been successfully verified.</p>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-xl p-5">
                  <h3 className="font-bold text-lg mb-1">GST Registration</h3>
                  <p className="text-sm text-gray-500 mb-4">Optional for small hosts, required for turnover > ₹20L</p>
                  <button className="btn-secondary py-2 text-sm w-full">Add GST Details</button>
                </div>
              </div>

              <div className="mt-8 border-t border-gray-100 pt-6">
                <h3 className="font-bold mb-4">Host Trust Score: 95/100</h3>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div className="bg-teal-500 h-3 rounded-full" style={{ width: '95%' }}></div>
                </div>
                <p className="text-sm text-gray-500">Your score is Excellent. High trust scores lead to better visibility in search results.</p>
              </div>
            </div>
          )}

          {/* Placeholder for other tabs */}
          {(activeTab !== 'overview' && activeTab !== 'verification') && (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500 shadow-sm">
              Section content for {activeTab} goes here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
