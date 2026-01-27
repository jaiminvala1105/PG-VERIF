import React, { useState } from 'react';
import { CheckCircle, Trash2, Edit, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

const getStartingPrice = (pricing, legacyPrice) => {
  if (!pricing) {
    return legacyPrice ? legacyPrice.toString() : "0"; 
  }
  
  const prices = [];
  if (pricing.ac) Object.values(pricing.ac).forEach(p => p && prices.push(parseFloat(p)));
  if (pricing.nonAc) Object.values(pricing.nonAc).forEach(p => p && prices.push(parseFloat(p)));
  
  if (prices.length === 0) return "N/A";
  
  const minPrice = Math.min(...prices);
  return minPrice.toLocaleString('en-IN');
};

const PricingTable = ({ pricing }) => {
  if (!pricing) return null;
  
  return (
    <div className="mt-4 bg-gray-800/50 rounded-xl p-3 text-xs border border-gray-700">
      <div className="grid grid-cols-3 gap-2 mb-2 pb-2 border-b border-gray-700 font-bold text-gray-300">
        <div className="text-left">Sharing</div>
        <div className="text-center">AC</div>
        <div className="text-right">Non-AC</div>
      </div>
      {['sharing2', 'sharing3', 'sharing4'].map((key) => (
        <div key={key} className="grid grid-cols-3 gap-2 py-1 text-gray-400">
          <div className="text-left capitalize">{key.replace('sharing', '')} Sharing</div>
          <div className="text-center font-medium text-emerald-400">
            {pricing.ac?.[key] ? `₹${pricing.ac[key]}` : '-'}
          </div>
          <div className="text-right font-medium text-gray-200">
            {pricing.nonAc?.[key] ? `₹${pricing.nonAc[key]}` : '-'}
          </div>
        </div>
      ))}
    </div>
  );
};

const AdminPGCard = ({ pg, onEdit, onDelete, onVerify }) => {
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  const visibleAmenities = showAllAmenities ? pg.amenities : pg.amenities?.slice(0, 3);
  const remainingCount = pg.amenities ? pg.amenities.length - 3 : 0;
  const startPrice = getStartingPrice(pg.pricing, pg.price);

  return (
    <div className="group bg-gray-900/60 backdrop-blur-md border border-gray-800 hover:border-indigo-500/50 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-600/10 hover:-translate-y-1">
      {/* Image Area */}
      <div className="relative h-56 overflow-hidden">
        {pg.image ? (
          <img src={pg.image} alt={pg.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-600">
            <MapPin size={48} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />
        
        <div className="absolute top-4 right-4 z-10">
          {pg.status === 'verified' ? (
            <span className="bg-emerald-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 backdrop-blur-md">
              <CheckCircle size={14} fill="currentColor" className="text-white" strokeWidth={3} /> VERIFIED
            </span>
          ) : (
            <span className="bg-amber-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg shadow-amber-500/20 flex items-center gap-1.5 backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" /> PENDING
            </span>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex-1 flex flex-col relative text-left">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-indigo-400 transition-colors" title={pg.name}>
            {pg.name || 'Unnamed PG'}
          </h3>
          
          <div className="flex items-start gap-2 text-gray-400 text-sm mb-3">
            <MapPin size={16} className="mt-0.5 text-indigo-500 shrink-0" />
            <span className="line-clamp-2 leading-relaxed">{pg.location || 'No location provided'}</span>
          </div>

          <div className="flex items-baseline gap-1 text-gray-200">
             <span className="text-xs text-gray-500 font-medium uppercase tracking-wide mr-1">Starts</span>
            <span className="text-2xl font-bold tracking-tight">
              ₹{startPrice}
            </span>
            <span className="text-sm text-gray-500 font-medium">/mo</span>
          </div>

          {pg.pricing && (
            <button 
              onClick={(e) => { e.stopPropagation(); setShowPricing(!showPricing); }}
              className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 mt-2 font-medium transition-colors"
            >
              {showPricing ? 'Hide Pricing' : 'View Breakdown'} 
              {showPricing ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          )}

          <div className={`overflow-hidden transition-all duration-300 ${showPricing ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
             <PricingTable pricing={pg.pricing} />
          </div>

        </div>

        {/* Amenities Tags */}
        <div className="flex flex-wrap gap-2 mb-6 min-h-[32px]">
          {visibleAmenities && visibleAmenities.map((amenity, index) => (
            <span key={index} className="text-xs font-medium bg-gray-800/80 text-gray-300 px-2.5 py-1 rounded-md border border-gray-700/50">
              {amenity}
            </span>
          ))}
          {pg.amenities && pg.amenities.length > 3 && (
            <button 
              onClick={(e) => { e.stopPropagation(); setShowAllAmenities(!showAllAmenities); }}
              className="text-xs font-medium bg-gray-800/50 text-gray-400 px-2 py-1 rounded-md hover:bg-gray-700 hover:text-white transition-colors"
            >
              {showAllAmenities ? "Show Less" : `+${remainingCount} more`}
            </button>
          )}
        </div>

        {/* Actions Footer */}
        <div className="mt-auto pt-5 border-t border-gray-800 flex justify-between items-center group-hover:border-indigo-500/20 transition-colors">
            <div className="flex gap-2">
              {pg.status !== 'verified' && (
                <button 
                  onClick={(e) => onVerify(pg.id, e)}
                  className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg text-sm font-medium transition-all"
                >
                  <CheckCircle size={16} /> Verify
                </button>
              )}
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => onEdit(pg)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
                title="Edit Details"
              >
                <Edit size={18} />
              </button>
              <button 
                onClick={(e) => onDelete(pg.id, e)}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                title="Delete Listing"
              >
                <Trash2 size={18} />
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPGCard;
