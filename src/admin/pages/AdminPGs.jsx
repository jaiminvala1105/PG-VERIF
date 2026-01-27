import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { __DB } from '../../backend/firebaseConfig';
import { CheckCircle, Trash2, Edit, Plus, Search, MapPin, DollarSign, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSearchParams, Link } from 'react-router-dom';
import PGFormModal from '../components/PGFormModal';
import AdminPGCard from '../components/AdminPGCard';


const AdminPGs = () => {
  const [pgs, setPgs] = useState([]);
  const [filteredPgs, setFilteredPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPg, setEditingPg] = useState(null);

  const fetchPGs = async () => {
    try {
      const querySnapshot = await getDocs(collection(__DB, 'pgs'));
      const pgsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPgs(pgsData);
      setFilteredPgs(pgsData);
    } catch (error) {
      console.error("Error fetching PGs:", error);
      toast.error("Failed to fetch PGs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPGs();
    
    // Check for openAdd param
    if (searchParams.get('openAdd') === 'true') {
      handleAddClick();
      // Remove param to prevent reopening on reload
      searchParams.delete('openAdd');
      setSearchParams(searchParams);
    }
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPgs(pgs);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = pgs.filter(pg => 
        (pg.location && pg.location.toLowerCase().includes(lowerQuery)) ||
        (pg.name && pg.name.toLowerCase().includes(lowerQuery))
      );
      setFilteredPgs(filtered);
    }
  }, [searchQuery, pgs]);

  const handleVerify = async (id, e) => {
    e.stopPropagation();
    try {
      await updateDoc(doc(__DB, 'pgs', id), {
        status: 'verified'
      });
      toast.success("PG Verified Successfully!");
      fetchPGs();
    } catch (error) {
      console.error("Error verifying PG:", error);
      toast.error("Failed to verify PG");
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this PG?")) {
      try {
        await deleteDoc(doc(__DB, 'pgs', id));
        toast.success("PG Deleted Successfully!");
        fetchPGs();
      } catch (error) {
        console.error("Error deleting PG:", error);
        toast.error("Failed to delete PG");
      }
    }
  };

  const handleEditClick = (pg) => {
    setEditingPg(pg);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingPg(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingPg) {
        // Update existing PG
        await updateDoc(doc(__DB, 'pgs', editingPg.id), formData);
        toast.success("PG Updated Successfully!");
      } else {
        // Add new PG
        await addDoc(collection(__DB, 'pgs'), {
          ...formData,
          status: 'pending', // Default status
          createdAt: new Date().toISOString()
        });
        toast.success("New PG Added Successfully!");
      }
      setIsModalOpen(false);
      fetchPGs();
    } catch (error) {
      console.error("Error saving PG:", error);
      toast.error("Failed to save PG details");
    }
  };

  if (loading) return <div className="text-white">Loading PGs...</div>;

  return (
    <div className="space-y-8">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent flex items-center gap-3 mt-4 ml-2">
            <Link 
              to="/admin" 
              className="bg-gray-800 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-indigo-600 transition-all duration-300 shadow-lg shadow-gray-900/20 group border border-gray-700 hover:border-indigo-500" 
              title="Back to Dashboard"
            >
              <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform duration-300" />
            </Link>
            Manage PGs
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {filteredPgs.length} listings found
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by location or name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full sm:w-64"
            />
          </div>
          <button 
            onClick={handleAddClick}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg transition-colors font-medium shadow-lg shadow-indigo-500/20"
          >
            <Plus size={20} />
            <span>Add New PG</span>
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Add New PG Card - Always Visible First */}
        <div 
          onClick={handleAddClick}
          className="group relative bg-gradient-to-br from-indigo-900/10 to-purple-900/10 border-2 border-dashed border-indigo-500/30 rounded-2xl overflow-hidden hover:border-indigo-500 hover:from-indigo-900/20 hover:to-purple-900/20 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer min-h-[380px] hover:shadow-2xl hover:shadow-indigo-500/10"
        >
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:16px_16px]" />
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 mb-6 shadow-lg shadow-indigo-500/30 z-10">
            <Plus className="text-white" size={32} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2 z-10">
            Add New PG
          </h3>
          <p className="text-indigo-200/60 text-sm text-center max-w-[70%] leading-relaxed z-10">
            List a new property on the platform.
          </p>
        </div>

        {filteredPgs.length === 0 && searchQuery !== '' ? (
          <div className="col-span-full py-12 text-center text-gray-400">
            No PGs found matching "{searchQuery}"
          </div>
        ) : (
          filteredPgs.map((pg) => (
             <AdminPGCard 
               key={pg.id}
               pg={pg}
               onEdit={handleEditClick}
               onDelete={handleDelete}
               onVerify={handleVerify}
             />
          ))
        )}
      </div>

      {/* PG Form Modal */}
      <PGFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingPg}
        isEditing={!!editingPg}
      />
    </div>
  );
};

export default AdminPGs;
