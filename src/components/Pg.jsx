import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaStar, FaArrowRight } from "react-icons/fa";

const PG_DATA = [
  {
    id: 1,
    name: "Sky High Residency",
    location: "Koramangala, Bangalore",
    image:
      "https://images.unsplash.com/photo-1522771753014-df7091c19680?q=80&w=2070&auto=format&fit=crop",
    price: "₹12,000/mo",
    rating: 4.5,
    match: "95% Match",
  },
  {
    id: 2,
    name: "Urban Nest PG",
    location: "Indiranagar, Bangalore",
    image:
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=2070&auto=format&fit=crop",
    price: "₹15,500/mo",
    rating: 4.8,
    match: "88% Match",
  },
  {
    id: 3,
    name: "Comfy Stayz",
    location: "HSR Layout, Bangalore",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1980&auto=format&fit=crop",
    price: "₹10,000/mo",
    rating: 4.2,
    match: "82% Match",
  },
  {
    id: 4,
    name: "Elite Living",
    location: "Whitefield, Bangalore",
    image:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2070&auto=format&fit=crop",
    price: "₹18,000/mo",
    rating: 4.9,
    match: "98% Match",
  },
  {
    id: 5,
    name: "Green View PG",
    location: "Jayanagar, Bangalore",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop",
    price: "₹11,500/mo",
    rating: 4.3,
    match: "75% Match",
  },
  {
    id: 6,
    name: "Tech City Stays",
    location: "Electronic City, Bangalore",
    image:
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=2070&auto=format&fit=crop",
    price: "₹9,000/mo",
    rating: 4.0,
    match: "70% Match",
  },
];

const PgCard = ({ pg }) => {
  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full transform hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={pg.image}
          alt={pg.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
          <FaStar className="text-yellow-400 text-sm" />
          <span className="text-sm font-bold text-gray-800">{pg.rating}</span>
        </div>
        <div className="absolute top-4 left-4 bg-indigo-600/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            {pg.match}
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent h-1/2" />
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow relative">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
            {pg.name}
          </h3>
          <div className="flex items-center text-gray-500 text-sm mt-1">
            <FaMapMarkerAlt className="mr-1.5 text-indigo-500" />
            <span className="truncate">{pg.location}</span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
          <div>
            <p className="text-xs text-gray-400 uppercase font-medium">
              Starting from
            </p>
            <p className="text-lg font-bold text-indigo-600">{pg.price}</p>
          </div>
          <Link
            to={`/pg/${pg.id}`}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-sm"
          >
            <FaArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

const Pg = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Discover Your Perfect <span className="text-indigo-600">Stay</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our curated list of premium PGs and verified stays tailored
            to your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {PG_DATA.map((pg) => (
            <PgCard key={pg.id} pg={pg} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            to="/contact-us"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Can't find what you're looking for?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Pg;
