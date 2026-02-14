import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, addDoc, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { __DB } from '../backend/firebaseConfig';
import { AuthUser } from './AuthUserContext';
import toast from 'react-hot-toast';

export const ComplaintsContext = createContext();

export const ComplaintsProvider = ({ children }) => {
  const { authusers } = useContext(AuthUser);
  const [userComplaints, setUserComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's complaints
  useEffect(() => {
    if (!authusers?.uid) {
      setUserComplaints([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(__DB, 'complaints'),
     where('userId', '==', authusers.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const complaints = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })).sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
      
      setUserComplaints(complaints);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [authusers?.uid]);

  // Generate unique ticket ID
  const generateTicketId = () => {
    const prefix = 'CPL';
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `${prefix}-${randomNum}`;
  };

  // Submit new complaint
  const submitComplaint = async (complaintData) => {
    try {
      const data = {
        ...complaintData,
        complaintId: generateTicketId(),
        userId: authusers.uid,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await addDoc(collection(__DB, 'complaints'), data);
      toast.success(`Complaint filed successfully! Ticket ID: ${data.complaintId}`);
      return data.complaintId;
    } catch (error) {
      console.error('Error submitting complaint:', error);
      toast.error('Failed to submit complaint');
      return null;
    }
  };

  return (
    <ComplaintsContext.Provider
      value={{
        userComplaints,
        loading,
        submitComplaint,
      }}
    >
      {children}
    </ComplaintsContext.Provider>
  );
};

export const useComplaints = () => {
  const context = useContext(ComplaintsContext);
  if (!context) {
    throw new Error('useComplaints must be used within ComplaintsProvider');
  }
  return context;
};
