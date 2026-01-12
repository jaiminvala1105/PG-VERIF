import React, { useState, useEffect, useRef } from 'react';
import { MapPin, User, Users, IndianRupee, Search } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    location: '',
    gender: '',
    occupancy: '',
    budget: ''
  });

  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeout = useRef(null);

  // Handle Location Search (Nominatim)
  const handleLocationChange = (e) => {
    const value = e.target.value;
    setFilters(prev => ({ ...prev, location: value }));

    // Debounce API call
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!value) {
      setLocationSuggestions([]);
      return;
    }

    searchTimeout.current = setTimeout(async () => {
      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${value}&countrycodes=in&limit=5`);
        setLocationSuggestions(response.data);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    }, 300);
  };

  const selectLocation = (place) => {
    setFilters(prev => ({ ...prev, location: place.display_name.split(',')[0] })); // Just taking the first part for cleaner UI
    setShowSuggestions(false);
  };

  const handleSearch = () => {
    console.log("Searching with:", filters);
    toast.success("Searching for PGs...");
    navigate('/pg', { state: filters });
  };

  return (
    <div className="bg-gray-950 pt-12 text-white min-h-[60vh] flex flex-col items-center justify-center relative">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Heading */}
      <div className="text-center z-10 mb-12 animate-fade-in-up">
        <h1 className="text-4xl md:text-6xl font-bold mb-3 tracking-tight">
          Find Your Perfect PG
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 mt-2">
            Accommodation
          </span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
          Discover comfortable and affordable paying guest options in your preferred location
        </p>
      </div>

      {/* Search Bar Container */}
      <div className="w-full max-w-5xl bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-3xl p-4 shadow-2xl z-20 relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Location Input */}
          <div className="md:col-span-4 relative group">
            <div className="flex items-center space-x-3 bg-gray-800/50 p-3 rounded-2xl border border-gray-700/50 group-focus-within:border-blue-500/50 transition">
              <MapPin className="text-gray-400 w-5 h-5 flex-shrink-0" />
              <div className="w-full">
                <input
                  type="text"
                  placeholder="Location (City, Area)"
                  value={filters.location}
                  onChange={handleLocationChange}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full bg-transparent outline-none text-white placeholder-gray-500 text-sm"
                />
              </div>
            </div>
            {/* Suggestions Dropdown */}
            {showSuggestions && locationSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-xl overflow-hidden z-50">
                {locationSuggestions.map((place) => (
                  <button
                    key={place.place_id}
                    onClick={() => selectLocation(place)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-700 text-sm text-gray-300 transition"
                  >
                    {place.display_name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Gender Preference */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 bg-gray-800/50 p-3 rounded-2xl border border-gray-700/50 hover:border-gray-600 transition">
              <User className="text-gray-400 w-5 h-5" />
              <select 
                className="w-full bg-transparent outline-none text-white text-sm appearance-none cursor-pointer"
                value={filters.gender}
                onChange={(e) => setFilters({...filters, gender: e.target.value})}
              >
                <option value="" className="bg-gray-800 text-gray-400">Gender</option>
                <option value="Male" className="bg-gray-800">Boys</option>
                <option value="Female" className="bg-gray-800">Girls</option>
                <option value="Unisex" className="bg-gray-800">Unisex</option>
              </select>
            </div>
          </div>

          {/* Occupancy */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 bg-gray-800/50 p-3 rounded-2xl border border-gray-700/50 hover:border-gray-600 transition">
              <Users className="text-gray-400 w-5 h-5" />
              <select 
                className="w-full bg-transparent outline-none text-white text-sm appearance-none cursor-pointer"
                value={filters.occupancy}
                onChange={(e) => setFilters({...filters, occupancy: e.target.value})}
              >
                <option value="" className="bg-gray-800 text-gray-400">Occupancy</option>
                <option value="Single" className="bg-gray-800">Single</option>
                <option value="Double" className="bg-gray-800">Double</option>
                <option value="Triple" className="bg-gray-800">Triple</option>
              </select>
            </div>
          </div>

          {/* Budget */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 bg-gray-800/50 p-3 rounded-2xl border border-gray-700/50 hover:border-gray-600 transition">
              <IndianRupee className="text-gray-400 w-5 h-5" />
              <select 
                className="w-full bg-transparent outline-none text-white text-sm appearance-none cursor-pointer"
                value={filters.budget}
                onChange={(e) => setFilters({...filters, budget: e.target.value})}
              >
                <option value="" className="bg-gray-800 text-gray-400">Budget</option>
                <option value="5000-10000" className="bg-gray-800">₹5k - ₹10k</option>
                <option value="10000-15000" className="bg-gray-800">₹10k - ₹15k</option>
                <option value="15000+" className="bg-gray-800">₹15k+</option>
              </select>
            </div>
          </div>

          {/* Search Button */}
          <div className="md:col-span-2">
            <button 
              onClick={handleSearch}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-2xl transition flex items-center justify-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>Search PG</span>
            </button>
          </div>

        </div>

        {/* Popular Cities */}
        <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-gray-400">
          <span className="mr-2">Popular:</span>
          {['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Ahmedabad'].map((city) => (
            <button 
              key={city}
              onClick={() => {
                setFilters(prev => ({...prev, location: city}));
                handleSearch();
              }}
              className="px-3 py-1 bg-gray-800 rounded-full hover:bg-gray-700 hover:text-white transition cursor-pointer"
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
