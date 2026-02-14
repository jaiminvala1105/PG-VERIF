import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { __DB } from '../backend/firebaseConfig';

/**
 * Calculate average rating and breakdown from reviews
 */
export const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) {
    return {
      average: 0,
      totalReviews: 0,
      breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };
  }

  let totalRating = 0;
  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  reviews.forEach(review => {
    const rating = Math.round(review.rating?.overall || 0);
    totalRating += review.rating?.overall || 0;
    if (rating >= 1 && rating <= 5) {
      breakdown[rating]++;
    }
  });

  return {
    average: totalRating / reviews.length,
    totalReviews: reviews.length,
    breakdown
  };
};

/**
 * Update PG ratings after new review
 */
export const updatePGRatings = async (pgId) => {
  try {
    // Fetch all reviews for this PG
    const reviewsQuery = query(
      collection(__DB, 'reviews'),
      where('pgId', '==', pgId)
    );
    const reviewsSnapshot = await getDocs(reviewsQuery);
    const reviews = reviewsSnapshot.docs.map(doc => doc.data());

    // Calculate new ratings
    const { average, totalReviews, breakdown } = calculateAverageRating(reviews);

    // Update PG document
    const pgRef = doc(__DB, 'pgs', pgId);
    await updateDoc(pgRef, {
      ratings: {
        average,
        totalReviews,
        breakdown
      }
    });

    return { average, totalReviews, breakdown };
  } catch (error) {
    console.error('Error updating PG ratings:', error);
    throw error;
  }
};

/**
 * Format rating breakdown for display
 */
export const formatRatingBreakdown = (breakdown, totalReviews) => {
  if (!breakdown || !totalReviews) return [];

  return [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: breakdown[rating] || 0,
    percentage: totalReviews > 0 ? ((breakdown[rating] || 0) / totalReviews) * 100 : 0
  }));
};

/**
 * Check if user can review (hasn't already reviewed)
 */
export const canUserReview = async (userId, pgId) => {
  try {
    const reviewsQuery = query(
      collection(__DB, 'reviews'),
      where('userId', '==', userId),
      where('pgId', '==', pgId)
    );
    const reviewsSnapshot = await getDocs(reviewsQuery);
    return reviewsSnapshot.empty;
  } catch (error) {
    console.error('Error checking review permission:', error);
    return false;
  }
};

/**
 * Get category averages from reviews
 */
export const getCategoryAverages = (reviews) => {
  if (!reviews || reviews.length === 0) return null;

  const categories = ['cleanliness', 'safety', 'foodQuality', 'valueForMoney'];
  const averages = {};

  categories.forEach(category => {
    const validRatings = reviews
      .map(r => r.rating?.[category])
      .filter(rating => rating && rating > 0);
    
    if (validRatings.length > 0) {
      averages[category] = validRatings.reduce((a, b) => a + b, 0) / validRatings.length;
    }
  });

  return averages;
};
