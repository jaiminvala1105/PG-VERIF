import React, { useState } from 'react';
import { __DB } from "../backend/firebaseConfig"; 
import { toast } from "react-hot-toast";
import { addDoc as firestoreAddDoc, collection as firestoreCollection } from "firebase/firestore";

const Hero = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    collegeName: '',
    companyName: '',
    contactNumber: '',
    email: '',
    userType: 'Student', // Default to Student
    consent: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleUserTypeChange = (type) => {
    setFormData(prev => ({ ...prev, userType: type }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic Validation
    if (!formData.firstName || !formData.lastName || !formData.contactNumber || !formData.email) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!formData.consent) {
      toast.error("Please agree to the Terms and Privacy Policy.");
      return;
    }

    try {
      const collectionRef = firestoreCollection(__DB, "inquiries");
      await firestoreAddDoc(collectionRef, {
        ...formData,
        createdAt: new Date().toISOString()
      });
      
      toast.success("Inquiry sent successfully! We'll contact you soon.");
      
      // Reset Form
      setFormData({
        firstName: '',
        lastName: '',
        collegeName: '',
        companyName: '',
        contactNumber: '',
        email: '',
        userType: 'Student',
        consent: false
      });

    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Failed to send inquiry. Please try again.");
    }
  };

  const properties = [
    {
      id: 1,
      name: "Pg-Verif Aamrakunj",
      location: "PG in Chandkheda",
      gender: "Unisex",
      sharing: ["Triple", "Double"],
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80", // Placeholder
    },
    {
      id: 2,
      name: "Pg-Verif Navrangpura ",
      location: "PG in Navrangpura",
      gender: "Male",
      sharing: ["Double", "Triple"],
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80", // Placeholder
    },
    {
      id: 3,
      name: "Pg-Verif Bopal",
      location: "PG in Bopal",
      gender: "Male",
      sharing: ["Double", "Single"],
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80", // Placeholder
    }
  ];

  return (
    <div className="bg-gray-950 text-white min-h-screen py-8 pt-28"> 
      {/* Container to align content */}
      <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-8">
        
        {/* LEFT SECTION: Filters & Cards */}
        <div className="lg:w-2/3">
          
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-700 rounded-full hover:bg-gray-800 transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
              <span>Filters</span>
            </button>
            {['Navrangpura', 'Chandkheda', 'Bopal', 'Nirma'].map((filter) => (
              <button key={filter} className="px-5 py-2 border border-gray-700 rounded-full text-gray-300 hover:bg-gray-800 transition">
                {filter}
              </button>
            ))}
          </div>

          {/* Property Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((prop) => (
              <div key={prop.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-indigo-500/10 transition-shadow flex flex-col h-full">
                <div className="h-48 overflow-hidden shrink-0">
                  <img src={prop.image} alt={prop.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold mb-1">{prop.name}</h3>
                  <p className="text-gray-400 text-xs mb-4">{prop.location}</p>
                  
                  {/* Icons / Amenities Mockup */}
                  <div className="flex space-x-2 mb-4">
                    {/* Placeholder Icons */}
                    <div className="p-2 bg-gray-800 rounded-lg text-center flex-1">
                      <span className="block text-xs text-gray-400">Gender</span>
                      <span className="text-[10px] block truncate">{prop.gender}</span>
                    </div>
                    {prop.sharing.slice(0, 2).map((share, idx) => (
                      <div key={idx} className="p-2 bg-gray-800 rounded-lg text-center flex-1">
                        <span className="block text-xs text-gray-400">Share</span>
                        <span className="text-[10px] block truncate">{share}</span>
                      </div>
                    ))}
                  </div>

                  <button className="w-full py-2 border border-orange-500 text-orange-500 rounded-full font-semibold hover:bg-orange-600 hover:text-white transition mt-auto">
                    EXPLORE
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SECTION: Form */}
        <div className="lg:w-1/3">
          <div className="bg-gray-900 bg-opacity-50 p-6 rounded-3xl border border-gray-800 backdrop-blur-sm sticky top-28">
            <h2 className="text-3xl font-bold mb-1">Interested</h2>
            <h2 className="text-3xl font-bold mb-4 text-blue-200">in a <span className="text-blue-400">Hostel?</span></h2>
            <p className="text-gray-400 text-sm mb-6">Tell us your contact number and we'll reach out to you soon.</p>

            <form onSubmit={handleSubmit} className="space-y-4 ">
              <div className="flex gap-4">
                <div className="w-1/2">
                   {/* <label className="block text-xs text-gray-500 mb-1">First Name</label> */}
                   <input 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    className="w-full bg-transparent border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 placeholder-gray-600"
                   />
                </div>
                <div className="w-1/2">
                   {/* <label className="block text-xs text-gray-500 mb-1">Last Name</label> */}
                   <input 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    className="w-full bg-transparent border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 placeholder-gray-600"
                   />
                </div>
              </div>

              {formData.userType === 'Student' ? (
                <input 
                  name="collegeName"
                  value={formData.collegeName}
                  onChange={handleChange}
                  placeholder="College name"
                  className="w-full bg-transparent border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 placeholder-gray-600"
                />
              ) : (
                <input 
                  name="companyName"
                  value={formData.companyName || ''}
                  onChange={handleChange}
                  placeholder="Company Name"
                  className="w-full bg-transparent border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 placeholder-gray-600"
                />
              )}

              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">+91</span>
                <input 
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="Contact number"
                  className="w-full bg-transparent border border-gray-700 rounded-lg p-3 pl-12 text-white focus:outline-none focus:border-indigo-500 placeholder-gray-600"
                />
              </div>

              <input 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email ID"
                className="w-full bg-transparent border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 placeholder-gray-600"
              />

              {/* User Type Toggle */}
              <div className="flex bg-gray-800 rounded-lg p-1">
                <button 
                  type="button"
                  onClick={() => handleUserTypeChange('Student')}
                  className={`flex-1 py-2 text-sm rounded-md transition ${formData.userType === 'Student' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                >
                  Student
                </button>
                <button 
                  type="button"
                  onClick={() => handleUserTypeChange('Salaried')}
                  className={`flex-1 py-2 text-sm rounded-md transition ${formData.userType === 'Salaried' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                >
                  Salaried
                </button>
              </div>

              {/* Consent */}
              <div className="flex items-start space-x-2">
                <input 
                  type="checkbox" 
                  name="consent"
                  checked={formData.consent}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 bg-transparent border-gray-600 rounded focus:ring-indigo-500 focus:ring-offset-gray-900" 
                />
                <label className="text-xs text-gray-500 leading-tight">
                  I have read and agreed to the <a href="#" className="text-orange-500 hover:underline">Terms of Services</a> and <a href="#" className="text-orange-500 hover:underline">Privacy Policy</a> and hereby confirm to proceed.
                </label>
              </div>

              <button type="submit" className="w-full py-3 bg-orange-700 hover:bg-orange-600 text-white font-bold rounded-full transition shadow-lg shadow-orange-900/50">
                GET A CALL BACK
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Hero;
