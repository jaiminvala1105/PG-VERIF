import React from 'react';
import { Home as HomeIcon, ArrowRight, Shield, Users, CheckCircle, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const pgCategories = [
    {
      title: "Girls PG",
      subtitle: "Safe & secure living for women",
      count: "3.2K+",
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2071&auto=format&fit=crop",
      color: "from-pink-500 to-rose-500"
    },
    {
      title: "Co-ed PG",
      subtitle: "Modern shared living spaces",
      count: "1.8K+",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop",
      color: "from-indigo-500 to-purple-500"
    },
    {
      title: "Boys PG",
      subtitle: "Comfortable stays for men",
      count: "2.5K+",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
      color: "from-blue-500 to-cyan-500"
    }
  ];

  return (
    <div className="relative min-h-[85vh] bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-950" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="space-y-8 z-10">
            
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-sm text-gray-300 font-medium">India's Most Trusted PG Platform</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight">
                Find Your Dream PG
                <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
               
                </span>
                in Minutes!
              </h1>
              <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-xl">
                From verified properties to hassle-free bookings, we've got everything to make your PG search simple and stress-free.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/pg')}
                className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all duration-300 flex items-center gap-2"
              >
                <HomeIcon className="w-5 h-5" />
                Browse All PGs
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm border-2 border-indigo-500/50 hover:border-indigo-400 text-white font-bold rounded-xl transition-all duration-300"
              >
                How It Works
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Shield className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">100% Verified</p>
                  <p className="text-white font-semibold">Properties</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">50K+ Happy</p>
                  <p className="text-white font-semibold">Tenants</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - PG Category Cards */}
          <div className="relative z-10 hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              {pgCategories.map((category, index) => (
                <div
                  key={category.title}
                  className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gray-900/50 backdrop-blur-sm hover:border-indigo-500/50 transition-all duration-500 cursor-pointer hover:scale-105 ${
                    index === 0 ? 'col-span-2' : ''
                  }`}
                  onClick={() => navigate('/pg')}
                  style={{
                    height: index === 0 ? '280px' : '240px'
                  }}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img
                      src={category.image}
                      alt={category.title}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-40 group-hover:opacity-50 transition-opacity`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                  </div>

                  {/* Content Overlay */}
                  <div className="relative h-full p-6 flex flex-col justify-between">
                    {/* Property Count Badge */}
                    <div className="self-end">
                      <div className="px-4 py-2 bg-black/60 backdrop-blur-md border border-white/20 rounded-full">
                        <span className="text-white font-bold text-sm">{category.count} Properties</span>
                      </div>
                    </div>

                    {/* Title & CTA */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">{category.title}</h3>
                        <p className="text-gray-300 text-sm">{category.subtitle}</p>
                      </div>
                      
                      <button className="inline-flex items-center gap-2 text-white font-semibold group-hover:gap-3 transition-all">
                        Explore
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile PG Cards - Horizontal Scroll */}
        <div className="lg:hidden mt-12 -mx-4 px-4">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
            {pgCategories.map((category) => (
              <div
                key={category.title}
                className="group relative flex-shrink-0 w-72 h-64 overflow-hidden rounded-2xl border border-white/10 bg-gray-900/50 backdrop-blur-sm cursor-pointer snap-start"
                onClick={() => navigate('/pg')}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-40`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative h-full p-6 flex flex-col justify-between">
                  <div className="self-end">
                    <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/20 rounded-full">
                      <span className="text-white font-bold text-xs">{category.count} Properties</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <h3 className="text-xl font-bold text-white">{category.title}</h3>
                      <p className="text-gray-300 text-sm">{category.subtitle}</p>
                    </div>
                    <button className="inline-flex items-center gap-2 text-white font-semibold">
                      Explore <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
