import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { __DB } from '../../backend/firebaseConfig';
import { Users, Home, ClipboardList, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const DashboardOverview = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activePGs: 0,
    pendingPGs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch Users
        const usersSnapshot = await getDocs(collection(__DB, 'users'));
        const totalUsers = usersSnapshot.size;

        // Fetch PGs (Assuming 'pgs' collection)
        // Note: If 'pgs' collection doesn't exist yet, this will return 0, which is expected.
        const pgsSnapshot = await getDocs(collection(__DB, 'pgs'));
        const activePGs = pgsSnapshot.docs.filter(doc => doc.data().status === 'verified').length;
        const pendingPGs = pgsSnapshot.docs.filter(doc => doc.data().status === 'pending').length;

        setStats({
          totalUsers,
          activePGs,
          pendingPGs,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-white">Loading stats...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent flex items-center gap-3 mt-4 ml-2">
        <Link 
          to="/" 
          className="bg-gray-800 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-indigo-600 transition-all duration-300 shadow-lg shadow-gray-900/20 group border border-gray-700 hover:border-indigo-500" 
          title="Back to Home"
        >
          <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform duration-300" />
        </Link>
        Dashboard Overview
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex items-center gap-4 shadow-lg hover:border-indigo-500/50 transition-colors">
          <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400">
            <Users size={24} />
          </div>
          <div>
            <h3 className="text-gray-400 text-sm font-medium">Total Users</h3>
            <p className="text-2xl font-bold text-white mt-1">{stats.totalUsers}</p>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex items-center gap-4 shadow-lg hover:border-green-500/50 transition-colors">
          <div className="p-3 bg-green-500/10 rounded-lg text-green-400">
            <Home size={24} />
          </div>
          <div>
            <h3 className="text-gray-400 text-sm font-medium">Active PGs</h3>
            <p className="text-2xl font-bold text-white mt-1">{stats.activePGs}</p>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex items-center gap-4 shadow-lg hover:border-yellow-500/50 transition-colors">
          <div className="p-3 bg-yellow-500/10 rounded-lg text-yellow-400">
            <ClipboardList size={24} />
          </div>
          <div>
            <h3 className="text-gray-400 text-sm font-medium">Pending Requests</h3>
            <p className="text-2xl font-bold text-white mt-1">{stats.pendingPGs}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="pt-8">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => navigate('/admin/pgs')}
            className="p-4 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-600/30 rounded-xl flex items-center gap-3 transition-colors group cursor-pointer"
          >
            <div className="p-2 bg-indigo-600 rounded-lg text-white group-hover:scale-110 transition-transform">
              <ClipboardList size={20} />
            </div>
            <div className="text-left">
              <h3 className="text-indigo-400 font-semibold">Manage PGs</h3>
              <p className="text-gray-500 text-xs mt-0.5">View and edit all listings</p>
            </div>
          </button>
          
          <button 
             onClick={() => navigate('/admin/pgs?openAdd=true')}
             className="p-4 bg-green-600/10 hover:bg-green-600/20 border border-green-600/30 rounded-xl flex items-center gap-3 transition-colors group cursor-pointer"
          >
            <div className="p-2 bg-green-600 rounded-lg text-white group-hover:scale-110 transition-transform">
              <Users size={20} />
            </div>
             <div className="text-left">
              <h3 className="text-green-400 font-semibold">Add New PG</h3>
              <p className="text-gray-500 text-xs mt-0.5">Create a new listing</p>
            </div>
          </button>

             <button 
             onClick={() => navigate('/admin/users')}
             className="p-4 bg-purple-600/10 hover:bg-purple-600/20 border border-purple-600/30 rounded-xl flex items-center gap-3 transition-colors group cursor-pointer"
          >
            <div className="p-2 bg-purple-600 rounded-lg text-white group-hover:scale-110 transition-transform">
              <Users size={20} />
            </div>
             <div className="text-left">
              <h3 className="text-purple-400 font-semibold">Manage Users</h3>
              <p className="text-gray-500 text-xs mt-0.5">View Registered Users</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
