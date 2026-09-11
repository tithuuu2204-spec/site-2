import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Globe, Sparkles, Shield, Star, ArrowRight, Chrome } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const FEATURES = [
  { icon: Sparkles, text: 'AI-powered trip planning' },
  { icon: Shield, text: 'Verified local hosts' },
  { icon: Star, text: 'Authentic Indian experiences' },
];

export default function LoginPage() {
  const { user, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  if (user) {
    navigate('/');
    return null;
  }

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      toast.success('Welcome to ExploreHub!');
      navigate('/');
    } catch (err) {
      toast.error('Sign-in failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left: Image panel */}
      <div className="hidden md:block relative">
        <img
          src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&auto=format&fit=crop&q=80"
          alt="India travel"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/80 to-saffron-900/60" />
        <div className="relative h-full flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Globe size={22} className="text-white" />
            </div>
            <span className="font-display text-2xl font-bold">ExploreHub</span>
          </div>

          {/* Quote */}
          <div>
            <h2 className="font-display text-4xl font-bold leading-tight mb-4">
              "Every journey begins<br />with a single discovery."
            </h2>
            <p className="text-white/70 text-lg">
              Join thousands of travelers discovering authentic local experiences across India.
            </p>
            <div className="flex flex-col gap-3 mt-8">
              {FEATURES.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Icon size={16} />
                  </div>
                  <span className="text-sm">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <p className="text-white/40 text-xs">
            Smart India Hackathon 2024 — ExploreHub Team
          </p>
        </div>
      </div>

      {/* Right: Login form */}
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50">
        {/* Mobile logo */}
        <div className="mb-8 text-center md:hidden">
          <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-saffron-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Globe size={28} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-2xl text-gray-900">ExploreHub</h1>
        </div>

        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-500 text-sm">Sign in to plan your next adventure</p>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold py-3.5 px-6 rounded-xl hover:border-primary-400 hover:shadow-md transition-all duration-200 mb-6"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-gray-50 text-xs text-gray-400">Demo accounts</span>
            </div>
          </div>

          {/* Demo accounts */}
          <div className="space-y-3 bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">SIH Demo Accounts</p>
            {[
              { role: 'Traveler', email: 'traveler@demo.explorehub.in', color: 'bg-blue-50 text-blue-700' },
              { role: 'Host', email: 'host@demo.explorehub.in', color: 'bg-teal-50 text-teal-700' },
              { role: 'Admin', email: 'admin@explorehub.in', color: 'bg-purple-50 text-purple-700' },
            ].map((acc) => (
              <div key={acc.role} className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50">
                <div>
                  <p className="text-xs font-semibold text-gray-700">{acc.email}</p>
                  <p className="text-xs text-gray-400">Password: Demo@1234</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${acc.color}`}>
                  {acc.role}
                </span>
              </div>
            ))}
            <p className="text-xs text-gray-400 text-center pt-1">
              Sign in with Google — role is assigned automatically based on email
            </p>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            By continuing, you agree to our{' '}
            <Link to="#" className="text-primary-600 hover:underline">Terms</Link> and{' '}
            <Link to="#" className="text-primary-600 hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
