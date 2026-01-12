import { addDoc, collection } from "firebase/firestore";
import React, { useState } from 'react';
import toast from "react-hot-toast";
import { __DB } from "../backend/firebaseConfig"; 

const ContactUs = ({ onClose }) => {
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
      const collectionRef = collection(__DB, "inquiries");
      await addDoc(collectionRef, {
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
      if (onClose) onClose();

    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Failed to send inquiry. Please try again.");
    }
  };

  return (
    <div className="bg-gray-900 bg-opacity-95 p-6 rounded-3xl border border-gray-800 backdrop-blur-sm relative max-w-md w-full mx-auto shadow-2xl mt-6">
      {/* Close Button */}
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-full p-2 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      )}

      <h2 className="text-3xl font-bold mb-1 text-white">Interested</h2>
      <h2 className="text-3xl font-bold mb-4 text-blue-200">in a <span className="text-blue-400">Hostel?</span></h2>
      <p className="text-gray-400 text-sm mb-6">Tell us your contact number and we'll reach out to you soon.</p>

      <form onSubmit={handleSubmit} className="space-y-4 ">
        <div className="flex gap-4">
          <div className="w-1/2">
             <input 
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First name"
              className="w-full bg-transparent border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 placeholder-gray-600"
             />
          </div>
          <div className="w-1/2">
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
  )
}

export default ContactUs