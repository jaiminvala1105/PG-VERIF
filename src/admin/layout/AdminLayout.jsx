import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';


import Navbar from '../../components/Navbar'; // Import Navbar

const AdminLayout = () => {

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden">
      <Navbar /> {/* Add Universal Navbar */}
      <div className="flex flex-1 w-full pt-20"> {/* Increased padding-top for more space */}
        <AdminSidebar />
        <main className="flex-1 overflow-auto p-8 relative"> {/* Increased padding for more space */}
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
