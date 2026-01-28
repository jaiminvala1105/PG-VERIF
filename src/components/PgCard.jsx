import React, { useState, useContext } from "react";
import {
  FaUserFriends,
  FaBed,
  FaBath,
  FaWind,
  FaDirections,
  FaUser,
  FaGraduationCap
} from "react-icons/fa";
import { Heart } from "lucide-react";
import ScheduleVisitModal from "./ScheduleVisitModal";
import PGDetailsModal from "./PGDetailsModal";
import { FavoritesContext } from "../context/FavoritesContext";

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
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  const { toggleSave, isSaved } = useContext(FavoritesContext);
  const saved = isSaved(pg.id);

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

  const handleToggleSave = (e) => {
    e.stopPropagation();
    toggleSave(pg.id);
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
        
        {/* Heart Icon - Save to Favorites */}
        <button
          onClick={handleToggleSave}
          className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 z-20 group/heart"
          aria-label={saved ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`w-5 h-5 transition-all duration-200 ${
              saved 
                ? "fill-orange-500 text-orange-500" 
                : "text-gray-600 group-hover/heart:text-orange-500"
            }`}
          />
        </button>
        
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
                <h3 
                  className="text-xl md:text-2xl font-bold text-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer"
                  onClick={() => setIsDetailsModalOpen(true)}
                >
                    {pg.name}
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
                <FaWind className="opacity-50" /> Non-AC
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
    <PGDetailsModal
      isOpen={isDetailsModalOpen}
      onClose={() => setIsDetailsModalOpen(false)}
      pg={pg}
    />
    </>
  );
};

export default PgCard;
