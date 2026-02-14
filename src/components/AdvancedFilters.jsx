import React, { useState, useEffect } from 'react';
import { X, Sliders, Star, Check } from 'lucide-react';
import { loadFiltersFromLocalStorage, saveFiltersToLocalStorage, clearFiltersFromLocalStorage } from '../helper/filterUtils.js';

const AdvancedFilters = ({ isOpen, onClose, onApplyFilters, maxPrice = 25000 }) => {
  const [filters, setFilters] = useState(loadFiltersFromLocalStorage());

  const commonAmenities = [
    'WiFi',
    'Food/Meals',
    'AC',
    'Laundry',
    'Parking',
    'Gym',
    'Security',
    'Housekeeping',
    'Water Supply',
    'Power Backup'
  ];

  const handlePriceChange = (index, value) => {
    const newRange = [...filters.priceRange];
    newRange[index] = parseInt(value);
    setFilters(prev => ({ ...prev, priceRange: newRange }));
  };

  const handleAmenityToggle = (amenity) => {
    setFilters(prev => {
      const amenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities };
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    saveFiltersToLocalStorage(filters);
    onApplyFilters(filters);
    onClose();
  };

  const handleClearAll = () => {
    const defaultFilters = {
      searchTerm: '',
      gender: '',
      occupancy: '',
      priceRange: [0, maxPrice],
      amenities: [],
      roomType: '',
      minRating: 0
    };
    setFilters(defaultFilters);
    clearFiltersFromLocalStorage();
    onApplyFilters(defaultFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.gender) count++;
    if (filters.occupancy) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice) count++;
    if (filters.amenities.length > 0) count += filters.amenities.length;
    if (filters.roomType) count++;
    if (filters.minRating > 0) count++;
    return count;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div 
        className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 p-6 border-b border-gray-800 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sliders className="text-indigo-500" />
              Advanced Filters
              {getActiveFilterCount() > 0 && (
                <span className="text-xs bg-indigo-600 text-white px-2 py-1 rounded-full">
                  {getActiveFilterCount()} active
                </span>
              )}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors bg-gray-800 rounded-full p-2"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Filters Content */}
        <div className="p-6 space-y-6">
          
          {/* Price Range */}
          <div>
            <label className="block text-white font-semibold mb-3">Price Range (per month)</label>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-gray-400 text-xs mb-1 block">Min</label>
                  <input
                    type="number"
                    value={filters.priceRange[0]}
                    onChange={(e) => handlePriceChange(0, e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    min="0"
                    max={filters.priceRange[1]}
                  />
                </div>
                <span className="text-gray-500 mt-6">—</span>
                <div className="flex-1">
                  <label className="text-gray-400 text-xs mb-1 block">Max</label>
                  <input
                    type="number"
                    value={filters.priceRange[1]}
                    onChange={(e) => handlePriceChange(1, e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    min={filters.priceRange[0]}
                    max={maxPrice}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>₹{filters.priceRange[0].toLocaleString('en-IN')}</span>
                <span>₹{filters.priceRange[1].toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-white font-semibold mb-3">Gender Preference</label>
            <div className="grid grid-cols-3 gap-2">
              {['Boys', 'Girls', 'Unisex'].map(gender => (
                <button
                  key={gender}
                  onClick={() => handleFilterChange('gender', filters.gender === gender ? '' : gender)}
                  className={`py-2 px-4 rounded-lg font-medium transition-all ${
                    filters.gender === gender
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                  }`}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>

          {/* Occupancy */}
          <div>
            <label className="block text-white font-semibold mb-3">Occupancy Type</label>
            <div className="grid grid-cols-2 gap-2">
              {['Single', 'Double', 'Triple', 'Quadruple'].map(type => (
                <button
                  key={type}
                  onClick={() => handleFilterChange('occupancy', filters.occupancy === type ? '' : type)}
                  className={`py-2 px-4 rounded-lg font-medium transition-all ${
                    filters.occupancy === type
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Room Type */}
          <div>
            <label className="block text-white font-semibold mb-3">Room Type</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'ac', label: 'AC' },
                { key: 'nonAc', label: 'Non-AC' }
              ].map(type => (
                <button
                  key={type.key}
                  onClick={() => handleFilterChange('roomType', filters.roomType === type.key ? '' : type.key)}
                  className={`py-2 px-4 rounded-lg font-medium transition-all ${
                    filters.roomType === type.key
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-white font-semibold mb-3">
              Amenities {filters.amenities.length > 0 && `(${filters.amenities.length} selected)`}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {commonAmenities.map(amenity => (
                <button
                  key={amenity}
                  onClick={() => handleAmenityToggle(amenity)}
                  className={`py-2 px-4 rounded-lg font-medium transition-all text-sm flex items-center justify-between ${
                    filters.amenities.includes(amenity)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                  }`}
                >
                  <span>{amenity}</span>
                  {filters.amenities.includes(amenity) && <Check size={16} />}
                </button>
              ))}
            </div>
          </div>

          {/* Minimum Rating */}
          <div>
            <label className="block text-white font-semibold mb-3">Minimum Rating</label>
            <div className="grid grid-cols-5 gap-2">
              {[0, 1, 2, 3, 4].map(rating => (
                <button
                  key={rating}
                  onClick={() => handleFilterChange('minRating', filters.minRating === rating ? 0 : rating)}
                  className={`py-2 px-3 rounded-lg font-medium transition-all text-sm flex items-center justify-center gap-1 ${
                    filters.minRating === rating && rating > 0
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                  }`}
                >
                  {rating === 0 ? 'Any' : (
                    <>
                      <Star size={14} fill={filters.minRating === rating ? 'white' : 'none'} />
                      {rating}+
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-gray-900 p-6 border-t border-gray-800 flex gap-3">
          <button
            onClick={handleClearAll}
            className="flex-1 px-6 py-3 border border-gray-700 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors font-semibold"
          >
            Clear All
          </button>
          <button
            onClick={handleApply}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;
