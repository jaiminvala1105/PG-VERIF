import React, { useState, useEffect } from 'react';
import { X, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const PGFormModal = ({ isOpen, onClose, onSubmit, initialData, isEditing }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    latitude: '',
    longitude: '',
    amenities: '',
    image: '',
    gender: 'Boys',
    pricing: {
      ac: { sharing2: '', sharing3: '', sharing4: '' },
      nonAc: { sharing2: '', sharing3: '', sharing4: '' }
    }
  });

  const [activeTab, setActiveTab] = useState('ac');

  useEffect(() => {
    if (initialData) {
      // Handle legacy price string parsing
      let pricingData = {
        ac: { sharing2: '', sharing3: '', sharing4: '' },
        nonAc: { sharing2: '', sharing3: '', sharing4: '' }
      };

      if (initialData.pricing) {
        pricingData = initialData.pricing;
      } else if (initialData.price && typeof initialData.price === 'string') {
        pricingData.ac.sharing2 = initialData.price.replace(/[^0-9]/g, '');
      }

      setFormData({
        name: initialData.name || '',
        location: initialData.location || '',
        latitude: initialData.locationCoords?.lat || '',
        longitude: initialData.locationCoords?.lng || '',
        amenities: initialData.amenities ? initialData.amenities.join(', ') : '',
        image: initialData.image || '',
        gender: initialData.gender || 'Boys',
        pricing: pricingData
      });
    } else {
      setFormData({
        name: '',
        location: '',
        latitude: '',
        longitude: '',
        amenities: '',
        image: '',
        gender: 'Boys',
        pricing: {
          ac: { sharing2: '', sharing3: '', sharing4: '' },
          nonAc: { sharing2: '', sharing3: '', sharing4: '' }
        }
      });
    }
  }, [initialData, isOpen]);

  const handleDetectLocation = async () => {
    if (!formData.location) {
      toast.error("Please enter a location address first");
      return;
    }
    
    const toastId = toast.loading("Detecting location...");
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.location)}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        setFormData(prev => ({
          ...prev,
          latitude: data[0].lat,
          longitude: data[0].lon
        }));
        toast.success("Location coordinates found!", { id: toastId });
      } else {
        toast.error("Could not find location coordinates on map. Try a more specific city/area.", { id: toastId });
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      toast.error("Failed to detect location.", { id: toastId });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (category, sharing, value) => {
    // Validate number and non-negative
    if (value && (isNaN(value) || parseFloat(value) < 0)) return;

    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [category]: {
          ...prev.pricing[category],
          [sharing]: value
        }
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clean up pricing - remove empty values
    const cleanPricing = {};
    
    ['ac', 'nonAc'].forEach(category => {
      const categoryPrices = {};
      let hasValidPrice = false;
      
      Object.keys(formData.pricing[category]).forEach(sharingKey => {
        const price = formData.pricing[category][sharingKey];
        // Only include if price exists and is not empty string or '0'
        if (price && price !== '' && price !== '0') {
          categoryPrices[sharingKey] = price;
          hasValidPrice = true;
        }
      });
      
      // Only include category if it has at least one valid price
      if (hasValidPrice) {
        cleanPricing[category] = categoryPrices;
      }
    });
    
    // Convert amenities string back to array
    const submittedData = {
      ...formData,
      amenities: formData.amenities.split(',').map(item => item.trim()).filter(Boolean),
      locationCoords: {
         lat: parseFloat(formData.latitude) || 0,
         lng: parseFloat(formData.longitude) || 0
      },
      pricing: cleanPricing
    };
    
    // Remove separate lat/lng fields
    delete submittedData.latitude;
    delete submittedData.longitude;
    
    console.log('💾 Cleaned data being saved:', submittedData);
    
    onSubmit(submittedData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-6">
            {isEditing ? 'Edit PG Details' : 'Add New PG'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">PG Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="Ex: Sky High Residency"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all cursor-pointer"
              >
                <option value="Boys">Boys</option>
                <option value="Girls">Girls</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Location Address</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                   <input
                     type="text"
                     name="location"
                     value={formData.location}
                     onChange={handleChange}
                     required
                     className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-4 pr-10 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                     placeholder="Ex: Koramangala, Bangalore"
                   />
                   {formData.latitude && (
                     <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" title="Location Verified on Map">
                        ✓
                     </span>
                   )}
                </div>
                <button 
                  type="button"
                  onClick={handleDetectLocation}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-indigo-500/20"
                  title="Auto-detect Map Location"
                >
                   <MapPin size={20} />
                </button>
              </div>
              {formData.latitude && (
                  <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                    <MapPin size={12} /> Map Location successfully linked.
                  </p>
              )}
            </div>

            {/* Pricing Section */}
            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
              <label className="block text-sm font-medium text-gray-300 mb-3">Pricing Structure (₹/mo)</label>
              
              {/* Tabs */}
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('ac')}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'ac' 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                      : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  With AC
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('nonAc')}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === 'nonAc' 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                      : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  Without AC
                </button>
              </div>

              {/* Inputs */}
              <div className="space-y-3">
                {['sharing2', 'sharing3', 'sharing4'].map((sharing) => (
                  <div key={sharing} className="flex items-center justify-between gap-4">
                    <span className="text-gray-400 text-sm font-medium capitalize">
                      {sharing.replace('sharing', '')} Sharing
                    </span>
                    <input
                      type="text"
                      value={formData.pricing[activeTab][sharing]}
                      onChange={(e) => handlePriceChange(activeTab, sharing, e.target.value)}
                      className="w-32 bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-white text-right focus:ring-1 focus:ring-indigo-500 outline-none"
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Amenities (Comma separated)</label>
              <textarea
                name="amenities"
                value={formData.amenities}
                onChange={handleChange}
                rows="3"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="Ex: WiFi, AC, Food, Gym"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Image URL</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-lg shadow-indigo-500/20 transition-all"
              >
                {isEditing ? 'Save Changes' : 'Create PG'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PGFormModal;
