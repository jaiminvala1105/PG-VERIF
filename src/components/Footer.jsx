import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Building } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-indigo-950 text-indigo-100 relative pt-12 pb-6 px-6">
      {/* Minimal Indigo Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>

      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Column 1: Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4 text-white">
              <Building className="w-8 h-8 text-indigo-400" />
              <span className="text-xl font-bold">PG Finder</span>
            </div>
            <p className="text-sm text-indigo-200 mb-6 leading-relaxed">
              Your trusted platform for finding the perfect paying guest accommodation.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition transform hover:-translate-y-1"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition transform hover:-translate-y-1"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition transform hover:-translate-y-1"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition transform hover:-translate-y-1"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-indigo-200">
              <li><a href="#" className="hover:text-white transition hover:pl-1">About Us</a></li>
              <li><a href="#" className="hover:text-white transition hover:pl-1">How It Works</a></li>
              <li><a href="#" className="hover:text-white transition hover:pl-1">Blog</a></li>
              <li><a href="#" className="hover:text-white transition hover:pl-1">Careers</a></li>
            </ul>
          </div>

          {/* Column 3: For Owners */}
          <div>
            <h3 className="text-white font-bold mb-4">For Owners</h3>
            <ul className="space-y-2 text-sm text-indigo-200">
              <li><a href="#" className="hover:text-white transition hover:pl-1">List Your PG</a></li>
              <li><a href="#" className="hover:text-white transition hover:pl-1">Owner Dashboard</a></li>
              <li><a href="#" className="hover:text-white transition hover:pl-1">Pricing Plans</a></li>
              <li><a href="#" className="hover:text-white transition hover:pl-1">Resources</a></li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div>
            <h3 className="text-white font-bold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-indigo-200">
              <li><a href="#" className="hover:text-white transition hover:pl-1">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition hover:pl-1">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition hover:pl-1">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition hover:pl-1">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-indigo-900 pt-8 text-center text-sm text-indigo-300">
          <p>© 2026 PG Finder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
