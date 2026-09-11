import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, Phone, Instagram, Twitter, Facebook, Youtube, ArrowRight } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  const links = {
    explore: [
      { label: 'Browse Experiences', to: '/explore' },
      { label: 'Popular Destinations', to: '/destinations' },
      { label: 'AI Trip Planner', to: '/ai-planner' },
      { label: 'Crowd Insights', to: '/crowd-insights' },
      { label: 'Hidden Gems', to: '/explore?filter=hidden-gems' },
    ],
    host: [
      { label: 'Become a Host', to: '/host/create' },
      { label: 'Host Dashboard', to: '/host/dashboard' },
      { label: 'Host Guidelines', to: '#' },
      { label: 'Verification Process', to: '#' },
      { label: 'Host Support', to: '#' },
    ],
    company: [
      { label: 'About Us', to: '#' },
      { label: 'Careers', to: '#' },
      { label: 'Press', to: '#' },
      { label: 'Blog', to: '#' },
      { label: 'Contact', to: '#' },
    ],
    legal: [
      { label: 'Terms of Service', to: '#' },
      { label: 'Privacy Policy', to: '#' },
      { label: 'Cookie Policy', to: '#' },
      { label: 'Cancellation Policy', to: '#' },
    ],
  };

  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-400">
      {/* Main footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-saffron-500 rounded-lg flex items-center justify-center">
                <Globe size={20} className="text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">ExploreHub</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs">
              Discover authentic local experiences across India. AI-powered trip planning. Verified hosts. One seamless journey.
            </p>
            {/* Newsletter */}
            <div>
              <p className="text-sm font-medium text-gray-300 mb-2">Get travel inspiration</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-3 py-2.5 placeholder-gray-500 focus:outline-none focus:border-primary-500"
                />
                <button className="bg-primary-600 text-white rounded-xl px-3 py-2.5 hover:bg-primary-700 transition-colors">
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
            {/* Social */}
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Explore</h4>
            <ul className="space-y-2.5">
              {links.explore.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm hover:text-primary-400 transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">For Hosts</h4>
            <ul className="space-y-2.5">
              {links.host.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm hover:text-primary-400 transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Company</h4>
            <ul className="space-y-2.5">
              {links.company.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm hover:text-primary-400 transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {year} ExploreHub Technologies Pvt. Ltd. All rights reserved. | Made with ❤️ for SIH
          </p>
          <div className="flex items-center gap-4">
            {links.legal.map((l) => (
              <Link key={l.label} to={l.to} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
