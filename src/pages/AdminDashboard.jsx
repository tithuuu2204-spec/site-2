import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Users, CheckCircle, XCircle, AlertCircle, FileText } from 'lucide-react';
import Badge from '../components/ui/Badge';
import toast from 'react-hot-toast';

const MOCK_PENDING = [
  { id: 'req_001', hostName: 'Ravi Kumar', title: 'Mountain Trekking Guide', city: 'Manali', dateSubmitted: '2026-09-08' },
  { id: 'req_002', hostName: 'Priya Patel', title: 'Authentic Gujarati Cooking Class', city: 'Ahmedabad', dateSubmitted: '2026-09-10' }
];

export default function AdminDashboard() {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingList, setPendingList] = useState(MOCK_PENDING);

  // Security Guard
  if (role !== 'admin') {
    return (
      <div className="min-h-screen pt-32 text-center">
        <AlertCircle size={64} className="mx-auto text-red-500 mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600">You must be an administrator to view this page.</p>
      </div>
    );
  }

  const handleApprove = (id) => {
    setPendingList(prev => prev.filter(p => p.id !== id));
    toast.success('Listing approved and is now live!');
  };

  return (
    <div className="bg-gray-100 min-h-screen pt-20 pb-12 font-sans">
      <div className="bg-gray-900 text-white p-6 md:p-10 shadow-md">
        <div className="container-custom flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Console</h1>
            <p className="text-gray-400 mt-1">ExploreHub Platform Management</p>
          </div>
          <Badge variant="purple" className="text-sm">Superadmin</Badge>
        </div>
      </div>

      <div className="container-custom mt-8 grid lg:grid-cols-4 gap-6">
        
        {/* Sidebar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <nav className="flex flex-col">
            <button onClick={() => setActiveTab('stats')} className={`text-left px-5 py-4 text-sm font-medium border-l-4 ${activeTab === 'stats' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-transparent text-gray-600 hover:bg-gray-50'}`}>Platform Stats</button>
            <button onClick={() => setActiveTab('pending')} className={`text-left px-5 py-4 text-sm font-medium border-l-4 flex justify-between items-center ${activeTab === 'pending' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-transparent text-gray-600 hover:bg-gray-50'}`}>
              Pending Approvals
              {pendingList.length > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingList.length}</span>}
            </button>
            <button onClick={() => setActiveTab('users')} className={`text-left px-5 py-4 text-sm font-medium border-l-4 ${activeTab === 'users' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-transparent text-gray-600 hover:bg-gray-50'}`}>Manage Users</button>
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'pending' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-xl font-bold">Pending Experience Approvals</h2>
                <p className="text-sm text-gray-500">Review and approve new listings from hosts before they go live.</p>
              </div>
              
              {pendingList.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {pendingList.map(req => (
                    <div key={req.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-primary-100 text-primary-700 rounded-lg flex items-center justify-center shrink-0">
                          <FileText size={20} />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{req.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">Host: {req.hostName} • Location: {req.city}</p>
                          <p className="text-xs text-gray-400 mt-1">Submitted: {req.dateSubmitted}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleApprove(req.id)} className="flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-green-100">
                          <CheckCircle size={16} /> Approve
                        </button>
                        <button className="flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-100">
                          <XCircle size={16} /> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-gray-500">
                  <CheckCircle size={48} className="mx-auto text-green-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900">All caught up!</p>
                  <p>There are no pending experiences to review.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
                <Users size={32} className="mx-auto text-blue-500 mb-3" />
                <h3 className="text-3xl font-bold text-gray-900">1,248</h3>
                <p className="text-gray-500">Total Registered Users</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
                <ShieldCheck size={32} className="mx-auto text-teal-500 mb-3" />
                <h3 className="text-3xl font-bold text-gray-900">156</h3>
                <p className="text-gray-500">Verified Local Hosts</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
