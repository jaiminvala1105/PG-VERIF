import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import ContactUs from "../components/ContactUs";
import Footer from "../components/Footer";

const Layout = () => {
  const [showContactModal, setShowContactModal] = useState(false);
  const location = useLocation();

  return (
    <div>
      <Navbar />
      <main className="pt-28 min-h-screen">
        <Outlet />
      </main>

      {location.pathname !== '/pg' && <Footer />}

      {/* Global Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm p-4">
          <ContactUs onClose={() => setShowContactModal(false)} />
        </div>
      )}
    </div>
  );
};

export default Layout;
