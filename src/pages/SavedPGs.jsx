import React, { useContext, useState, useEffect } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';
import { AuthUser } from '../context/AuthUserContext';
import { collection, getDocs, query, where, documentId } from 'firebase/firestore';
import { __DB } from '../backend/firebaseConfig';
import PgCard from '../components/PgCard';
import { Heart, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const SavedPGs = () => {
  const { savedItems, loading: favLoading } = useContext(FavoritesContext);
  const { authusers } = useContext(AuthUser);
  const [savedPGs, setSavedPGs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedPGs = async () => {
      if (!savedItems || savedItems.length === 0) {
        setSavedPGs([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch PGs whose IDs are in savedItems
        // Note: Firestore 'in' queries have a limit of 10 items, so we need to batch if more
        const chunks = [];
        for (let i = 0; i < savedItems.length; i += 10) {
          chunks.push(savedItems.slice(i, i + 10));
        }

        const allPGs = [];
        for (const chunk of chunks) {
          const q = query(
            collection(__DB, 'pgs'),
            where(documentId(), 'in', chunk)
          );
          const querySnapshot = await getDocs(q);
          const pgsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          allPGs.push(...pgsData);
        }

        setSavedPGs(allPGs);
      } catch (error) {
        console.error('Error fetching saved PGs:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!favLoading) {
      fetchSavedPGs();
    }
  }, [savedItems, favLoading]);

  // Show loading state
  if (loading || favLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your saved PGs...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!authusers) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Heart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Login Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please login to view your saved PGs
          </p>
          <Link
            to="/auth/login"
            className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
          >
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  // Show empty state if no saved PGs
  if (savedPGs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="relative mb-6">
            <Heart className="w-20 h-20 text-gray-200 dark:text-gray-800 mx-auto" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Heart className="w-12 h-12 text-gray-300 dark:text-gray-700" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            No Saved PGs Yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start adding PGs to your favorites by clicking the heart icon on any listing
          </p>
          <Link
            to="/pg"
            className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
          >
            Browse PGs
          </Link>
        </div>
      </div>
    );
  }

  // Display saved PGs
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pb-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center space-y-4 pt-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Heart className="w-10 h-10 text-indigo-600 fill-indigo-600" />
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
              Saved <span className="text-indigo-500">PGs</span>
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            You have <span className="font-bold text-indigo-600">{savedPGs.length}</span> saved {savedPGs.length === 1 ? 'PG' : 'PGs'}
          </p>
        </div>

        {/* Saved PGs Grid */}
        <div className="space-y-6">
          {savedPGs.map((pg) => (
            <PgCard key={pg.id} pg={pg} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavedPGs;
