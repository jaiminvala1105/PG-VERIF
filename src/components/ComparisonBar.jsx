import React from 'react';
import { useComparison } from '../context/ComparisonContext';
import { GitCompare, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ComparisonBar = () => {
  const { selectedPGs, clearComparison, removeFromComparison } = useComparison();
  const navigate = useNavigate();

  if (selectedPGs.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up">
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-full shadow-2xl px-6 py-4 flex items-center gap-4 backdrop-blur-sm border border-indigo-500">
        {/* Icon */}
        <div className="bg-white/20 p-2 rounded-full">
          <GitCompare className="w-5 h-5" />
        </div>

        {/* Count */}
        <div className="flex flex-col">
          <span className="text-sm font-semibold">
            {selectedPGs.length} PG{selectedPGs.length > 1 ? 's' : ''} Selected
          </span>
          <span className="text-xs text-indigo-200">
            {selectedPGs.length < 3 ? `Add ${3 - selectedPGs.length} more to compare` : 'Ready to compare'}
          </span>
        </div>

        {/* Selected PG Thumbnails */}
        <div className="hidden md:flex items-center gap-2 ml-2">
          {selectedPGs.map((pg, index) => (
            <div key={pg.id} className="relative group">
              <img
                src={pg.image || 'https://via.placeholder.com/50'}
                alt={pg.name}
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
              />
              <button
                onClick={() => removeFromComparison(pg.id)}
                className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-4 border-l border-indigo-400 pl-4">
          <button
            onClick={() => navigate('/compare-pgs')}
            className="bg-white text-indigo-600 px-4 py-2 rounded-full font-semibold text-sm hover:bg-indigo-50 transition-colors"
          >
            Compare Now
          </button>
          <button
            onClick={clearComparison}
            className="text-white hover:text-indigo-200 transition-colors text-sm font-medium"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComparisonBar;
