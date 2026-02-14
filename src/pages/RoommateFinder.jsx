import React, { useEffect, useState, useContext } from 'react';
import { useRoommate } from '../context/RoommateContext';
import { AuthUser } from '../context/AuthUserContext';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, DollarSign, Briefcase, Heart, Search, SlidersHorizontal, Percent } from 'lucide-react';

const RoommateFinder = () => {
  const { roommateProfile, allProfiles, loading, fetchAllProfiles, getBestMatches } = useRoommate();
  const { authusers } = useContext(AuthUser);
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState('all'); // 'all' or 'matches'
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    gender: '',
    minBudget: 0,
    maxBudget: 50000,
    occupation: '',
    location: '',
  });

  useEffect(() => {
    fetchAllProfiles();
  }, []);

  if (!authusers) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Login Required</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Please login to find roommates</p>
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

  const displayProfiles = viewMode === 'matches' && roommateProfile ? getBestMatches() : allProfiles;

  // Apply search and filters
  const filteredProfiles = displayProfiles.filter(profile => {
    const matchesSearch = !searchTerm || 
      profile.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.occupation?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGender = !filters.gender || profile.gender === filters.gender;
    const matchesBudget =
      (!filters.minBudget || (profile.budget?.max || 0) >= filters.minBudget) &&
      (!filters.maxBudget || (profile.budget?.min || 0) <= filters.maxBudget);
    const matchesOccupation = !filters.occupation || 
      profile.occupation?.toLowerCase().includes(filters.occupation.toLowerCase());
    const matchesLocation = !filters.location || 
      (profile.preferredLocations || []).some(loc => 
        loc.toLowerCase().includes(filters.location.toLowerCase())
      );

    return matchesSearch && matchesGender && matchesBudget && matchesOccupation && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto py-12">
        {/* Header */}
        <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-2">
            Find Your <span className="text-indigo-500">Perfect Roommate</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Connect with compatible roommates based on lifestyle and preferences
          </p>
        </div>

        {/* Profile CTA */}
        {!roommateProfile && (
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold mb-2">Create Your Profile</h3>
                <p className="text-indigo-100">Get better matches by creating your roommate profile</p>
              </div>
              <button
                onClick={() => navigate('/my-roommate-profile')}
                className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition-colors whitespace-nowrap"
              >
                Create Profile
              </button>
            </div>
          </div>
        )}

        {/* View Toggle & Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* View Mode Toggle */}
          {roommateProfile && (
            <div className="flex bg-white dark:bg-gray-900 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setViewMode('all')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  viewMode === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                All Profiles
              </button>
              <button
                onClick={() => setViewMode('matches')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  viewMode === 'matches'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Best Matches
              </button>
            </div>
          )}

          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, occupation..."
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Found <span className="font-bold text-indigo-600">{filteredProfiles.length}</span> profile
            {filteredProfiles.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map(profile => (
            <RoommateCard 
              key={profile.id} 
              profile={profile}
              showCompatibility={viewMode === 'matches' && roommateProfile}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredProfiles.length === 0 && (
          <div className="text-center py-20">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Profiles Found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Roommate Card Component
const RoommateCard = ({ profile, showCompatibility }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300 group">
      {/* Profile Image */}
      <div className="relative h-48 bg-gradient-to-br from-indigo-500 to-purple-600">
        {profile.profileImage ? (
          <img
            src={profile.profileImage}
            alt={profile.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="w-20 h-20 text-white/50" />
          </div>
        )}
        
        {showCompatibility && profile.compatibilityScore !== undefined && (
          <div className="absolute top-4 right-4 bg-white dark:bg-gray-900 rounded-full px-3 py-1 shadow-lg flex items-center gap-1">
            <Percent className="w-4 h-4 text-green-600" />
            <span className="font-bold text-green-600">{profile.compatibilityScore}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Name & Age */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{profile.name}</h3>
            <p className="text-sm text-gray-500">{profile.age} years • {profile.gender}</p>
          </div>
        </div>

        {/* Occupation */}
{profile.occupation && (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-3">
            <Briefcase className="w-4 h-4" />
            <span className="text-sm">{profile.occupation}</span>
          </div>
        )}

        {/* Bio */}
        {profile.bio && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {profile.bio}
          </p>
        )}

        {/* Budget */}
        {profile.budget && (
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              ₹{profile.budget.min?.toLocaleString()} - ₹{profile.budget.max?.toLocaleString()}/mo
            </span>
          </div>
        )}

        {/* Preferred Locations */}
        {profile.preferredLocations && profile.preferredLocations.length > 0 && (
          <div className="flex items-start gap-2 mb-4">
            <MapPin className="w-4 h-4 text-indigo-600 mt-0.5" />
            <div className="flex-1 flex flex-wrap gap-1">
              {profile.preferredLocations.slice(0, 2).map((loc, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full"
                >
                  {loc}
                </span>
              ))}
              {profile.preferredLocations.length > 2 && (
                <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                  +{profile.preferredLocations.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Interests */}
        {profile.interests && profile.interests.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {profile.interests.slice(0, 3).map((interest, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full flex items-center gap-1"
              >
                <Heart className="w-3 h-3" />
                {interest}
              </span>
            ))}
          </div>
        )}

        {/* Connect Button */}
        <button className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors">
          Connect
        </button>
      </div>
    </div>
  );
}; 

export default RoommateFinder;
