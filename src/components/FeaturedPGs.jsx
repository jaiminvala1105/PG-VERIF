import React, { useState, useEffect } from 'react';
import { MapPin, Star, User, Wifi, Utensils, Zap, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { __DB } from '../backend/firebaseConfig';
import { motion } from 'framer-motion';

const FeaturedPGs = () => {
  const navigate = useNavigate();
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch 4 most recent PGs from Firestore
  useEffect(() => {
    const fetchRecentPGs = async () => {
      try {
        const pgsRef = collection(__DB, 'pgs');
        // Just limit to 4, no ordering by createdAt since that field might not exist
        const q = query(pgsRef, limit(4));
        const querySnapshot = await getDocs(q);
        
        const pgsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        console.log('Fetched PGs:', pgsData); // Debug log
        setPgs(pgsData);
      } catch (error) {
        console.error('Error fetching PGs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPGs();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <div className="bg-gray-950 py-8 px-4">
      <div className="container mx-auto">
        
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Featured PG Accommodations</h2>
          <p className="text-gray-400">Explore our handpicked selection of verified paying guest accommodations</p>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-10 h-10 text-blue-500 animate-spin" />
          </div>
        ) : pgs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No PGs available at the moment</p>
          </div>
        ) : (
          <>
            {/* Grid with Framer Motion */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {pgs.map((pg) => {
                // Helper function to get the lowest price from pricing structure
                const getLowestPrice = (pricing) => {
                  if (!pricing) return null;
                  const allPrices = [];
                  
                  // Collect all prices from AC and Non-AC
                  if (pricing.ac) {
                    Object.values(pricing.ac).forEach(price => {
                      if (price && price !== '') allPrices.push(parseInt(price));
                    });
                  }
                  if (pricing.nonAc) {
                    Object.values(pricing.nonAc).forEach(price => {
                      if (price && price !== '') allPrices.push(parseInt(price));
                    });
                  }
                  
                  return allPrices.length > 0 ? Math.min(...allPrices) : null;
                };

                // Get available sharing types
                const getSharingTypes = (pricing) => {
                  if (!pricing) return [];
                  const types = new Set();
                  
                  ['ac', 'nonAc'].forEach(category => {
                    if (pricing[category]) {
                      Object.keys(pricing[category]).forEach(key => {
                        if (pricing[category][key] && pricing[category][key] !== '') {
                          const num = key.replace('sharing', '');
                          types.add(num);
                        }
                      });
                    }
                  });
                  
                  return Array.from(types).sort();
                };

                // Check AC availability
                const hasAC = pg.pricing?.ac && Object.values(pg.pricing.ac).some(price => price && price !== '');
                const hasNonAC = pg.pricing?.nonAc && Object.values(pg.pricing.nonAc).some(price => price && price !== '');

                const lowestPrice = getLowestPrice(pg.pricing);
                const sharingTypes = getSharingTypes(pg.pricing);

                return (
                <motion.div 
                  key={pg.id} 
                  className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-2 transition-all duration-300 group cursor-pointer"
                  variants={cardVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/pg')}
                >
                  
                  {/* Image Container */}
                  <div className="relative h-56 overflow-hidden">
                    <motion.img 
                      src={pg.image || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800'} 
                      alt={pg.name} 
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                    />
                    
                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                      {/* Gender Badge */}
                      <div className="bg-indigo-600/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
                        {pg.gender || 'Unisex'}
                      </div>
                      
                      {/* Verified Badge */}
                      {pg.verified && (
                        <motion.div 
                          className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center shadow-lg"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                        >
                          ✓ Verified
                        </motion.div>
                      )}
                    </div>

                    {/* AC/Non-AC Badge */}
                    {(hasAC || hasNonAC) && (
                      <div className="absolute bottom-3 left-3 flex gap-1.5">
                        {hasAC && (
                          <span className="bg-blue-500/90 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded">
                            AC
                          </span>
                        )}
                        {hasNonAC && (
                          <span className="bg-gray-700/90 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded">
                            Non-AC
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Title and Location */}
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors line-clamp-1">
                      {pg.name || 'Unnamed PG'}
                    </h3>
                    
                    <div className="flex items-center text-gray-400 text-xs mb-3">
                      <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                      <span className="line-clamp-1">{pg.location || 'Location not available'}</span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center bg-yellow-400/10 px-2 py-1 rounded text-yellow-400 text-xs font-bold">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        {pg.rating || '4.5'}
                      </div>
                      <span className="text-xs text-gray-500">({pg.reviews || '0'} reviews)</span>
                    </div>

                    {/* Sharing Options */}
                    {sharingTypes.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1.5">
                          {sharingTypes.map(type => (
                            <span key={type} className="bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-semibold px-2 py-0.5 rounded">
                              {type}-Sharing
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Amenities */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1.5">
                        {pg.amenities && Array.isArray(pg.amenities) && pg.amenities.slice(0, 5).map((amenity, index) => {
                          // Icon mapping
                          let IconComponent = null;
                          if (amenity.toLowerCase().includes('wifi')) IconComponent = Wifi;
                          else if (amenity.toLowerCase().includes('meal') || amenity.toLowerCase().includes('food')) IconComponent = Utensils;
                          else if (amenity.toLowerCase().includes('gym')) IconComponent = Zap;
                          
                          return (
                            <span key={index} className="flex items-center bg-gray-800/60 text-gray-300 px-2 py-1 rounded text-[10px] font-medium border border-gray-700/50">
                              {IconComponent && <IconComponent className="w-3 h-3 mr-1" />}
                              {amenity}
                            </span>
                          );
                        })}
                        {pg.amenities && pg.amenities.length > 5 && (
                          <span className="text-gray-500 text-[10px] px-1 py-1">
                            +{pg.amenities.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price - More Prominent */}
                    <div className="pt-3 border-t border-gray-800">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-2xl font-bold text-blue-400">
                            ₹{lowestPrice ? lowestPrice.toLocaleString('en-IN') : 'N/A'}
                          </span>
                          <span className="text-xs text-gray-500 ml-1">/month</span>
                        </div>
                        {lowestPrice && (
                          <span className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded">
                            Starting from
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
              })}
            </motion.div>

            {/* View All Button */}
            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <motion.button 
                onClick={() => navigate('/pg')} 
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition shadow-lg hover:shadow-blue-500/25"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                View All PGs
              </motion.button>
            </motion.div>
          </>
        )}

      </div>
    </div>
  );
};

export default FeaturedPGs;
