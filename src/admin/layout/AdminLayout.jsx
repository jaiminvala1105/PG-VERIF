import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';


import Navbar from '../../components/Navbar'; // Import Navbar
import ContactUs from '../../components/ContactUs'; // Import ContactUs

const AdminLayout = () => {
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden">
      <Navbar onOpenContact={() => setShowContactModal(true)} /> {/* Add Universal Navbar with Contact logic */}
      <div className="flex flex-1 w-full pt-20"> {/* Increased padding-top for more space */}
        <AdminSidebar />
        <main className="flex-1 overflow-auto p-8 relative"> {/* Increased padding for more space */}
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm p-4">
          <ContactUs onClose={() => setShowContactModal(false)} />
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
