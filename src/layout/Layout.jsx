import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <Navbar />
      <main className="pt-24 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
