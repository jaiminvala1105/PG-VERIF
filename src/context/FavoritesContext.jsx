import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthUser } from './AuthUserContext';
import { doc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore';
import { __DB } from '../backend/firebaseConfig';
import toast from 'react-hot-toast';

export const FavoritesContext = createContext();

const FavoritesProvider = ({ children }) => {
  const { authusers } = useContext(AuthUser);
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const uid = authusers?.uid;

  // Subscribe to user's savedItems in real-time
  useEffect(() => {
    if (!uid) {
      setSavedItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const userDocRef = doc(__DB, 'users', uid);
    
    const unsubscribe = onSnapshot(
      userDocRef, 
      (userDoc) => {
        if (userDoc.exists()) {
          const data = userDoc.data();
          const items = data.savedItems || [];
          console.log('📚 Favorites updated:', items.length, 'items');
          setSavedItems(items);
        } else {
          console.log('⚠️ User document does not exist');
          setSavedItems([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error('❌ Error listening to savedItems:', error);
        setSavedItems([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [uid]);

  // Toggle save/unsave a PG
  const toggleSave = async (pgId) => {
    if (!uid) {
      toast.error('Please login to save PGs');
      return;
    }

    const userDocRef = doc(__DB, 'users', uid);
    const isSaved = savedItems.includes(pgId);

    try {
      if (isSaved) {
        // Remove from savedItems
        await updateDoc(userDocRef, {
          savedItems: arrayRemove(pgId)
        });
        toast.success('Removed from Favorites');
      } else {
        // Add to savedItems (arrayUnion creates the field if it doesn't exist)
        await updateDoc(userDocRef, {
          savedItems: arrayUnion(pgId)
        });
        toast.success('Saved to Favorites');
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      if (error.code === 'not-found') {
        toast.error('User document not found');
      } else if (error.code === 'permission-denied') {
        toast.error('Permission denied. Please check your login status');
      } else {
        toast.error('Failed to update favorites');
      }
    }
  };

  // Check if a PG is saved
  const isSaved = (pgId) => {
    return savedItems.includes(pgId);
  };

  return (
    <FavoritesContext.Provider value={{ savedItems, toggleSave, isSaved, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesProvider;
