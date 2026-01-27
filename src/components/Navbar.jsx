import React, { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import harryImg from "../assets/harry.jpeg";
import pgveriflogo from "../assets/pg-verif.png";
import { AuthUser } from "../Context/AuthUserContext";
import { FetchDataFromBackend } from "../context/BackendUserContext";

const Navbar = ({ onOpenContact }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  let { authusers, logout } = useContext(AuthUser);
  let {userData}=useContext(FetchDataFromBackend)

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      // Trigger effect after scrolling 30-40% of the viewport height
      const scrollThreshold = window.innerHeight * 0.35; 
      if (window.scrollY > scrollThreshold) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    if (location.pathname === '/') {
      window.addEventListener("scroll", handleScroll);
      // Reset scroll state when on home page
      handleScroll(); 
    } else {
      setIsScrolled(true); // Always "scrolled" style on other pages
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const handleContactClick = () => {
    // navigate('/'); // Removed forced navigation to allow modal to open on current page
    if (onOpenContact) {
      onOpenContact();
    }
  };

  let linkClasses = ({ isActive }) => {
    return `${
      isActive
        ? "bg-indigo-700 text-white shadow-md"
        : "hover:text-indigo-600 hover:bg-indigo-100"
    } px-4 py-2 text-base text-indigo-50 cursor-pointer rounded-lg transition-all duration-300 ease-in-out font-semibold`;
  };

  const buttonClasses = "hover:text-indigo-600 hover:bg-indigo-100 px-4 py-2 text-base text-indigo-50 cursor-pointer rounded-lg transition-all duration-300 ease-in-out font-semibold bg-transparent border-none";

  //! Anonoymous User => Login, SignUp
  let AnonymousUser = () => {
    return (
      <>
        <li>
          <NavLink to={"/auth/login"} className={linkClasses}>
            Login
          </NavLink>
        </li>
        <li>
          <NavLink to={"/auth/sign-up"} className={linkClasses}>
            Sign Up
          </NavLink>
        </li>
      </>
    );
  };

  //! Authenticated User => Profile, Logout
  let AuthenticatedUser = () => {
    return (
      <>
       {userData?.role === "admin" && (
          <li>
            <NavLink to={"/admin"} className={linkClasses}>
              Dashboard
            </NavLink>
          </li>
        )}
        <li className="flex items-center gap-3">
          <NavLink to={'/contact-us'} onClick={handleContactClick} className={buttonClasses}>
            ContactUs
          </NavLink>
        </li>
        <li>
          <NavLink to={"/pg"} className={linkClasses}>
            PG
          </NavLink>
        </li>
      </>
    );
  };

  return (
    <nav className={`fixed w-full z-30 top-0 start-0 transition-all duration-500 ease-in-out ${
      location.pathname !== '/' 
        ? "bg-indigo-600 shadow-lg border-b border-indigo-500" // Solid indigo for non-home pages
        : isScrolled 
          ? "bg-indigo-950/40 backdrop-blur-lg shadow-lg border-b border-indigo-500/20" 
          : "bg-transparent border-transparent shadow-none"
    } ${isMenuOpen ? "bg-indigo-900" : ""}`}>
      <div className="w-full flex flex-wrap items-center justify-between px-6 py-4">
        {/* Logo Section */}
        <NavLink to="/" className="flex items-center space-x-2">
          <img
            src={pgveriflogo}
            alt="PG-VERIF Logo"
            className="h-16 w-auto object-contain rounded"
          />
        </NavLink>

        <div className="flex items-center md:order-2 space-x-3">
          {/* Notification Bell (Crucial for Verification Updates) */}
          <button className="p-2 text-indigo-100 hover:bg-indigo-500 rounded-full relative">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-indigo-600"></span>
          </button>

          {/* User Profile + Dropdown */}
          <div className="relative">
            <button
              type="button"
              className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-indigo-300"
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            >
              <img
                className="w-10 h-10 rounded-full object-cover border-2 border-indigo-400"
                src={authusers?.photoURL || harryImg}
                alt="User"
              />
            </button>

            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl py-1 z-50 text-gray-700 border border-gray-100">
                <NavLink
                  to="/profile"
                  className="block px-4 py-2 hover:bg-indigo-50"
                >
                  My Profile
                </NavLink>
                <NavLink
                  to="/saved-pgs"
                  className="block px-4 py-2 hover:bg-indigo-50"
                >
                  Saved PGs
                </NavLink>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-indigo-50 p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>

        {/* Links & Search */}
        <div
          className={`w-full md:flex md:w-auto md:order-1 md:ml-auto md:mr-6 ${
            isMenuOpen ? "block" : "hidden"
          }`}
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 md:flex-row md:space-x-8 md:mt-0 font-medium items-center">
            <li>
              <NavLink to="/" className={linkClasses}>
                Home
              </NavLink>
            </li>
            {authusers ? <AuthenticatedUser /> : <AnonymousUser />}

            <li className="mt-2 md:mt-0">
              <div className="relative">
                <input
                  type="text"
                  className="bg-indigo-700 text-white text-sm rounded-lg focus:ring-yellow-300 focus:bg-white focus:text-gray-900 block w-full ps-10 p-2 placeholder-indigo-300"
                  placeholder="Search Area..."
                />
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-indigo-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
