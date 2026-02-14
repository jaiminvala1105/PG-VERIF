import React, { useState, useContext, useEffect } from 'react';
import { useRoommate } from '../context/RoommateContext';
import { AuthUser } from '../context/AuthUserContext';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, DollarSign, Heart, Briefcase, Calendar, Camera } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { __STORAGE } from '../backend/firebaseConfig';
import toast from 'react-hot-toast';

const RoommateProfile = () => {
  const { roommateProfile, saveProfile, loading } = useRoommate();
  const { authusers } = useContext(AuthUser);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    occupation: '',
    bio: '',
    budget: { min: 5000, max: 15000 },
    preferredLocations: [],
    lifestyle: {
      smoker: false,
      vegetarian: false,
      petOwner: false,
      nightOwl: false,
    },
    interests: [],
    profileImage: '',
  });

  const [locationInput, setLocationInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (roommateProfile) {
      setFormData({
        name: roommateProfile.name || '',
        age: roommateProfile.age || '',
        gender: roommateProfile.gender || '',
        occupation: roommateProfile.occupation || '',
        bio: roommateProfile.bio || '',
        budget: roommateProfile.budget || { min: 5000, max: 15000 },
        preferredLocations: roommateProfile.preferredLocations || [],
        lifestyle: roommateProfile.lifestyle || {
          smoker: false,
          vegetarian: false,
          petOwner: false,
          nightOwl: false,
        },
        interests: roommateProfile.interests || [],
        profileImage: roommateProfile.profileImage || '',
      });
    }
  }, [roommateProfile]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('lifestyle.')) {
      const key = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        lifestyle: { ...prev.lifestyle, [key]: checked }
      }));
    } else if (name.startsWith('budget.')) {
      const key = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        budget: { ...prev.budget, [key]: Number(value) }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const addLocation = () => {
    if (locationInput.trim() && !formData.preferredLocations.includes(locationInput.trim())) {
      setFormData(prev => ({
        ...prev,
        preferredLocations: [...prev.preferredLocations, locationInput.trim()]
      }));
      setLocationInput('');
    }
  };

  const removeLocation = (location) => {
    setFormData(prev => ({
      ...prev,
      preferredLocations: prev.preferredLocations.filter(loc => loc !== location)
    }));
  };

  const addInterest = () => {
    if (interestInput.trim() && !formData.interests.includes(interestInput.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interestInput.trim()]
      }));
      setInterestInput('');
    }
  };

  const removeInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return formData.profileImage;

    try {
      setUploading(true);
      const storageRef = ref(__STORAGE, `roommateProfiles/${authusers.uid}/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      return formData.profileImage;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authusers) {
      toast.error('Please login to create a profile');
      navigate('/auth/login');
      return;
    }

    // Validation
    if (!formData.name || !formData.age || !formData.gender || !formData.occupation) {
      toast.error('Please fill in all required  fields');
      return;
    }

    const imageUrl = await uploadImage();

    const success = await saveProfile({
      ...formData,
      profileImage: imageUrl,
    });

    if (success) {
      navigate('/find-roommates');
    }
  };

  if (!authusers) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Login Required</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Please login to create your roommate profile</p>
          <button
            onClick={() => navigate('/auth/login')}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
            {roommateProfile ? 'Edit' : 'Create'} Your <span className="text-indigo-500">Roommate Profile</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find your perfect roommate by sharing your preferences
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 space-y-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                {(imageFile || formData.profileImage) ? (
                  <img
                    src={imageFile ? URL.createObjectURL(imageFile) : formData.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full cursor-pointer transition-colors">
                <Camera className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-2">Click to upload profile picture</p>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Age *
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                min="18"
                max="60"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Occupation *
              </label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                required
                placeholder="e.g., Student, Software Engineer"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              placeholder="Tell potential roommates about yourself..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            />
          </div>

          {/* Budget Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Budget Range (₹/month)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Minimum</label>
                <input
                  type="number"
                  name="budget.min"
                  value={formData.budget.min}
                  onChange={handleChange}
                  min="0"
                  step="1000"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Maximum</label>
                <input
                  type="number"
                  name="budget.max"
                  value={formData.budget.max}
                  onChange={handleChange}
                  min="0"
                  step="1000"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Preferred Locations */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Preferred Locations
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLocation())}
                placeholder="Add a location..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                type="button"
                onClick={addLocation}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.preferredLocations.map((location, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm"
                >
                  <MapPin className="w-3 h-3" />
                  {location}
                  <button
                    type="button"
                    onClick={() => removeLocation(location)}
                    className="ml-1 hover:text-indigo-900 dark:hover:text-indigo-100"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Lifestyle Preferences */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Lifestyle Preferences
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { key: 'smoker', label: 'Smoker' },
                { key: 'vegetarian', label: 'Vegetarian' },
                { key: 'petOwner', label: 'Pet Owner' },
                { key: 'nightOwl', label: 'Night Owl' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name={`lifestyle.${key}`}
                    checked={formData.lifestyle[key]}
                    onChange={handleChange}
                    className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Interests & Hobbies
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                placeholder="Add an interest..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                type="button"
                onClick={addInterest}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.interests.map((interest, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm"
                >
                  <Heart className="w-3 h-3" />
                  {interest}
                  <button
                    type="button"
                    onClick={() => removeInterest(interest)}
                    className="ml-1 hover:text-green-900 dark:hover:text-green-100"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/find-roommates')}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : (roommateProfile ? 'Update Profile' : 'Create Profile')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoommateProfile;
