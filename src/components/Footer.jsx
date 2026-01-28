import React, { useState } from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import pgveriflogo from "../assets/pg-verif.png";
import { addDoc, collection } from "firebase/firestore";
import { __DB } from "../backend/firebaseConfig";
import toast from "react-hot-toast";

const Footer = () => {
  const [feedbackData, setFeedbackData] = useState({
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFeedbackData({ ...feedbackData, [e.target.name]: e.target.value });
  };

  const handleFeedback = async (e) => {
    e.preventDefault();
    if (!feedbackData.email || !feedbackData.message) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(__DB, "feedbacks"), {
        ...feedbackData,
        createdAt: new Date().toISOString()
      });
      toast.success("Feedback sent successfully!");
      setFeedbackData({ email: '', message: '' });
    } catch (error) {
      console.error("Error sending feedback: ", error);
      toast.error("Failed to send feedback.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-indigo-950 text-indigo-100 relative pt-10 pb-6 overflow-hidden">
      {/* Background Decor Elements matching Hero */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-70"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-indigo-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                <img 
                  src={pgveriflogo} 
                  alt="PG Verify Logo" 
                  className="relative h-12 w-auto object-contain rounded-lg"
                />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
                PG Verify
              </span>
            </Link>
            <p className="text-sm text-indigo-200/80 leading-relaxed max-w-xs">
              Your trusted platform for verifying and finding the perfect paying guest accommodation with ease and security.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <a 
                  key={index} 
                  href="#" 
                  className="bg-indigo-900/50 p-2 rounded-lg hover:bg-indigo-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/25 group"
                >
                  <Icon className="w-5 h-5 text-indigo-300 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center">
              <span className="w-8 h-1 bg-indigo-500 rounded-full mr-3"></span>
              Quick Links
            </h3>
            <ul className="space-y-3 text-indigo-200/80">
              {[
                { name: 'Home', path: '/' },
                { name: 'Browse PGs', path: '/pg' },
                { name: 'Login', path: '/auth/login' },
                { name: 'Sign Up', path: '/auth/sign-up' }
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="hover:text-white transition-all duration-200 flex items-center group"
                  >
                    <span className="w-0 h-0.5 bg-indigo-400 mr-0 transition-all duration-300 group-hover:w-3 group-hover:mr-2"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: For Owners */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center">
              <span className="w-8 h-1 bg-indigo-500 rounded-full mr-3"></span>
              For Owners
            </h3>
            <ul className="space-y-3 text-indigo-200/80">
              {[
                { name: 'List Your PG', path: '/list-your-pg' },
                { name: 'Owner Dashboard', path: '/admin' },
                { name: 'Support', path: '/help-center' }
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="hover:text-white transition-all duration-200 flex items-center group"
                  >
                    <span className="w-0 h-0.5 bg-indigo-400 mr-0 transition-all duration-300 group-hover:w-3 group-hover:mr-2"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Feedback Form */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center">
              <span className="w-8 h-1 bg-indigo-500 rounded-full mr-3"></span>
              Feedback
            </h3>
            <form onSubmit={handleFeedback} className="space-y-3">
              <div>
                <input 
                  type="email" 
                  name="email"
                  value={feedbackData.email}
                  onChange={handleChange}
                  placeholder="Your Email" 
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-2 text-sm text-indigo-100 placeholder-indigo-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
              <div>
                <textarea 
                  name="message"
                  value={feedbackData.message}
                  onChange={handleChange}
                  placeholder="Your Message" 
                  rows="3"
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-2 text-sm text-indigo-100 placeholder-indigo-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span>{loading ? 'Sending...' : 'Send'}</span>
                {!loading && <Send className="w-4 h-4 ml-1" />}
              </button>
            </form>
          </div>
        </div>

        {/* Improved Copyright Section */}
        <div className="border-t border-indigo-900/50 pt-6 mt-6 flex flex-col items-center text-center text-sm text-indigo-400/60">
          <p>© 2026 PG Verify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
