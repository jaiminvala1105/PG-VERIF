import React, { useEffect, useState } from 'react';
import { useComplaints } from '../context/ComplaintsContext';
import { AuthUser } from '../context/AuthUserContext';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AlertCircle, Clock, CheckCircle, XCircle, Eye, Calendar, Tag, FileText } from 'lucide-react';

const MyComplaints = () => {
  const { userComplaints, loading } = useComplaints();
  const { authusers } = useContext(AuthUser);
  const navigate = useNavigate();
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (!authusers) {
      navigate('/auth/login');
    }
  }, [authusers, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

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
    ? userComplaints 
    : userComplaints.filter(c => c.status === filterStatus);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
            My <span className="text-red-500">Complaints</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track and manage all your filed complaints
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {['all', 'pending', 'in-review', 'resolved', 'closed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                filterStatus === status
                  ? 'bg-red-600 text-white'
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-red-500'
              }`}
            >
              {status === 'all' ? 'All' : status.replace('-', ' ')}
              {status !== 'all' && (
                <span className="ml-2 text-xs opacity-75">
                  {userComplaints.filter(c => c.status === status).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Complaints List */}
        {filteredComplaints.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-12 text-center border border-gray-200 dark:border-gray-800">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No Complaints {filterStatus !== 'all' && `in "${filterStatus}"`}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {filterStatus === 'all' 
                ? "You haven't filed any complaints yet."
                : `You don't have any ${filterStatus} complaints.`}
            </p>
            {filterStatus === 'all' && (
              <button
                onClick={() => navigate('/pg')}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
              >
                Browse PGs
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredComplaints.map((complaint) => (
              <div
                key={complaint.id}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-gray-700 dark:text-gray-300">
                          {complaint.complaintId}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(complaint.status)}`}>
                          {getStatusIcon(complaint.status)}
                          <span className="capitalize">{complaint.status.replace('-', ' ')}</span>
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {complaint.subject}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Against: <span className="font-semibold">{complaint.pgName || 'N/A'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Tag className="w-4 h-4" />
                      <span className="text-sm">
                        <span className="font-medium">Category:</span> {complaint.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        <span className="font-medium">Filed:</span>{' '}
                        {new Date(complaint.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">
                        <span className="font-medium">Updated:</span>{' '}
                        {new Date(complaint.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Description Preview */}
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-2 mb-2">
                      <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                        {complaint.description}
                      </p>
                    </div>
                  </div>

                  {/* Images Preview */}
                  {complaint.images && complaint.images.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">Attached Images:</p>
                      <div className="flex gap-2">
                        {complaint.images.slice(0, 3).map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`Evidence ${idx + 1}`}
                            className="w-16 h-16 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                          />
                        ))}
                        {complaint.images.length > 3 && (
                          <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-400">
                            +{complaint.images.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* View Details Button */}
                  <button
                    onClick={() => setSelectedComplaint(complaint)}
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Full Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Complaint Details Modal */}
      {selectedComplaint && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedComplaint(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
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
              {/* Details */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">
                  Complaint Details
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">PG Name:</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {selectedComplaint.pgName || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Category:</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {selectedComplaint.category}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Filed On:</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {new Date(selectedComplaint.submittedAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Last Updated:</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
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
                    Attached Images ({selectedComplaint.images.length})
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

export default MyComplaints;
