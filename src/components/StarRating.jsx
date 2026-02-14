import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ 
  rating = 0, 
  onRatingChange = null, 
  size = 24, 
  interactive = false,
  showValue = false 
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(rating);

  const handleClick = (value) => {
    if (!interactive) return;
    setSelectedRating(value);
    if (onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (!interactive) return;
    setHoverRating(value);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setHoverRating(0);
  };

  const displayRating = interactive ? (hoverRating || selectedRating) : rating;

  const getStarFill = (index) => {
    if (displayRating >= index) {
      return 'full';
    } else if (displayRating >= index - 0.5) {
      return 'half';
    }
    return 'empty';
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((index) => {
          const fillType = getStarFill(index);
          
          return (
            <div
              key={index}
              className={`relative ${interactive ? 'cursor-pointer' : ''}`}
              onClick={() => handleClick(index)}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              {/* Background star (empty state) */}
              <Star
                size={size}
                className={`transition-all duration-200 ${
                  fillType === 'empty'
                    ? 'text-gray-600 dark:text-gray-700'
                    : 'text-transparent'
                }`}
                strokeWidth={2}
              />
              
              {/* Filled star overlay */}
              {fillType !== 'empty' && (
                <div className="absolute inset-0 overflow-hidden">
                  <Star
                    size={size}
                    className={`transition-all duration-200 ${
                      interactive && hoverRating > 0
                        ? 'text-yellow-400'
                        : 'text-yellow-500'
                    }`}
                    fill="currentColor"
                    strokeWidth={2}
                    style={{
                      clipPath: fillType === 'half' ? 'inset(0 50% 0 0)' : 'none'
                    }}
                  />
                </div>
              )}
              
              {/* Hover effect for interactive mode */}
              {interactive && (
                <div className="absolute inset-0 opacity-0 hover:opacity-20 transition-opacity">
                  <Star
                    size={size}
                    fill="white"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {showValue && (
        <span className="ml-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          {displayRating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
