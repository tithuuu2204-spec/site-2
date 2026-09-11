import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinOff } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center p-6">
      <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
        <MapPinOff size={40} className="text-gray-500" />
      </div>
      <h1 className="text-6xl font-display font-bold text-gray-900 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Lost your way?</h2>
      <p className="text-gray-600 mb-8 max-w-md">We can't seem to find the page you're looking for. The link might be broken, or the page may have been removed.</p>
      
      <div className="flex gap-4">
        <Link to="/" className="btn-primary px-8">Return Home</Link>
        <Link to="/explore" className="btn-secondary px-8 bg-white">Explore Experiences</Link>
      </div>
    </div>
  );
}
