import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { experienceService } from '../services/experienceService';
import toast from 'react-hot-toast';
import { CATEGORIES } from '../data/seedExperiences';

export default function HostCreateExperience() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '', category: CATEGORIES[0].name, city: '',
    price: '', capacity: '', description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    
    setLoading(true);
    try {
      await experienceService.createExperience({
        ...formData,
        hostName: 'Current Host',
        isFeatured: false,
        isHiddenGem: false,
        rating: 0,
        reviewCount: 0,
        approvalStatus: 'pending'
      });
      toast.success("Experience submitted for review!");
      navigate('/host/dashboard');
    } catch (err) {
      toast.error("Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-12">
      <div className="container-custom max-w-3xl">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
          
          {/* Progress Bar */}
          <div className="bg-gray-100 h-2 w-full">
            <div className="bg-teal-500 h-full transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }} />
          </div>

          <div className="p-8 md:p-10">
            <h1 className="text-3xl font-display font-bold mb-2">Create New Experience</h1>
            <p className="text-gray-500 mb-8">Step {step} of 3 • {step === 1 ? 'Basic Info' : step === 2 ? 'Details' : 'Pricing & Capacity'}</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {step === 1 && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Experience Title</label>
                    <input type="text" className="input" placeholder="e.g. Authentic Rajasthani Cooking Class" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Category</label>
                    <select className="input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                      {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">City</label>
                    <input type="text" className="input" placeholder="e.g. Jaipur" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5 animate-fade-in">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Description</label>
                    <textarea className="input min-h-[150px]" placeholder="Describe what travelers will do..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                  </div>
                  <div className="p-4 bg-teal-50 border border-teal-100 rounded-xl text-sm text-teal-800">
                    <strong>Tip:</strong> Be descriptive and highlight what makes your experience unique and authentic.
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1.5">Price per person (₹)</label>
                      <input type="number" className="input" min="0" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1.5">Max Capacity</label>
                      <input type="number" className="input" min="1" value={formData.capacity} onChange={e => setFormData({...formData, capacity: Number(e.target.value)})} required />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-6 mt-6 border-t border-gray-100 flex justify-between">
                {step > 1 ? (
                  <button type="button" onClick={() => setStep(step - 1)} className="btn-ghost border border-gray-200">Back</button>
                ) : <div/>}
                
                <button type="submit" disabled={loading} className="btn-primary bg-teal-600 hover:bg-teal-700">
                  {loading ? 'Submitting...' : step < 3 ? 'Continue' : 'Submit for Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
