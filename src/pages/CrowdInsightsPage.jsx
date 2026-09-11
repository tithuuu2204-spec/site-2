import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Leaf, ArrowRight, ShieldAlert } from 'lucide-react';
import { crowdService } from '../services/crowdService';

const CITIES = ['Ahmedabad', 'Jaipur', 'Varanasi', 'Goa', 'Amritsar', 'Delhi'];

export default function CrowdInsightsPage() {
  const [city, setCity] = useState('Varanasi');
  const [data, setData] = useState(null);

  useEffect(() => {
    crowdService.getCrowdLevel(city).then(setData);
  }, [city]);

  return (
    <div className="bg-gray-50 min-h-screen pt-20 pb-16">
      {/* Hero */}
      <div className="bg-gradient-to-r from-teal-900 to-primary-900 text-white py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1533222481259-ce20eda1e20b?w=1200&q=20')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="container-custom relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-teal-800/50 backdrop-blur-md text-teal-200 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-teal-700">
            <Leaf size={16} /> Sustainable Tourism Initiative
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Smart Crowd Insights</h1>
          <p className="text-lg text-teal-100 opacity-90">Avoid the rush. Discover the perfect time to visit and help distribute tourism for a more sustainable future.</p>
        </div>
      </div>

      <div className="container-custom mt-8 grid md:grid-cols-12 gap-8">
        
        {/* Sidebar Selector */}
        <div className="md:col-span-4 lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4">Select Destination</h3>
            <div className="space-y-2">
              {CITIES.map(c => (
                <button
                  key={c}
                  onClick={() => setCity(c)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${city === c ? 'bg-primary-50 text-primary-700 ring-1 ring-primary-500 shadow-sm' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-8 lg:col-span-9 space-y-6">
          
          {data && (
            <div className={`p-8 rounded-3xl border-2 shadow-sm ${crowdService.crowdLevelColor(data.level)}`}>
              <div className="flex items-center gap-4 mb-2">
                <span className="text-5xl">{crowdService.crowdLevelEmoji(data.level)}</span>
                <div>
                  <h2 className="text-3xl font-display font-bold capitalize">{data.level.replace('-', ' ')}</h2>
                  <p className="opacity-80 font-medium">Current status for {city}</p>
                </div>
              </div>
              <div className="mt-8 bg-white/40 rounded-xl p-4">
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span>Crowd Density Index</span>
                  <span>{data.score} / 100</span>
                </div>
                <div className="w-full bg-white/50 rounded-full h-3">
                  <div className="h-3 rounded-full bg-current opacity-70" style={{ width: `${data.score}%` }} />
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><BarChart3 className="text-primary-500" /> Weekly Heatmap Estimate</h3>
            
            <div className="flex items-end justify-between gap-2 h-40">
              {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day, i) => {
                // Mock chart data
                const h = i > 4 ? 80 + Math.random()*20 : 30 + Math.random()*30;
                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full bg-gray-100 rounded-t-md relative flex items-end">
                      <div className={`w-full rounded-t-md transition-all duration-500 ${h > 75 ? 'bg-red-400' : h > 50 ? 'bg-yellow-400' : 'bg-green-400'}`} style={{ height: `${h}%` }}></div>
                      {/* Tooltip */}
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap pointer-events-none transition-opacity">
                        {Math.round(h)}% Capacity
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-gray-500">{day}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800 flex gap-3 items-start">
              <ShieldAlert size={20} className="shrink-0 mt-0.5" />
              <p>Visiting during weekdays reduces strain on local infrastructure by 40% and provides a more authentic, peaceful experience.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
