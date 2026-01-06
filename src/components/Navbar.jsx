import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import harryImg from '../assets/harry.jpeg';
import pgveriflogo from '../assets/pg-verif.png'
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  return (
    <nav className="bg-indigo-600 fixed w-full z-30 top-0 start-0 border-b border-indigo-500 shadow-lg">
      <div className="w-full flex flex-wrap items-center justify-between px-6 py-4">
        
        {/* Logo Section */}
        <a href="/" className="flex items-center space-x-2">
          <img src={pgveriflogo} alt="PG-VERIF Logo" className="h-16 w-auto object-contain rounded" />
        </a>

        <div className="flex items-center md:order-2 space-x-3">
          {/* Notification Bell (Crucial for Verification Updates) */}
          <button className="p-2 text-indigo-100 hover:bg-indigo-500 rounded-full relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
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
              <img className="w-15 h-15 rounded-full border-2 border-indigo-400" src={harryImg} alt="User" />
            </button>
            
            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl py-1 z-50 text-gray-700 border border-gray-100">
                <div className="px-4 py-2 text-xs text-gray-500 border-b">Verified Tenant</div>
                <a href="#" className="block px-4 py-2 hover:bg-indigo-50">My KYC Status</a>
                <a href="#" className="block px-4 py-2 hover:bg-indigo-50">Saved PGs</a>
                <a href="#" className="block px-4 py-2 text-red-600 hover:bg-red-50">Logout</a>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Links & Search */}
        <div className={`w-full md:flex md:w-auto md:order-1 md:ml-auto md:mr-6 ${isMenuOpen ? 'block' : 'hidden'}`}>
          <ul className="flex flex-col p-4 md:p-0 mt-4 md:flex-row md:space-x-8 md:mt-0 font-medium items-center">
            <li><NavLink to="/" className={({isActive}) => `block py-2 ${isActive ? 'text-yellow-300' : 'text-indigo-100'} font-bold hover:scale-110 hover:text-indigo-200 transition-all duration-300 transform`}>Home</NavLink></li>
            <li><NavLink to="/auth/login" className={({isActive}) => `block py-2 ${isActive ? 'text-yellow-300' : 'text-indigo-100'} hover:scale-110 hover:text-indigo-200 transition-all duration-300 transform`}>Login</NavLink></li>
            <li><NavLink to="/auth/sign-up" className={({isActive}) => `block py-2 ${isActive ? 'text-yellow-300' : 'text-indigo-100'} hover:scale-110 hover:text-indigo-200 transition-all duration-300 transform`}>Sign Up</NavLink></li>
            
            <li className="mt-2 md:mt-0">
              <div className="relative">
                <input 
                  type="text" 
                  className="bg-indigo-700 text-white text-sm rounded-lg focus:ring-yellow-300 focus:bg-white focus:text-gray-900 block w-full ps-10 p-2 placeholder-indigo-300" 
                  placeholder="Search Area..." 
                />
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg className="w-4 h-4 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
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