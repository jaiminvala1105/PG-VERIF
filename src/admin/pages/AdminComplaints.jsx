import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { __DB } from '../../backend/firebaseConfig';
import { AlertCircle, Clock, CheckCircle, XCircle, Eye, Calendar, Tag, FileText, User, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Fetch all complaints
  useEffect(() => {
    const q = query(collection(__DB, 'complaints'), orderBy('submittedAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const complaintsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComplaints(complaintsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusUpdate = async (complaintId, newStatus) => {
    setUpdatingStatus(true);
    try {
      await updateDoc(doc(__DB, 'complaints', complaintId), {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
      toast.success(`Complaint status updated to "${newStatus}"`);
      
      // Update selected complaint if it's currently open
      if (selectedComplaint?.id === complaintId) {
        setSelectedComplaint(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update complaint status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'in-review':
        return <Eye className="w-5 h-5 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'closed':
        return <XCircle className="w-5 h-5 text-gray-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'in-review':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'resolved':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'closed':
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-500';
    }
  };

  const filteredComplaints = filterStatus === 'all' 
    ? complaints 
    : complaints.filter(c => c.status === filterStatus);

  // Stats calculation
  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    inReview: complaints.filter(c => c.status === 'in-review').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
    closed: complaints.filter(c => c.status === 'closed').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
            Complaint Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review and manage all user complaints
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">{stats.pending}</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-400 mb-1">In Review</p>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{stats.inReview}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-700 dark:text-green-400 mb-1">Resolved</p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-400">{stats.resolved}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Closed</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.closed}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex items-center gap-2 flex-wrap">
          <Filter className="w-5 h-5 text-gray-500" />
          {['all', 'pending', 'in-review', 'resolved', 'closed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                filterStatus === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-indigo-500'
              }`}
            >
              {status === 'all' ? 'All' : status.replace('-', ' ')}
              <span className="ml-2 text-xs opacity-75">
                ({status === 'all' ? stats.total : complaints.filter(c => c.status === status).length})
              </span>
            </button>
          ))}
        </div>

        {/* Complaints Table */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800">
          {filteredComplaints.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                No Complaints {filterStatus !== 'all' && `in "${filterStatus}"`}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filterStatus === 'all' 
                  ? 'No complaints have been filed yet.'
                  : `There are no ${filterStatus} complaints at the moment.`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Ticket ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      PG Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Filed On
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {filteredComplaints.map((complaint) => (
                    <tr 
                      key={complaint.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-700 dark:text-gray-300">
                          {complaint.complaintId}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {complaint.pgName || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">{complaint.subject}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {complaint.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                          {getStatusIcon(complaint.status)}
                          <span className="capitalize">{complaint.status.replace('-', ' ')}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {new Date(complaint.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedComplaint(complaint)}
                          className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium text-sm flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          View & Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Complaint Management Modal */}
      {selectedComplaint && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedComplaint(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-6 z-10">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                      {selectedComplaint.complaintId}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedComplaint.status)}`}>
                      {getStatusIcon(selectedComplaint.status)}
                      <span className="capitalize">{selectedComplaint.status.replace('-', ' ')}</span>
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedComplaint.subject}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  <XCircle className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Status Update Section */}
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 border border-indigo-200 dark:border-indigo-800">
                <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-300 uppercase mb-3">
                  Update Status
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['pending', 'in-review', 'resolved', 'closed'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(selectedComplaint.id, status)}
                      disabled={updatingStatus || selectedComplaint.status === status}
                      className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors text-sm ${
                        selectedComplaint.status === status
                          ? 'bg-indigo-600 text-white cursor-not-allowed'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-indigo-500 hover:text-indigo-600'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {status.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Complaint Details */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">
                  Complaint Details
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">User ID:</span>
                    <span className="font-medium text-gray-900 dark:text-white font-mono">
                      {selectedComplaint.userId.substring(0, 12)}...
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">PG Name:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {selectedComplaint.pgName || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Category:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {selectedComplaint.category}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Filed On:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {new Date(selectedComplaint.submittedAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {new Date(selectedComplaint.updatedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">
                  Description
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {selectedComplaint.description}
                  </p>
                </div>
              </div>

              {/* Images */}
              {selectedComplaint.images && selectedComplaint.images.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">
                    Evidence Images ({selectedComplaint.images.length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedComplaint.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Evidence ${idx + 1}`}
                        className="w-full h-48 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 p-6">
              <button
                onClick={() => setSelectedComplaint(null)}
                className="w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminComplaints;
