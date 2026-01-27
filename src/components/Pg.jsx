import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaSearch,
  FaFilter,
  FaUserFriends,
  FaBed,
  FaBath,
  FaWind,
  FaDirections,
  FaPhoneAlt,
  FaCalendarCheck,
  FaUser,
  FaGraduationCap
} from "react-icons/fa";
import { collection, getDocs, query, where } from "firebase/firestore";
import { __DB } from "../backend/firebaseConfig";
import ScheduleVisitModal from "./ScheduleVisitModal";
import MapComponent from "./MapComponent";

// Helper to calculate starting price
const getStartingPrice = (pricing, legacyPrice) => {
  if (!pricing) {
    return legacyPrice ? legacyPrice.toString() : "0";
  }

  const prices = [];
  if (pricing.ac) Object.values(pricing.ac).forEach((p) => p && prices.push(parseFloat(p)));
  if (pricing.nonAc) Object.values(pricing.nonAc).forEach((p) => p && prices.push(parseFloat(p)));

  if (prices.length === 0) return "N/A";

  const minPrice = Math.min(...prices);
  return minPrice.toLocaleString("en-IN");
};

const PgCard = ({ pg, onHover }) => {
  const startPrice = getStartingPrice(pg.pricing, pg.price);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [visitModalTab, setVisitModalTab] = useState('visit');

  const openModal = (tab) => {
    setVisitModalTab(tab);
    setIsVisitModalOpen(true);
  };

  // Extract sharing types available
  const getSharingTypes = () => {
    const types = new Set();
    if (pg.pricing) {
      ['ac', 'nonAc'].forEach(cat => {
         if(pg.pricing[cat]) {
            Object.keys(pg.pricing[cat]).forEach(key => {
               if(pg.pricing[cat][key]) {
                  if(key === 'sharing2') types.add('Double');
                  if(key === 'sharing3') types.add('Triple');
                  if(key === 'sharing4') types.add('Quadruple');
               }
            })
         }
      })
    }
    return Array.from(types);
  };

  const sharingTypes = getSharingTypes();

  const handleViewDirections = () => {
    // Check if screen is large (Desktop) where map is visible
    const isDesktop = window.innerWidth >= 1024;

    if (isDesktop && onHover) {
       // On Desktop, just focus the map on the right
       onHover(pg.id);
    } else {
       // On Mobile (or if onHover missing), open Google Maps externally
       if (pg.locationCoords && pg.locationCoords.lat && pg.locationCoords.lng) {
         window.open(`https://www.google.com/maps/dir/?api=1&destination=${pg.locationCoords.lat},${pg.locationCoords.lng}`, '_blank');
       } else {
         window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(pg.location || pg.name)}`, '_blank');
       }
    }
  };

  return (
    <>
    <div 
      className="group bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row h-full md:h-72"
      onMouseEnter={() => onHover && onHover(pg.id)}
    >
      {/* Image Section - Left (40% width on Desktop) */}
      <div className="relative md:w-2/5 h-64 md:h-full shrink-0">
        <img
          src={
            pg.image ||
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop"
          }
          alt={pg.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Preferred Badge */}
        <div className="absolute top-4 left-0 bg-amber-600 text-white text-xs font-semibold px-3 py-1 rounded-r-md shadow-md flex items-center gap-1 z-10">
           <FaGraduationCap /> Preferred By Students
        </div>

        {/* Visiting Banner */}
        <div className="absolute bottom-0 inset-x-0 bg-emerald-800 text-white text-center py-2 text-sm font-medium flex items-center justify-center gap-2">
            <FaUserFriends /> 1 Person Visiting Today
        </div>
      </div>

      {/* Content Section - Right (60% width on Desktop) */}
      <div className="p-5 flex flex-col justify-between flex-grow md:w-3/5">
        
        {/* Header: Name & Gender */}
        <div className="flex justify-between items-start mb-2">
            <div>
                <h3 className="text-xl md:text-2xl font-bold text-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer">
                    <Link to={`/pg/${pg.id}`}>{pg.name}</Link>
                </h3>
                <div className="text-gray-500 text-sm mt-1 flex items-center gap-1">
                    {pg.location}
                </div>
            </div>
            
            <div className="flex items-center gap-1 bg-gray-800 text-gray-200 px-3 py-1 rounded-full text-xs font-medium border border-gray-700">
                <span>{pg.gender || "Unisex"}</span> <FaUser size={10} />
            </div>
        </div>

        {/* View Directions Link */}
        <div className="flex justify-end mb-4">
             <button 
                onClick={handleViewDirections}
                className="text-indigo-400 text-sm font-medium hover:text-indigo-500 flex items-center gap-1 transition-colors"
             >
                <FaDirections /> View Directions
             </button>
        </div>

        {/* Amenities Icons */}
        <div className="flex flex-wrap gap-2 mb-3">
             <span className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-gray-900 border border-gray-700 text-indigo-400 text-xs font-medium">
                <FaWind /> AC
             </span>
             <span className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-gray-900 border border-gray-700 text-indigo-400 text-xs font-medium">
                <FaBath /> Attached Washroom
             </span>
        </div>

        {/* Sharing Types */}
        <div className="flex flex-wrap gap-3 mb-4 text-gray-400 text-sm">
            {sharingTypes.length > 0 ? sharingTypes.map((type, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                    <FaBed className="text-gray-600"/> {type}
                </div>
            )) : <span className="text-xs">Multiple Sharing Options Available</span>}
        </div>

        {/* Footer: Price & Actions */}
        <div className="flex flex-col xl:flex-row items-center justify-between border-t border-gray-800 pt-4 mt-auto gap-4">
            <div className="text-center xl:text-left">
                <p className="text-gray-400 text-xs mb-0.5">Starts from</p>
                <p className="text-xl font-bold text-white">₹{startPrice}<span className="text-xs text-gray-500 font-normal">/mo*</span></p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full xl:w-auto">
                <button 
                  onClick={() => openModal('visit')}
                  className="flex-1 xl:flex-none px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-md transition-colors uppercase tracking-wide whitespace-nowrap"
                >
                    Schedule a Visit
                </button>
                <button 
                  onClick={() => openModal('callback')}
                  className="flex-1 xl:flex-none px-3 py-2 border border-indigo-600 text-indigo-400 hover:bg-indigo-900/30 text-xs font-bold rounded-md transition-colors uppercase tracking-wide whitespace-nowrap"
                >
                    Request a Callback
                </button>
            </div>
        </div>

      </div>
    </div>
    <ScheduleVisitModal 
      isOpen={isVisitModalOpen} 
      onClose={() => setIsVisitModalOpen(false)} 
      pgName={pg.name}
      initialTab={visitModalTab}
    />
    </>
  );
};

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
