import React from 'react';
import { X, MapPin, Users, IndianRupee, Wifi, UtensilsCrossed, Dumbbell, Wind, Droplets, Zap, Home } from 'lucide-react';

const PGDetailsModal = ({ isOpen, onClose, pg }) => {
  const [selectedPricingTab, setSelectedPricingTab] = React.useState('ac');
  
  // Set default tab when modal opens or pg changes
  React.useEffect(() => {
    if (pg?.pricing) {
      const hasAC = pg.pricing.ac && Object.values(pg.pricing.ac).some(p => p && p !== '' && p !== '0');
      const hasNonAC = pg.pricing.nonAc && Object.values(pg.pricing.nonAc).some(p => p && p !== '' && p !== '0');
      
      if (hasAC) {
        setSelectedPricingTab('ac');
      } else if (hasNonAC) {
        setSelectedPricingTab('nonAc');
      }
    }
  }, [pg]);
  
  if (!isOpen || !pg) return null;

  // Get pricing details for selected tab
  const getPricingDisplay = () => {
    if (!pg.pricing) return null;
    
    const categories = [
      { key: 'ac', label: 'With AC', icon: <Wind className="w-4 h-4" /> },
      { key: 'nonAc', label: 'Without AC', icon: <Home className="w-4 h-4" /> }
    ];

    const sharingTypes = [
      { key: 'sharing2', label: '2 Sharing' },
      { key: 'sharing3', label: '3 Sharing' },
      { key: 'sharing4', label: '4 Sharing' }
    ];

    // Check which categories have valid prices
    const hasAC = pg.pricing.ac && Object.values(pg.pricing.ac).some(p => p && p !== '' && p !== '0');
    const hasNonAC = pg.pricing.nonAc && Object.values(pg.pricing.nonAc).some(p => p && p !== '' && p !== '0');

    return (
      <div>
        {/* Tab Buttons - Always show both */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setSelectedPricingTab('ac')}
            className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
              selectedPricingTab === 'ac'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700'
            }`}
          >
            <Wind className="w-4 h-4" />
            With AC
          </button>
          <button
            onClick={() => setSelectedPricingTab('nonAc')}
            className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
              selectedPricingTab === 'nonAc'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700'
            }`}
          >
            <Home className="w-4 h-4" />
            Without AC
          </button>
        </div>

        {/* Selected Pricing Display */}
        {categories.map(category => {
          if (category.key !== selectedPricingTab) return null;
          
          const prices = pg.pricing[category.key];
          const hasPrices = prices && Object.values(prices).some(p => p && p !== '' && p !== '0');
          
          // If no prices for this category, show a message
          if (!hasPrices) {
            return (
              <div key={category.key} className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/50 text-center">
                <p className="text-gray-400 text-sm">No pricing available for this option</p>
              </div>
            );
          }

          return (
            <div key={category.key} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
              <div className="grid grid-cols-3 gap-3">
                {sharingTypes.map(sharing => {
                  const price = prices[sharing.key];
                  if (!price || price === '' || price === '0') return null;
                  return (
                    <div key={sharing.key} className="bg-gray-900 rounded-lg p-4 text-center border border-gray-700/50 hover:border-indigo-500/50 transition-colors">
                      <p className="text-xs text-gray-400 mb-2">{sharing.label}</p>
                      <p className="text-xl font-bold text-indigo-400">₹{parseInt(price).toLocaleString('en-IN')}</p>
                      <p className="text-[10px] text-gray-500 mt-1">per month</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Get amenities icons
  const getAmenityIcon = (amenity) => {
    const lower = amenity.toLowerCase();
    if (lower.includes('wifi')) return <Wifi className="w-4 h-4" />;
    if (lower.includes('food') || lower.includes('meal')) return <UtensilsCrossed className="w-4 h-4" />;
    if (lower.includes('gym')) return <Dumbbell className="w-4 h-4" />;
    if (lower.includes('ac')) return <Wind className="w-4 h-4" />;
    if (lower.includes('water')) return <Droplets className="w-4 h-4" />;
    return <Zap className="w-4 h-4" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div 
        className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white transition-colors bg-gray-800 rounded-full p-2"
        >
          <X size={24} />
        </button>

        {/* Image Header */}
        <div className="relative h-48 sm:h-56 overflow-hidden rounded-t-2xl">
          <img
            src={pg.image || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop"}
            alt={pg.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
          
          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h2 className="text-2xl font-bold text-white mb-2">{pg.name}</h2>
            <div className="flex items-center text-gray-300">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{pg.location}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          
          {/* Pricing Section */}
          {pg.pricing && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-indigo-400" />
                Pricing Details
              </h3>
              {getPricingDisplay()}
            </div>
          )}

          {/* Amenities Section */}
          {pg.amenities && pg.amenities.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-4">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {pg.amenities.map((amenity, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-2 bg-gray-800 text-gray-300 px-3 py-2 rounded-lg text-sm border border-gray-700"
                  >
                    {getAmenityIcon(amenity)}
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Location Details */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-4">Location Information</h3>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-indigo-400 mt-1" />
                <div>
                  <p className="text-gray-300 mb-2">{pg.location}</p>
                  {pg.locationCoords?.lat && pg.locationCoords?.lng && (
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>Lat: {pg.locationCoords.lat}</span>
                      <span>Lng: {pg.locationCoords.lng}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Gender & Status */}
          <div className="flex flex-wrap gap-4 mb-6">
            {pg.gender && (
              <div className="bg-gray-800 rounded-lg px-4 py-2 border border-gray-700">
                <p className="text-xs text-gray-400">Gender</p>
                <p className="text-white font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {pg.gender}
                </p>
              </div>
            )}
            {pg.status && (
              <div className="bg-gray-800 rounded-lg px-4 py-2 border border-gray-700">
                <p className="text-xs text-gray-400">Status</p>
                <p className={`font-semibold ${pg.status === 'verified' ? 'text-green-400' : 'text-yellow-400'}`}>
                  {pg.status.charAt(0).toUpperCase() + pg.status.slice(1)}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-800">
            <button
              onClick={() => {
                if (pg.locationCoords?.lat && pg.locationCoords?.lng) {
                  window.open(`https://www.google.com/maps/dir/?api=1&destination=${pg.locationCoords.lat},${pg.locationCoords.lng}`, '_blank');
                } else {
                  window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pg.location)}`, '_blank');
                }
              }}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              Get Directions
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-700 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PGDetailsModal;
