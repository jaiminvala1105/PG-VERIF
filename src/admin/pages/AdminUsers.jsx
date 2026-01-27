import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { __DB } from '../../backend/firebaseConfig';
import { Trash2, User, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';



const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(__DB, 'users'));
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching Users:", error);
      toast.error("Failed to fetch Users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (id) => {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden`}
      >
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
               <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                 <Trash2 className="h-6 w-6 text-red-600" aria-hidden="true" />
               </div>
            </div>
            <div className="ml-3 flex-1 pt-0.5">
              <p className="text-sm font-medium text-gray-900">
                Delete User
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Are you sure? This action cannot be undone.
              </p>
            </div>
          </div>
        </div>
        <div className="flex bg-gray-50 px-4 py-3 gap-3 justify-end">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await deleteDoc(doc(__DB, 'users', id));
                toast.success("User Profile Deleted Successfully!");
                fetchUsers();
              } catch (error) {
                console.error("Error deleting user:", error);
                toast.error("Failed to delete user");
              }
            }}
            className="px-3 py-2 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  if (loading) return <div className="text-white">Loading Users...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent flex items-center gap-3 mt-4 ml-2">
        <Link 
          to="/admin" 
          className="bg-gray-800 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-indigo-600 transition-all duration-300 shadow-lg shadow-gray-900/20 group border border-gray-700 hover:border-indigo-500" 
          title="Back to Dashboard"
        >
          <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform duration-300" />
        </Link>
        Manage Users
      </h1>
      
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-lg">
        {users.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-gray-300">
              <thead className="bg-gray-800 text-gray-100 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                         <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
                           <User size={14} />
                         </div>
                      )}
                      <span className="font-medium text-white">{user.fullName || user.displayName || 'Unknown'}</span>
                    </td>
                    <td className="px-6 py-4">{user.email || 'N/A'}</td>
                    <td className="px-6 py-4">{user.contactNumber || 'N/A'}</td>
                    <td className="px-6 py-4">
                      {user.role === 'admin' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          User
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 flex justify-center">
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                        title="Delete User"
                        disabled={user.role === 'admin'} // Prevent deleting admins via UI for safety
                      >
                        <Trash2 size={18} />
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
  );
};

export default AdminUsers;
