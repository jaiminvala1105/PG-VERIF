import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc, onSnapshot, query, where, getDocs } from 'firebase/firestore';
import { __DB } from '../backend/firebaseConfig';
import { AuthUser } from './AuthUserContext';
import toast from 'react-hot-toast';

export const RoommateContext = createContext();

export const RoommateProvider = ({ children }) => {
  const { authusers } = useContext(AuthUser);
  const [roommateProfile, setRoommateProfile] = useState(null);
  const [allProfiles, setAllProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's own roommate profile
  useEffect(() => {
    if (!authusers?.uid) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(__DB, 'roommateProfiles'),
      where('userId', '==', authusers.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const profile = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
        setRoommateProfile(profile);
      } else {
        setRoommateProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [authusers?.uid]);

  // Fetch all profiles for browsing (excluding current user)
  const fetchAllProfiles = async () => {
    try {
      const querySnapshot = await getDocs(collection(__DB, 'roommateProfiles'));
      const profiles = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(profile => profile.userId !== authusers?.uid);
      setAllProfiles(profiles);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast.error('Failed to load profiles');
    }
  };

  // Create or update roommate profile
  const saveProfile = async (profileData) => {
    try {
      const data = {
        ...profileData,
        userId: authusers.uid,
        updatedAt: new Date().toISOString(),
      };

      if (roommateProfile?.id) {
        // Update existing profile
        await updateDoc(doc(__DB, 'roommateProfiles', roommateProfile.id), data);
        toast.success('Profile updated successfully!');
      } else {
        // Create new profile
        data.createdAt = new Date().toISOString();
        await addDoc(collection(__DB, 'roommateProfiles'), data);
        toast.success('Profile created successfully!');
      }
      return true;
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
      return false;
    }
  };

  // Calculate compatibility score between two profiles
  const calculateCompatibility = (profile1, profile2) => {
    if (!profile1 || !profile2) return 0;
    
    let score = 0;
    let maxScore = 0;

    // Budget compatibility (30 points)
    maxScore += 30;
    const budgetOverlap = Math.max(
      0,
      Math.min(profile1.budget?.max || 0, profile2.budget?.max || 0) -
      Math.max(profile1.budget?.min || 0, profile2.budget?.min || 0)
    );
    if (budgetOverlap > 0) {
      score += 30;
    } else {
      const budgetDiff = Math.abs(
        ((profile1.budget?.min + profile1.budget?.max) / 2) -
        ((profile2.budget?.min + profile2.budget?.max) / 2)
      );
      score += Math.max(0, 30 - (budgetDiff / 1000) * 5);
    }

    // Location preferences (20 points)
    maxScore += 20;
    const locations1 = profile1.preferredLocations || [];
    const locations2 = profile2.preferredLocations || [];
    const commonLocations = locations1.filter(loc => locations2.includes(loc));
    if (commonLocations.length > 0) {
      score += 20 * (commonLocations.length / Math.max(locations1.length, locations2.length));
    }

    // Lifestyle compatibility (30 points)
    maxScore += 30;
    const lifestyle1 = profile1.lifestyle || {};
    const lifestyle2 = profile2.lifestyle || {};
    const lifestyleKeys = ['smoker', 'vegetarian', 'petOwner', 'nightOwl'];
    const matches = lifestyleKeys.filter(key => lifestyle1[key] === lifestyle2[key]).length;
    score += (matches / lifestyleKeys.length) * 30;

    // Interests overlap (20 points)
    maxScore += 20;
    const interests1 = profile1.interests || [];
    const interests2 = profile2.interests || [];
    const commonInterests = interests1.filter(i => interests2.includes(i));
    if (commonInterests.length > 0) {
      score += 20 * (commonInterests.length / Math.max(interests1.length, interests2.length));
    }

    return Math.round((score / maxScore) * 100);
  };

  // Get best matches for current user
  const getBestMatches = () => {
    if (!roommateProfile) return [];
    
    return allProfiles
      .map(profile => ({
        ...profile,
        compatibilityScore: calculateCompatibility(roommateProfile, profile),
      }))
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  };

  return (
    <RoommateContext.Provider
      value={{
        roommateProfile,
        allProfiles,
        loading,
        saveProfile,
        fetchAllProfiles,
        calculateCompatibility,
        getBestMatches,
      }}
    >
      {children}
    </RoommateContext.Provider>
  );
};

export const useRoommate = () => {
  const context = useContext(RoommateContext);
  if (!context) {
    throw new Error('useRoommate must be used within RoommateProvider');
  }
  return context;
};
