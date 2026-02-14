import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { Sliders, SortDesc } from "lucide-react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { __DB } from "../backend/firebaseConfig";
import MapComponent from "./MapComponent";
import PgCard from "./PgCard";
import AdvancedFilters from "./AdvancedFilters";
import ComparisonBar from "./ComparisonBar";
import { applyFilters, sortPGs, loadFiltersFromLocalStorage, getMaxPrice } from "../helper/filterUtils.js";

const Pg = () => {
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState(loadFiltersFromLocalStorage());
  const [filteredPgs, setFilteredPgs] = useState([]);
  const [activePgId, setActivePgId] = useState(null);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [maxPriceInData, setMaxPriceInData] = useState(25000);

  useEffect(() => {
    const fetchPGs = async () => {
      try {
        const q = query(collection(__DB, "pgs"), where("status", "==", "verified"));
        const querySnapshot = await getDocs(q);
        const pgsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPgs(pgsData);
        
        // Calculate max price from data
        const maxPrice = getMaxPrice(pgsData);
        setMaxPriceInData(maxPrice);
        
        // Apply initial filters
        applyAllFilters(pgsData, filters, sortBy);
      } catch (error) {
        console.error("Error fetching PGs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPGs();
  }, []);

  // Apply filters whenever pgs, filters, searchTerm, or sortBy changes
  useEffect(() => {
    applyAllFilters(pgs, { ...filters, searchTerm }, sortBy);
  }, [pgs, filters, searchTerm, sortBy]);

  const applyAllFilters = (pgList, filterObj, sort) => {
    // Apply filters
    let filtered = applyFilters(pgList, filterObj);
    
    // Apply sorting
    if (sort) {
      filtered = sortPGs(filtered, sort);
    }
    
    setFilteredPgs(filtered);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    const defaultFilters = {
      searchTerm: '',
      gender: '',
      occupancy: '',
      priceRange: [0, maxPriceInData],
      amenities: [],
      roomType: '',
      minRating: 0
    };
    setFilters(defaultFilters);
    setSearchTerm('');
    setSortBy('');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.gender) count++;
    if (filters.occupancy) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPriceInData) count++;
    if (filters.amenities.length > 0) count++;
    if (filters.roomType) count++;
    if (filters.minRating > 0) count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pb-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center space-y-4 pt-8">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
            Find Your <span className="text-indigo-500">Perfect Stay</span>
          </h1>
          
          {/* Search Bar with Filters */}
          <div className="max-w-5xl mx-auto mt-8 relative z-20">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-2 flex flex-col md:flex-row gap-2">
              
              {/* Location Input */}
              <div className="flex-1 relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMapMarkerAlt className="text-gray-400" />
                </div>
                <input 
                  type="text"
                  className="w-full h-12 pl-10 pr-4 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 transition-all outline-none"
                  placeholder="Search by location, name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Advanced Filters Button */}
              <button
                onClick={() => setShowFiltersModal(true)}
                className="h-12 px-6 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 relative"
              >
                <Sliders size={18} />
                Filters
                {getActiveFilterCount() > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center">
                    {getActiveFilterCount()}
                  </span>
                )}
              </button>

              {/* Search Button */}
              <button className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all active:scale-95 flex items-center justify-center gap-2">
                <FaSearch /> Search
              </button>
            </div>
          </div>

          {/* Popular Cities */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <span className="text-gray-500 text-sm font-medium">Popular Cities:</span>
            {['Kota', 'Delhi', 'Mumbai', 'Bangalore', 'Pune', 'Ahmedabad'].map((city) => (
              <button 
                key={city}
                className="px-4 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm hover:border-indigo-500 hover:text-indigo-500 transition-colors shadow-sm"
                onClick={() => setSearchTerm(city)}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Results Header with Sort and Clear */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {loading ? 'Loading...' : `${filteredPgs.length} PG${filteredPgs.length !== 1 ? 's' : ''} Found`}
            </h2>
            {getActiveFilterCount() > 0 && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-indigo-400 hover:text-indigo-300 mt-1 flex items-center gap-1"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <SortDesc className="text-gray-400" size={20} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="">Sort By: Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating-high">Rating: High to Low</option>
              <option value="most-reviewed">Most Reviewed</option>
              <option value="recently-added">Recently Added</option>
            </select>
          </div>
        </div>

        {/* Active Filter Tags */}
        {getActiveFilterCount() > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {filters.gender && (
              <span className="px-3 py-1 bg-indigo-600/20 text-indigo-400 rounded-full text-sm border border-indigo-600/30 flex items-center gap-2">
                Gender: {filters.gender}
                <button onClick={() => setFilters({...filters, gender: ''})} className="hover:text-indigo-200">×</button>
              </span>
            )}
            {filters.occupancy && (
              <span className="px-3 py-1 bg-indigo-600/20 text-indigo-400 rounded-full text-sm border border-indigo-600/30 flex items-center gap-2">
                {filters.occupancy}
                <button onClick={() => setFilters({...filters, occupancy: ''})} className="hover:text-indigo-200">×</button>
              </span>
            )}
            {filters.roomType && (
              <span className="px-3 py-1 bg-indigo-600/20 text-indigo-400 rounded-full text-sm border border-indigo-600/30 flex items-center gap-2">
                {filters.roomType === 'ac' ? 'AC' : 'Non-AC'}
                <button onClick={() => setFilters({...filters, roomType: ''})} className="hover:text-indigo-200">×</button>
              </span>
            )}
            {filters.minRating > 0 && (
              <span className="px-3 py-1 bg-yellow-600/20 text-yellow-400 rounded-full text-sm border border-yellow-600/30 flex items-center gap-2">
                {filters.minRating}★ & above
                <button onClick={() => setFilters({...filters, minRating: 0})} className="hover:text-yellow-200">×</button>
              </span>
            )}
            {filters.amenities.map(amenity => (
              <span key={amenity} className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-sm border border-green-600/30 flex items-center gap-2">
                {amenity}
                <button onClick={() => setFilters({...filters, amenities: filters.amenities.filter(a => a !== amenity)})} className="hover:text-green-200">×</button>
              </span>
            ))}
          </div>
        )}

        {/* Content Area: Split Screen */}
        <div className="flex flex-col lg:flex-row gap-6 mt-8">
          
          {/* Left: List View */}
          <div className="w-full lg:w-3/5 space-y-6">
            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-64 bg-gray-200 dark:bg-gray-900 rounded-lg animate-pulse w-full"></div>
                ))}
              </div>
            ) : filteredPgs.length > 0 ? (
              filteredPgs.map((pg) => (
                <PgCard 
                  key={pg.id} 
                  pg={pg} 
                  onHover={setActivePgId}
                />
              ))
            ) : (
              <div className="text-center py-20">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Properties Found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your filters or search criteria</p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

          {/* Right: Map View (Sticky) */}
          <div className="hidden lg:block w-2/5 h-[600px] sticky top-24">
            <MapComponent pgs={filteredPgs} activePgId={activePgId} />
          </div>
        </div>
      </div>

      {/* Advanced Filters Modal */}
      <AdvancedFilters
        isOpen={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
        onApplyFilters={handleApplyFilters}
        maxPrice={maxPriceInData}
      />

      {/* Comparison Bar */}
      <ComparisonBar />
    </div>
  );
};

export default Pg;
