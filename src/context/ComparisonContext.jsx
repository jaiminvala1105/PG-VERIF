import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const ComparisonContext = createContext();

export const ComparisonProvider = ({ children }) => {
  const [selectedPGs, setSelectedPGs] = useState([]);
  const MAX_COMPARISON = 3;

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('pgComparison');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSelectedPGs(parsed);
      } catch (error) {
        console.error('Error loading comparison data:', error);
      }
    }
  }, []);

  // Save to localStorage whenever selectedPGs changes
  useEffect(() => {
    localStorage.setItem('pgComparison', JSON.stringify(selectedPGs));
  }, [selectedPGs]);

  const addToComparison = (pg) => {
    if (selectedPGs.length >= MAX_COMPARISON) {
      toast.error(`You can only compare up to ${MAX_COMPARISON} PGs at a time`);
      return false;
    }

    if (selectedPGs.some(p => p.id === pg.id)) {
      toast.error('This PG is already in comparison');
      return false;
    }

    setSelectedPGs(prev => [...prev, pg]);
    toast.success('Added to comparison');
    return true;
  };

  const removeFromComparison = (pgId) => {
    setSelectedPGs(prev => prev.filter(p => p.id !== pgId));
    toast.success('Removed from comparison');
  };

  const clearComparison = () => {
    setSelectedPGs([]);
    toast.success('Comparison cleared');
  };

  const isInComparison = (pgId) => {
    return selectedPGs.some(p => p.id === pgId);
  };

  const isMaxReached = () => {
    return selectedPGs.length >= MAX_COMPARISON;
  };

  return (
    <ComparisonContext.Provider
      value={{
        selectedPGs,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isInComparison,
        isMaxReached,
        MAX_COMPARISON,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within ComparisonProvider');
  }
  return context;
};
