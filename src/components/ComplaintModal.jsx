import React, { useState, useContext } from 'react';
import { X, AlertCircle, Upload, Camera } from 'lucide-react';
import { useComplaints } from '../context/ComplaintsContext';
import { AuthUser } from '../context/AuthUserContext';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { __STORAGE } from '../backend/firebaseConfig';
import toast from 'react-hot-toast';

const ComplaintModal = ({ isOpen, onClose, pgId, pgName }) => {
  const { authusers } = useContext(AuthUser);
  
  // Try to get complaints context, but don't crash if not available
  let submitComplaintFn;
  try {
    const context = useComplaints();
    submitComplaintFn = context?.submitComplaint;
  } catch (error) {
    console.error('ComplaintsContext not available:', error);
  }
  
  const [formData, setFormData] = useState({
    pgId: pgId || '',
    pgName: pgName || '',
    category: '',
    subject: '',
    description: '',
    images: [],
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const categories = [
    'Cleanliness',
    'Safety',
    'Maintenance',
    'Owner Behavior',
    'Pricing Issue',
    'Other',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 3); // Max 3 images
      setImageFiles(files);
    }
  };

  const uploadImages = async () => {
    if (imageFiles.length === 0) return [];

    try {
      const uploadPromises = imageFiles.map(async (file) => {
        const storageRef = ref(__STORAGE, `complaints/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
      });

      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
      return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check authentication
    if (!authusers || !authusers.uid) {
      toast.error('Please login to file a complaint');
      return;
    }

    if (!submitComplaintFn) {
      toast.error('Complaints feature is not available');
      return;
    }

    if (!formData.category || !formData.subject || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setUploading(true);
    const imageUrls = await uploadImages();
    
    const ticketId = await submitComplaintFn({
      ...formData,
      images: imageUrls,
    });

    setUploading(false);

    if (ticketId) {
      // Reset form
      setFormData({
        pgId: '',
        pgName: '',
        category: '',
        subject: '',
        description: '',
        images: [],
      });
      setImageFiles([]);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">File a Complaint</h2>
              {pgName && (
                <p className="text-sm text-gray-500 mt-1">Against: {pgName}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subject *
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder="Brief summary of the issue"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="5"
              placeholder="Provide detailed information about your complaint..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none resize-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Attach Images (Optional, max 3)
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                id="complaint-images"
              />
              <label
                htmlFor="complaint-images"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-red-500 hover:text-red-500 cursor-pointer transition-colors"
              >
                <Camera className="w-5 h-5" />
                <span>Click to upload images</span>
              </label>
            </div>
            {imageFiles.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {imageFiles.map((file, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full"
                  >
                    {file.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintModal;
