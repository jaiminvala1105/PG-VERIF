import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Phone, Mail, MapPin, Lock, User, ArrowRight, CheckCircle } from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { __AUTH, __DB } from "../backend/firebaseConfig";
import toast from "react-hot-toast";

const ListYourPG = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ownerName: '',
    phone: '',
    email: '',
    city: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create User in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        __AUTH, 
        formData.email, 
        formData.password
      );
      const user = userCredential.user;

      // 2. Send Verification Email
      await sendEmailVerification(user);

      // 3. Update Profile
      await updateProfile(user, {
        displayName: formData.ownerName
      });

      // 4. Save User Details to Firestore with 'owner' role
      await setDoc(doc(__DB, "users", user.uid), {
        uid: user.uid,
        name: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        role: 'owner',
        createdAt: new Date().toISOString()
      });

      toast.success("Account Created! Verification email sent.");
      navigate('/auth/login'); // Redirect to Login to ensure verification

    } catch (error) {
      console.error("Registration Error:", error);
      toast.error(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById('registration-form').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <div className="container mx-auto max-w-6xl relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 bg-indigo-900/40 border border-indigo-500/30 rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-orange-500"></span>
            <span className="text-sm text-indigo-200 font-medium">For Property Owners</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
            Multiply Your Bookings <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-600">
              with PG-VERIF
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            The smartest way to manage your property. Track inquiries, update occupancies in real-time, and get verified leads directly to your dashboard.
          </p>

          <button 
            onClick={scrollToForm}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-orange-600 font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 focus:ring-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-600/30"
          >
            Get Started Now
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <div className="absolute -inset-3 rounded-xl bg-gradient-to-r from-orange-400 to-amber-600 opacity-20 blur-lg transition-all duration-200 group-hover:opacity-40 group-hover:inset-1" />
          </button>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-16 text-left">
            {[
              { title: "Smart Dashboard", desc: "Manage all your PGs and tenants from one central place." },
              { title: "Verified Leads", desc: "Get inquiries from verified students and professionals." },
              { title: "Real-time Updates", desc: "Update availability and pricing instantly." }
            ].map((feature, idx) => (
              <div key={idx} className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl hover:border-gray-700 transition-colors">
                <CheckCircle className="w-8 h-8 text-orange-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section id="registration-form" className="py-20 px-6 bg-gray-900/50">
        <div className="container mx-auto max-w-5xl flex flex-col md:flex-row items-center gap-12">
          
          {/* Left Side: Content */}
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Join 1000+ Owners growing with us.</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400">
                  <Building className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-white">List Unlimited Properties</h4>
                  <p className="text-gray-400">Add as many PGs as you own under one account.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-orange-600/20 text-orange-400">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-white">Zero Commission</h4>
                  <p className="text-gray-400">Direct connection with tenants. No hidden charges.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="w-full md:w-1/2">
            <div className="bg-gray-800 border border-gray-700/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-indigo-500"></div>
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-1">Owner Registration</h3>
                <p className="text-gray-400 text-sm">Create your account to start listing.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Name */}
                <div className="relative group">
                  <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-orange-500 transition-colors" />
                  <input 
                    type="text" 
                    name="ownerName"
                    required
                    value={formData.ownerName}
                    onChange={handleChange}
                    placeholder="Business / Owner Name" 
                    className="w-full bg-gray-900/50 border border-gray-600 text-white text-sm rounded-xl block pl-12 p-3.5 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder-gray-500"
                  />
                </div>

                {/* Contact */}
                <div className="relative group">
                  <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-orange-500 transition-colors" />
                  <input 
                    type="tel" 
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 Mobile Number" 
                    className="w-full bg-gray-900/50 border border-gray-600 text-white text-sm rounded-xl block pl-12 p-3.5 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder-gray-500"
                  />
                </div>

                {/* Email */}
                <div className="relative group">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-orange-500 transition-colors" />
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address" 
                    className="w-full bg-gray-900/50 border border-gray-600 text-white text-sm rounded-xl block pl-12 p-3.5 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder-gray-500"
                  />
                </div>

                {/* City */}
                <div className="relative group">
                  <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-orange-500 transition-colors" />
                  <input 
                    type="text" 
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City / Location" 
                    className="w-full bg-gray-900/50 border border-gray-600 text-white text-sm rounded-xl block pl-12 p-3.5 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder-gray-500"
                  />
                </div>

                {/* Password */}
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-orange-500 transition-colors" />
                  <input 
                    type="password" 
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password" 
                    className="w-full bg-gray-900/50 border border-gray-600 text-white text-sm rounded-xl block pl-12 p-3.5 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder-gray-500"
                  />
                </div>
                
                {/* Hidden Role Indicator */}
                <div className="text-xs text-gray-500 text-center">
                  Registering as <span className="text-orange-400 font-semibold">Property Owner</span>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold py-4 rounded-xl shadow-lg transform transition hover:-translate-y-1 focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating Account...' : 'Create Owner Account'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ListYourPG;
