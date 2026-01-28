import React from "react";
import Navbar from "../components/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/Footer";

const Layout = () => {
  const location = useLocation();

  return (
    <div>
      <Navbar />
      <main className={`${location.pathname === '/' ? '' : 'pt-28'} min-h-screen`}>
        <Outlet />
      </main>

      {location.pathname !== '/pg' && <Footer />}
    </div>
  );
};

export default Layout;
