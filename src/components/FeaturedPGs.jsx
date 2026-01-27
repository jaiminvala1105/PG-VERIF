import React from 'react';
import { MapPin, Star, User, Wifi, Utensils, Zap } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const FeaturedPGs = () => {
  const navigate = useNavigate();
  const pgs = [
    {
      id: 1,
      name: "Sunshine Boys PG",
      location: "Ahmedabad, Gujarat",
      rating: 4.5,
      reviews: 124,
      sharing: "Double",
      amenities: ["WiFi", "Meals"],
      price: "8,500",
      image: "https://images.unsplash.com/photo-1596276020587-8044fe049813?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      verified: true
    },
    {
      id: 2,
      name: "Elite Girls Hostel",
      location: "gandhinagar, Gujarat",
      rating: 4.8,
      reviews: 89,
      sharing: "Single",
      amenities: ["WiFi", "Meals"],
      price: "12,000",
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      verified: true
    },
    {
      id: 3,
      name: "Urban Co-Living Space",
      location: "Saket, Delhi",
      rating: 4.3,
      reviews: 156,
      sharing: "Triple",
      amenities: ["WiFi", "Gym"],
      price: "9,500",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      verified: true
    },
    {
      id: 4,
      name: "Premium Student Residency",
      location: "Hinjewadi, Pune",
      rating: 4.6,
      reviews: 203,
      sharing: "Double",
      amenities: ["WiFi", "Meals"],
      price: "7,500",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      verified: true
    }
  ];

  return (
    <div className="bg-gray-950 py-8 px-4">
      <div className="container mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Featured PG Accommodations</h2>
          <p className="text-gray-400">Explore our handpicked selection of verified paying guest accommodations</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pgs.map((pg) => (
            <div key={pg.id} className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-300 group">
              
              {/* Image Container */}
              <div className="relative h-56 overflow-hidden">
                <img src={pg.image} alt={pg.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                {/* Verified Badge */}
                {pg.verified && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center shadow-md">
                    Verified
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{pg.name}</h3>
                
                <div className="flex items-center text-gray-400 text-xs mb-3">
                  <MapPin className="w-3 h-3 mr-1" />
                  {pg.location}
                </div>

                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center bg-yellow-400/10 px-2 py-1 rounded text-yellow-400 text-xs font-bold">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    {pg.rating}
                  </div>
                  <span className="text-xs text-gray-500">({pg.reviews})</span>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="flex items-center bg-gray-800 text-gray-300 px-2 py-1 rounded text-[10px]">
                    <User className="w-3 h-3 mr-1" />
                    {pg.sharing}
                  </span>
                  {pg.amenities.includes("WiFi") && (
                    <span className="flex items-center bg-gray-800 text-gray-300 px-2 py-1 rounded text-[10px]">
                      <Wifi className="w-3 h-3 mr-1" />
                      WiFi
                    </span>
                  )}
                  {pg.amenities.includes("Meals") && (
                    <span className="flex items-center bg-gray-800 text-gray-300 px-2 py-1 rounded text-[10px]">
                      <Utensils className="w-3 h-3 mr-1" />
                      Meals
                    </span>
                  )}
                   {pg.amenities.includes("Gym") && (
                    <span className="flex items-center bg-gray-800 text-gray-300 px-2 py-1 rounded text-[10px]">
                      <Zap className="w-3 h-3 mr-1" />
                      Gym
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-baseline text-white">
                  <span className="text-xl font-bold text-blue-400">₹{pg.price}</span>
                  <span className="text-xs text-gray-500 ml-1">/month</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button onClick={() => navigate('/pg')} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition shadow-lg hover:shadow-blue-500/25">
            View All PGs
          </button>
        </div>

      </div>
    </div>
  );
};

export default FeaturedPGs;
