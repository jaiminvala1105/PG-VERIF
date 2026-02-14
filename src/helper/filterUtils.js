/**
 * Apply all active filters to PG list
 * @param {Array} pgs - Array of PG objects
 * @param {Object} filters - Filter object containing all active filters
 * @returns {Array} - Filtered PG array
 */
export const applyFilters = (pgs, filters) => {
  if (!pgs || pgs.length === 0) return [];

  let filtered = [...pgs];

  // Price Range Filter
  if (filters.priceRange) {
    const [min, max] = filters.priceRange;
    filtered = filtered.filter(pg => {
      const minPrice = getMinPrice(pg.pricing, pg.price);
      return minPrice >= min && minPrice <= max;
    });
  }

  // Gender Filter
  if (filters.gender && filters.gender !== '') {
    filtered = filtered.filter(pg => {
      return pg.gender?.toLowerCase() === filters.gender.toLowerCase();
    });
  }

  // Occupancy Filter
  if (filters.occupancy && filters.occupancy !== '') {
    filtered = filtered.filter(pg => {
      return matchesOccupancy(pg, filters.occupancy);
    });
  }

  // Amenities Filter (must have ALL selected amenities)
  if (filters.amenities && filters.amenities.length > 0) {
    filtered = filtered.filter(pg => {
      return matchesAmenities(pg, filters.amenities);
    });
  }

  // Room Type Filter (AC/Non-AC)
  if (filters.roomType && filters.roomType !== '') {
    filtered = filtered.filter(pg => {
      return hasRoomType(pg, filters.roomType);
    });
  }

  // Rating Filter
  if (filters.minRating && filters.minRating > 0) {
    filtered = filtered.filter(pg => {
      return pg.ratings && pg.ratings.average >= filters.minRating;
    });
  }

  // Search Term (name and location)
  if (filters.searchTerm && filters.searchTerm.trim() !== '') {
    const searchLower = filters.searchTerm.toLowerCase();
    filtered = filtered.filter(pg => {
      return (
        pg.name?.toLowerCase().includes(searchLower) ||
        pg.location?.toLowerCase().includes(searchLower)
      );
    });
  }

  return filtered;
};

/**
 * Sort PG array by selected criteria
 */
export const sortPGs = (pgs, sortBy) => {
  if (!pgs || pgs.length === 0) return [];
  
  const sorted = [...pgs];

  switch (sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => {
        const priceA = getMinPrice(a.pricing, a.price);
        const priceB = getMinPrice(b.pricing, b.price);
        return priceA - priceB;
      });
    
    case 'price-high':
      return sorted.sort((a, b) => {
        const priceA = getMinPrice(a.pricing, a.price);
        const priceB = getMinPrice(b.pricing, b.price);
        return priceB - priceA;
      });
    
    case 'rating-high':
      return sorted.sort((a, b) => {
        const ratingA = a.ratings?.average || 0;
        const ratingB = b.ratings?.average || 0;
        return ratingB - ratingA;
      });
    
    case 'most-reviewed':
      return sorted.sort((a, b) => {
        const countA = a.ratings?.totalReviews || 0;
        const countB = b.ratings?.totalReviews || 0;
        return countB - countA;
      });
    
    case 'recently-added':
      return sorted.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB - dateA;
      });
    
    default:
      return sorted;
  }
};

/**
 * Extract minimum price from pricing object or legacy price
 */
export const getMinPrice = (pricing, legacyPrice) => {
  if (!pricing) {
    return legacyPrice ? parseFloat(legacyPrice) : 0;
  }

  const prices = [];
  if (pricing.ac) Object.values(pricing.ac).forEach(p => p && prices.push(parseFloat(p)));
  if (pricing.nonAc) Object.values(pricing.nonAc).forEach(p => p && prices.push(parseFloat(p)));

  if (prices.length === 0) return legacyPrice ? parseFloat(legacyPrice) : 0;

  return Math.min(...prices);
};

/**
 * Check if PG has required amenities
 */
export const matchesAmenities = (pg, selectedAmenities) => {
  if (!pg.amenities || pg.amenities.length === 0) return false;
  
  const pgAmenitiesLower = pg.amenities.map(a => a.toLowerCase());
  
  return selectedAmenities.every(selected => {
    return pgAmenitiesLower.some(pgAmenity => 
      pgAmenity.includes(selected.toLowerCase())
    );
  });
};

/**
 * Check if PG matches occupancy type
 */
export const matchesOccupancy = (pg, occupancy) => {
  if (!pg.pricing) return false;

  const occupancyMap = {
    'Single': 'sharing1',
    'Double': 'sharing2',
    'Triple': 'sharing3',
    'Quadruple': 'sharing4'
  };

  const key = occupancyMap[occupancy];
  if (!key) return false;

  // Check if this sharing type exists in either AC or Non-AC
  const hasInAC = pg.pricing.ac && pg.pricing.ac[key] && pg.pricing.ac[key] !== '' && pg.pricing.ac[key] !== '0';
  const hasInNonAC = pg.pricing.nonAc && pg.pricing.nonAc[key] && pg.pricing.nonAc[key] !== '' && pg.pricing.nonAc[key] !== '0';

  return hasInAC || hasInNonAC;
};

/**
 * Check if PG has specific room type
 */
export const hasRoomType = (pg, roomType) => {
  if (!pg.pricing) return false;

  const prices = pg.pricing[roomType];
  if (!prices) return false;

  // Check if any price exists for this room type
  return Object.values(prices).some(p => p && p !== '' && p !== '0');
};

/**
 * Get max price from all PGs for slider range
 */
export const getMaxPrice = (pgs) => {
  if (!pgs || pgs.length === 0) return 25000;

  const prices = pgs.map(pg => getMinPrice(pg.pricing, pg.price));
  return Math.max(...prices, 25000);
};

/**
 * Save filters to localStorage
 */
export const saveFiltersToLocalStorage = (filters) => {
  try {
    localStorage.setItem('pgVerifyFilters', JSON.stringify(filters));
  } catch (error) {
    console.error('Error saving filters to localStorage:', error);
  }
};

/**
 * Load filters from localStorage
 */
export const loadFiltersFromLocalStorage = () => {
  try {
    const saved = localStorage.getItem('pgVerifyFilters');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading filters from localStorage:', error);
  }
  
  // Default filters
  return {
    searchTerm: '',
    gender: '',
    occupancy: '',
    priceRange: [0, 25000],
    amenities: [],
    roomType: '',
    minRating: 0
  };
};

/**
 * Clear filters from localStorage
 */
export const clearFiltersFromLocalStorage = () => {
  try {
    localStorage.removeItem('pgVerifyFilters');
  } catch (error) {
    console.error('Error clearing filters from localStorage:', error);
  }
};
