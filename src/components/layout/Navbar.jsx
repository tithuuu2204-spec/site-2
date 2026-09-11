import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Map, Search, Sparkles, Users, Heart, Menu, X, LogOut,
  LayoutDashboard, Shield, ChevronDown, Globe, Compass,
  UserCircle, BookOpen, Settings
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';

export default function Navbar() {
  const { user, userProfile, role, loginWithGoogle, logout } = useAuth();
  const { favorites } = useApp();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('[data-profile-menu]')) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/explore', label: 'Explore' },
    { to: '/destinations', label: 'Destinations' },
    { to: '/ai-planner', label: 'AI Planner', icon: Sparkles, highlight: true },
    { to: '/crowd-insights', label: 'Crowd Insights' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-saffron-500 rounded-lg flex items-center justify-center">
              <Globe size={18} className="text-white" />
            </div>
            <span className={`font-display font-bold text-xl ${scrolled ? 'text-gray-900' : 'text-white'}`}>
              ExploreHub
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    link.highlight
                      ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm'
                      : isActive
                      ? scrolled ? 'bg-primary-50 text-primary-600' : 'bg-white/20 text-white'
                      : scrolled ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                {link.icon && <link.icon size={14} />}
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Host CTA */}
            {(!user || role === 'traveler') && (
              <Link
                to="/host/create"
                className={`text-sm font-medium transition-colors ${
                  scrolled ? 'text-gray-600 hover:text-primary-600' : 'text-white/90 hover:text-white'
                }`}
              >
                Become a Host
              </Link>
            )}

            {/* Favorites */}
            {user && (
              <Link
                to="/saved"
                className={`relative p-2 rounded-lg transition-colors ${
                  scrolled ? 'text-gray-600 hover:bg-gray-100' : 'text-white hover:bg-white/10'
                }`}
              >
                <Heart size={20} />
                {favorites.size > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {favorites.size}
                  </span>
                )}
              </Link>
            )}

            {/* Auth */}
            {user ? (
              <div className="relative" data-profile-menu>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <img
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=f97316&color=fff`}
                    alt={user.displayName}
                    className="w-8 h-8 rounded-full object-cover border-2 border-primary-200"
                  />
                  <ChevronDown size={14} className={`${scrolled ? 'text-gray-500' : 'text-white/70'} transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-semibold text-gray-900 text-sm truncate">{user.displayName}</p>
                      <p className="text-gray-400 text-xs truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full capitalize">{role}</span>
                    </div>
                    <div className="py-1">
                      {role === 'traveler' && (
                        <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <LayoutDashboard size={16} className="text-gray-400" /> My Trips
                        </Link>
                      )}
                      {(role === 'host' || role === 'admin') && (
                        <Link to="/host/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <BookOpen size={16} className="text-gray-400" /> Host Dashboard
                        </Link>
                      )}
                      {role === 'admin' && (
                        <Link to="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <Shield size={16} className="text-gray-400" /> Admin Panel
                        </Link>
                      )}
                      <Link to="/saved" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <Heart size={16} className="text-gray-400" /> Saved Places
                      </Link>
                    </div>
                    <div className="border-t border-gray-100 pt-1">
                      <button
                        onClick={() => { logout(); setProfileOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="btn-primary text-sm py-2 px-4"
              >
                <UserCircle size={16} /> Sign In
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className={`md:hidden p-2 rounded-lg ${scrolled ? 'text-gray-700' : 'text-white'}`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl">
          <div className="container-custom py-4 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                {link.icon && <link.icon size={16} />}
                {link.label}
              </NavLink>
            ))}
            <div className="border-t border-gray-100 pt-3 mt-3 space-y-1">
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-gray-700 hover:bg-gray-50">
                    <LayoutDashboard size={16} /> My Dashboard
                  </Link>
                  <Link to="/saved" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-gray-700 hover:bg-gray-50">
                    <Heart size={16} /> Saved Places
                  </Link>
                  {role === 'admin' && (
                    <Link to="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-gray-700 hover:bg-gray-50">
                      <Shield size={16} /> Admin Panel
                    </Link>
                  )}
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-red-600 hover:bg-red-50">
                    <LogOut size={16} /> Sign Out
                  </button>
                </>
              ) : (
                <button onClick={() => { loginWithGoogle(); setMobileOpen(false); }} className="w-full btn-primary justify-center">
                  <UserCircle size={16} /> Sign In with Google
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
