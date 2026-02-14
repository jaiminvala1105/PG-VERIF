import { collection, query, where, getCountFromServer } from 'firebase/firestore';
import { __DB } from '../backend/firebaseConfig';

/**
 * Get the count of complaints for a specific PG
 * @param {string} pgId - The ID of the PG
 * @returns {Promise<number>} - The count of complaints
 */
export const getComplaintCount = async (pgId) => {
  try {
    const q = query(collection(__DB, 'complaints'), where('pgId', '==', pgId));
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  } catch (error) {
    console.error('Error getting complaint count:', error);
    return 0;
  }
};

/**
 * Get the count of complaints for a specific PG by status
 * @param {string} pgId - The ID of the PG
 * @param {string} status - The status filter (e.g., 'pending', 'resolved')
 * @returns {Promise<number>} - The count of complaints with that status
 */
export const getComplaintCountByStatus = async (pgId, status) => {
  try {
    const q = query(
      collection(__DB, 'complaints'),
      where('pgId', '==', pgId),
      where('status', '==', status)
    );
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  } catch (error) {
    console.error('Error getting complaint count by status:', error);
    return 0;
  }
};
