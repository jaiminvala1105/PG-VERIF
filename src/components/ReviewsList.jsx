import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { __DB } from '../backend/firebaseConfig';
import { User, ThumbsUp, Flag, ChevronDown, ChevronUp } from 'lucide-react';
import StarRating from './StarRating.jsx';
import { getCategoryAverages } from '../helper/ratingUtils.js';

const ReviewsList = ({ pgId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedReviews, setExpandedReviews] = useState({});
  const reviewsPerPage = 10;

  useEffect(() => {
    fetchReviews();
  }, [pgId, sortBy]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const reviewsQuery = query(
        collection(__DB, 'reviews'),
        where('pgId', '==', pgId)
      );
      
      const reviewsSnapshot = await getDocs(reviewsQuery);
      const reviewsData = reviewsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort reviews
      let sortedReviews = [...reviewsData];
      if (sortBy === 'recent') {
        sortedReviews.sort((a, b) => b.createdAt - a.createdAt);
      } else if (sortBy === 'highest') {
        sortedReviews.sort((a, b) => b.rating.overall - a.rating.overall);
      } else if (sortBy === 'lowest') {
        sortedReviews.sort((a, b) => a.rating.overall - b.rating.overall);
      }

      setReviews(sortedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (reviewId) => {
    setExpandedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return 'Recently';
    const date = timestamp.toDate();
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) !== 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const categoryAverages = getCategoryAverages(reviews);

  // Pagination
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(n => (
          <div key={n} className="h-40 bg-gray-800/30 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {

    return (
      <div className="text-center py-12">
        <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">No reviews yet</p>
        <p className="text-gray-500 text-sm">Be the first to share your experience!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Ratings Summary */}
      {categoryAverages && Object.keys(categoryAverages).length > 0 && (
        <div className="bg-gray-800/30 rounded-xl p-4">
          <h4 className="text-white font-semibold mb-3">Category Ratings</h4>
          <div className="grid grid-cols-2 gap-3">
            {categoryAverages.cleanliness && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Cleanliness</span>
                <div className="flex items-center gap-2">
                  <StarRating rating={categoryAverages.cleanliness} size={14} />
                  <span className="text-white text-sm font-semibold">{categoryAverages.cleanliness.toFixed(1)}</span>
                </div>
              </div>
            )}
            {categoryAverages.safety && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Safety</span>
                <div className="flex items-center gap-2">
                  <StarRating rating={categoryAverages.safety} size={14} />
                  <span className="text-white text-sm font-semibold">{categoryAverages.safety.toFixed(1)}</span>
                </div>
              </div>
            )}
            {categoryAverages.foodQuality && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Food Quality</span>
                <div className="flex items-center gap-2">
                  <StarRating rating={categoryAverages.foodQuality} size={14} />
                  <span className="text-white text-sm font-semibold">{categoryAverages.foodQuality.toFixed(1)}</span>
                </div>
              </div>
            )}
            {categoryAverages.valueForMoney && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Value for Money</span>
                <div className="flex items-center gap-2">
                  <StarRating rating={categoryAverages.valueForMoney} size={14} />
                  <span className="text-white text-sm font-semibold">{categoryAverages.valueForMoney.toFixed(1)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sort Options */}
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">All Reviews ({reviews.length})</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-sm focus:outline-none focus:border-indigo-500"
        >
          <option value="recent">Most Recent</option>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {currentReviews.map((review) => {
          const isExpanded = expandedReviews[review.id];
          const isLongReview = review.reviewText.length > 200;
          
          return (
            <div key={review.id} className="bg-gray-800/30 rounded-xl p-4 hover:bg-gray-800/50 transition-colors">
              {/* Reviewer Info */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{review.userName}</p>
                    <p className="text-gray-500 text-xs">{formatDate(review.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StarRating rating={review.rating.overall} size={16} />
                  <span className="text-yellow-500 font-semibold">{review.rating.overall.toFixed(1)}</span>
                </div>
              </div>

              {/* Review Text */}
              <div className="mb-3">
                <p className="text-gray-300 text-sm leading-relaxed">
                  {isLongReview && !isExpanded 
                    ? `${review.reviewText.substring(0, 200)}...` 
                    : review.reviewText
                  }
                </p>
                {isLongReview && (
                  <button
                    onClick={() => toggleExpand(review.id)}
                    className="text-indigo-400 text-xs mt-2 flex items-center gap-1 hover:text-indigo-300"
                  >
                    {isExpanded ? (
                      <>
                        Read Less <ChevronUp size={14} />
                      </>
                    ) : (
                      <>
                        Read More <ChevronDown size={14} />
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Category Ratings (if any) */}
              {(review.rating.cleanliness > 0 || review.rating.safety > 0 || review.rating.foodQuality > 0 || review.rating.valueForMoney > 0) && (
                <div className="flex flex-wrap gap-3 mb-3 pb-3 border-b border-gray-700">
                  {review.rating.cleanliness > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500 text-xs">Cleanliness:</span>
                      <StarRating rating={review.rating.cleanliness} size={12} />
                    </div>
                  )}
                  {review.rating.safety > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500 text-xs">Safety:</span>
                      <StarRating rating={review.rating.safety} size={12} />
                    </div>
                  )}
                  {review.rating.foodQuality > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500 text-xs">Food:</span>
                      <StarRating rating={review.rating.foodQuality} size={12} />
                    </div>
                  )}
                  {review.rating.valueForMoney > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500 text-xs">Value:</span>
                      <StarRating rating={review.rating.valueForMoney} size={12} />
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4 text-gray-500 text-xs">
                <button className="flex items-center gap-1 hover:text-indigo-400 transition-colors">
                  <ThumbsUp size={14} />
                  Helpful ({review.helpful || 0})
                </button>
                <button className="flex items-center gap-1 hover:text-red-400 transition-colors">
                  <Flag size={14} />
                  Report
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-gray-400 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
