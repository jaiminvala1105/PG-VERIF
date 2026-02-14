import React, { useState, useContext, useEffect } from 'react';
import { X, Star, Loader2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { __DB } from '../backend/firebaseConfig';
import { AuthUser } from '../context/AuthuserContext';
import { updatePGRatings, canUserReview } from '../helper/ratingUtils.js';
import StarRating from './StarRating.jsx';
import toast from 'react-hot-toast';

const ReviewModal = ({ isOpen, onClose, pg }) => {
  const { authusers: user } = useContext(AuthUser);
  const [loading, setLoading] = useState(false);
  const [canReview, setCanReview] = useState(true);
  const [checkingPermission, setCheckingPermission] = useState(true);

  const [formData, setFormData] = useState({
    overall: 0,
    cleanliness: 0,
    safety: 0,
    foodQuality: 0,
    valueForMoney: 0,
    reviewText: ''
  });

  useEffect(() => {
    const checkPermission = async () => {
      if (user && pg) {
        const canSubmit = await canUserReview(user.uid, pg.id);
        setCanReview(canSubmit);
      }
      setCheckingPermission(false);
    };

    if (isOpen) {
      checkPermission();
    }
  }, [isOpen, user, pg]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to submit a review');
      return;
    }

    if (formData.overall === 0) {
      toast.error('Please provide an overall rating');
      return;
    }

    if (!formData.reviewText.trim()) {
      toast.error('Please write a review');
      return;
    }

    setLoading(true);

    try {
      const reviewData = {
        pgId: pg.id,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userEmail: user.email,
        rating: {
          overall: formData.overall,
          cleanliness: formData.cleanliness || 0,
          safety: formData.safety || 0,
          foodQuality: formData.foodQuality || 0,
          valueForMoney: formData.valueForMoney || 0
        },
        reviewText: formData.reviewText.trim(),
        createdAt: serverTimestamp(),
        helpful: 0,
        reported: false
      };

      await addDoc(collection(__DB, 'reviews'), reviewData);
      await updatePGRatings(pg.id);

      toast.success('Review submitted successfully!');
      setFormData({
        overall: 0,
        cleanliness: 0,
        safety: 0,
        foodQuality: 0,
        valueForMoney: 0,
        reviewText: ''
      });
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 p-6 border-b border-gray-800 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Star className="text-yellow-500" fill="currentColor" />
              Write a Review
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>
          <p className="text-gray-400 text-sm mt-2">for {pg.name}</p>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {!user ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Please login to submit a review</p>
            </div>
          ) : checkingPermission ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto" />
            </div>
          ) : !canReview ? (
            <div className="text-center py-8">
              <p className="text-yellow-400">You have already reviewed this property</p>
            </div>
          ) : (
            <>
              {/* Overall Rating */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Overall Rating <span className="text-red-500">*</span>
                </label>
                <StarRating
                  rating={formData.overall}
                  onRatingChange={(rating) => setFormData({ ...formData, overall: rating })}
                  interactive={true}
                  size={32}
                  showValue={true}
                />
              </div>

              {/* Category Ratings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Cleanliness</label>
                  <StarRating
                    rating={formData.cleanliness}
                    onRatingChange={(rating) => setFormData({ ...formData, cleanliness: rating })}
                    interactive={true}
                    size={20}
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Safety</label>
                  <StarRating
                    rating={formData.safety}
                    onRatingChange={(rating) => setFormData({ ...formData, safety: rating })}
                    interactive={true}
                    size={20}
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Food Quality</label>
                  <StarRating
                    rating={formData.foodQuality}
                    onRatingChange={(rating) => setFormData({ ...formData, foodQuality: rating })}
                    interactive={true}
                    size={20}
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Value for Money</label>
                  <StarRating
                    rating={formData.valueForMoney}
                    onRatingChange={(rating) => setFormData({ ...formData, valueForMoney: rating })}
                    interactive={true}
                    size={20}
                  />
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-white font-semibold mb-2">
                  Your Review <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.reviewText}
                  onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 resize-none"
                  rows={5}
                  placeholder="Share your experience..."
                  maxLength={1000}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.reviewText.length}/1000 characters
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-gray-700 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || formData.overall === 0}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Review'
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
