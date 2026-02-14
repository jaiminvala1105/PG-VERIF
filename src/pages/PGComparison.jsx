import React, { useRef } from 'react';
import { useComparison } from '../context/ComparisonContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, X, MapPin, Star, Check, Minus } from 'lucide-react';
import { exportToPDF, formatPrice, getAllAmenities, hasAmenity } from '../helper/comparisonUtils';
import toast from 'react-hot-toast';

const PGComparison = () => {
  const { selectedPGs, clearComparison, removeFromComparison } = useComparison();
  const navigate = useNavigate();
  const comparisonRef = useRef(null);

  const handleExportPDF = async () => {
    if (!comparisonRef.current) return;
    
    const loadingToast = toast.loading('Generating PDF...');
    const success = await exportToPDF(comparisonRef.current, `pg-comparison-${Date.now()}.pdf`);
    
    toast.dismiss(loadingToast);
    if (success) {
      toast.success('PDF downloaded successfully!');
    } else {
      toast.error('Failed to generate PDF');
    }
  };

  if (selectedPGs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
              <X className="w-12 h-12 text-gray-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            No PGs Selected
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please select 2-3 PGs from the listings page to compare
          </p>
          <button
            onClick={() => navigate('/pg')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse PGs
          </button>
        </div>
      </div>
    );
  }

  const allAmenities = getAllAmenities(selectedPGs);

  // Helper to get pricing display
  const getPricingDisplay = (pg) => {
    if (!pg.pricing) return [{ label: 'Price', value: formatPrice(pg.price) }];
    
    const rows = [];
    
    // AC Pricing
    if (pg.pricing.ac) {
      if (pg.pricing.ac.sharing2) rows.push({ label: 'AC - Double', value: formatPrice(pg.pricing.ac.sharing2) });
      if (pg.pricing.ac.sharing3) rows.push({ label: 'AC - Triple', value: formatPrice(pg.pricing.ac.sharing3) });
      if (pg.pricing.ac.sharing4) rows.push({ label: 'AC - Quad', value: formatPrice(pg.pricing.ac.sharing4) });
    }
    
    // Non-AC Pricing
    if (pg.pricing.nonAc) {
      if (pg.pricing.nonAc.sharing2) rows.push({ label: 'Non-AC - Double', value: formatPrice(pg.pricing.nonAc.sharing2) });
      if (pg.pricing.nonAc.sharing3) rows.push({ label: 'Non-AC - Triple', value: formatPrice(pg.pricing.nonAc.sharing3) });
      if (pg.pricing.nonAc.sharing4) rows.push({ label: 'Non-AC - Quad', value: formatPrice(pg.pricing.nonAc.sharing4) });
    }
    
    return rows.length > 0 ? rows : [{ label: 'Price', value: 'N/A' }];
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pb-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-gray-50/95 dark:bg-black/95 backdrop-blur-sm py-6 border-b border-gray-200 dark:border-gray-800 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <button
                onClick={() => navigate('/pg')}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Listings
              </button>
              <h1 className="text-4xl font-black text-gray-900 dark:text-white">
                Compare <span className="text-indigo-500">PGs</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Comparing {selectedPGs.length} PG{selectedPGs.length > 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
              <button
                onClick={clearComparison}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div ref={comparisonRef} className="bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="sticky left-0 z-20 bg-gray-100 dark:bg-gray-800 px-4 py-4 text-left font-semibold text-gray-700 dark:text-gray-300 w-48">
                    Property
                  </th>
                  {selectedPGs.map(pg => (
                    <th key={pg.id} className="px-4 py-4 text-left min-w-[280px]">
                      <div className="relative">
                        <button
                          onClick={() => removeFromComparison(pg.id)}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <img
                          src={pg.image || 'https://via.placeholder.com/300x200'}
                          alt={pg.name}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                          {pg.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {pg.location}
                        </p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {/* Rating */}
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="sticky left-0 z-10 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 px-4 py-4 font-medium text-gray-700 dark:text-gray-300">
                    Rating
                  </td>
                  {selectedPGs.map(pg => (
                    <td key={pg.id} className="px-4 py-4">
                      {pg.ratings && pg.ratings.totalReviews > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {pg.ratings.average.toFixed(1)}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            ({pg.ratings.totalReviews} reviews)
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">No reviews yet</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Gender */}
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="sticky left-0 z-10 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 px-4 py-4 font-medium text-gray-700 dark:text-gray-300">
                    Gender
                  </td>
                  {selectedPGs.map(pg => (
                    <td key={pg.id} className="px-4 py-4">
                      <span className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">
                        {pg.gender || 'Unisex'}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Pricing */}
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="sticky left-0 z-10 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 px-4 py-4 font-medium text-gray-700 dark:text-gray-300">
                    Pricing
                  </td>
                  {selectedPGs.map(pg => {
                    const pricing = getPricingDisplay(pg);
                    return (
                      <td key={pg.id} className="px-4 py-4">
                        <div className="space-y-1">
                          {pricing.map((row, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                              <span className="text-gray-600 dark:text-gray-400">{row.label}:</span>
                              <span className="font-semibold text-gray-900 dark:text-white">{row.value}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Contact */}
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="sticky left-0 z-10 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 px-4 py-4 font-medium text-gray-700 dark:text-gray-300">
                    Contact
                  </td>
                  {selectedPGs.map(pg => (
                    <td key={pg.id} className="px-4 py-4">
                      <a
                        href={`tel:${pg.contact}`}
                        className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                      >
                        {pg.contact || 'N/A'}
                      </a>
                    </td>
                  ))}
                </tr>

                {/* Amenities Section Header */}
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <td colSpan={selectedPGs.length + 1} className="px-4 py-3 font-bold text-gray-900 dark:text-white">
                    Amenities
                  </td>
                </tr>

                {/* Each Amenity as a Row */}
                {allAmenities.map(amenity => (
                  <tr key={amenity} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="sticky left-0 z-10 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {amenity}
                    </td>
                    {selectedPGs.map(pg => (
                      <td key={pg.id} className="px-4 py-3 text-center">
                        {hasAmenity(pg, amenity) ? (
                          <Check className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto" />
                        ) : (
                          <Minus className="w-5 h-5 text-gray-300 dark:text-gray-600 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Description */}
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="sticky left-0 z-10 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 px-4 py-4 font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </td>
                  {selectedPGs.map(pg => (
                    <td key={pg.id} className="px-4 py-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                        {pg.description || 'No description available'}
                      </p>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Notice */}
        <div className="md:hidden mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            💡 <strong>Tip:</strong> Rotate your device to landscape mode for a better comparison view
          </p>
        </div>
      </div>
    </div>
  );
};

export default PGComparison;
