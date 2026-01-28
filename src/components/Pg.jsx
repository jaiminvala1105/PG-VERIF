import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { collection, getDocs, query, where } from "firebase/firestore";
import { __DB } from "../backend/firebaseConfig";
import MapComponent from "./MapComponent";
import PgCard from "./PgCard";

const Pg = () => {
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    gender: "",
    occupancy: "",
    budget: ""
  });
  const [filteredPgs, setFilteredPgs] = useState([]);
  const [activePgId, setActivePgId] = useState(null);

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
        setFilteredPgs(pgsData);
      } catch (error) {
        console.error("Error fetching PGs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPGs();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPgs(pgs);
    } else {
      const lower = searchTerm.toLowerCase();
      const filtered = pgs.filter(
        (pg) =>
          pg.name?.toLowerCase().includes(lower) ||
          pg.location?.toLowerCase().includes(lower)
      );
      setFilteredPgs(filtered);
    }
  }, [searchTerm, pgs]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pb-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center space-y-4 pt-8">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
            Find Your <span className="text-indigo-500">Perfect Stay</span>
          </h1>
          
          {/* Advanced Search Bar */}
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
                      placeholder="Enter Location, Landmark..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                   />
                </div>

                {/* Gender Dropdown */}
                <div className="w-full md:w-36">
                   <select 
                      value={filters.gender}
                      onChange={(e) => handleFilterChange('gender', e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-gray-50 dark:bg-gray-800 border-r-[16px] border-transparent outline-none text-gray-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-indigo-500/20"
                   >
                      <option value="">Gender</option>
                      <option value="Boys">Boys</option>
                      <option value="Girls">Girls</option>
                      <option value="Unisex">Unisex</option>
                   </select>
                </div>

                 {/* Occupancy Dropdown */}
                <div className="w-full md:w-40">
                   <select 
                      value={filters.occupancy}
                      onChange={(e) => handleFilterChange('occupancy', e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-gray-50 dark:bg-gray-800 border-r-[16px] border-transparent outline-none text-gray-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-indigo-500/20"
                   >
                      <option value="">Occupancy</option>
                      <option value="Single">Single</option>
                      <option value="Double">Double</option>
                      <option value="Triple">Triple</option>
                      <option value="Quadruple">Quadruple</option>
                   </select>
                </div>

                {/* Budget Dropdown */}
                 <div className="w-full md:w-40">
                   <select 
                      value={filters.budget}
                      onChange={(e) => handleFilterChange('budget', e.target.value)}
                      className="w-full h-12 px-4 rounded-xl bg-gray-50 dark:bg-gray-800 border-r-[16px] border-transparent outline-none text-gray-900 dark:text-white cursor-pointer focus:ring-2 focus:ring-indigo-500/20"
                   >
                      <option value="">Budget</option>
                      <option value="0-5000">₹0 - ₹5k</option>
                      <option value="5000-10000">₹5k - ₹10k</option>
                      <option value="10000-15000">₹10k - ₹15k</option>
                      <option value="15000+">₹15k+</option>
                   </select>
                </div>

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
                  </div>
                )}
            </div>

            {/* Right: Map View (Sticky) */}
            <div className="hidden lg:block w-2/5 h-[600px] sticky top-24">
               <MapComponent pgs={filteredPgs} activePgId={activePgId} />
            </div>

        </div>

      </div>
    </div>
  );
};

export default Pg;
