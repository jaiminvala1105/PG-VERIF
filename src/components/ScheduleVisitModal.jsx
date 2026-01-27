import React, { useState, useEffect } from 'react';
import { FaTimes, FaWhatsapp } from 'react-icons/fa';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { __DB } from '../backend/firebaseConfig';
import { toast } from 'react-hot-toast';

const ScheduleVisitModal = ({ isOpen, onClose, pgName, initialTab = 'visit' }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState(initialTab);
  const [whatsappUpdates, setWhatsappUpdates] = useState(true);
  const [userType, setUserType] = useState('Student'); // 'Student' or 'Salaried'
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    place: '' // College Name or Company Name
  });

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(__DB, "leads"), {
        ...formData,
        fullName: `${formData.firstName} ${formData.lastName}`,
        type: activeTab, // 'visit' or 'callback'
        userType,
        whatsappUpdates,
        pgName,
        createdAt: serverTimestamp(),
        status: 'new'
      });

      toast.success(activeTab === 'visit' ? "Visit Scheduled Successfully!" : "Callback Requested!");
      
      // WhatsApp Redirection
      if (whatsappUpdates) {
          const message = encodeURIComponent(`Hi, I'm ${formData.firstName}. I just scheduled a visit for ${pgName} on the website. Please confirm my slot.`);
          // Owner Phone Number
          const adminPhoneNumber = "919099361105"; 
          window.open(`https://wa.me/${adminPhoneNumber}?text=${message}`, '_blank');
      }

      setFormData({ firstName: '', lastName: '', email: '', phone: '', place: '' });
      onClose();
    } catch (error) {
      console.error("Error submitting lead:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1a1b1e] w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative border border-gray-800 flex flex-col max-h-[90vh]">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10 bg-gray-800/50 p-2 rounded-full"
        >
          <FaTimes />
        </button>

        <div className="p-6 pt-10 overflow-y-auto custom-scrollbar">
          
          {/* Tabs */}
          <div className="flex bg-[#25262b] p-1 rounded-full mb-6 relative shrink-0">
             <div 
               className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#2e8b7d] rounded-full transition-all duration-300 ease-in-out ${
                 activeTab === 'visit' ? 'left-1' : 'left-[calc(50%+2px)]'
               }`}
             ></div>
             <button
                onClick={() => setActiveTab('visit')}
                className={`flex-1 relative z-10 py-2.5 text-sm font-semibold text-center rounded-full transition-colors ${
                  activeTab === 'visit' ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                }`}
             >
                Schedule a Visit
             </button>
             <button
                onClick={() => setActiveTab('callback')}
                className={`flex-1 relative z-10 py-2.5 text-sm font-semibold text-center rounded-full transition-colors ${
                  activeTab === 'callback' ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                }`}
             >
                Request a callback
             </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Student / Salaried Toggle */}
             <div className="flex justify-center mb-2">
                <div className="bg-[#25262b] p-1 rounded-lg inline-flex">
                   {['Student', 'Salaried'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setUserType(type)}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                           userType === type ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'
                        }`}
                      >
                         {type}
                      </button>
                   ))}
                </div>
             </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
                <input 
                  type="text" 
                  name="firstName"
                  placeholder="First Name"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full bg-[#25262b] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#2e8b7d] transition-colors"
                />
                <input 
                  type="text" 
                  name="lastName"
                  placeholder="Last Name"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full bg-[#25262b] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#2e8b7d] transition-colors"
                />
            </div>

            {/* College / Work */}
            <input 
               type="text" 
               name="place"
               placeholder={userType === 'Student' ? "College Name" : "Company Name"}
               required
               value={formData.place}
               onChange={handleChange}
               className="w-full bg-[#25262b] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#2e8b7d] transition-colors"
            />

             {/* Phone */}
             <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <img 
                     src="https://flagcdn.com/w20/in.png" 
                     alt="India" 
                     className="w-5 h-5 rounded-full object-cover mr-2"
                   />
                   <span className="text-gray-400 text-sm font-medium pr-2 border-r border-gray-600">+91</span>
                </div>
                <input 
                   type="tel" 
                   name="phone"
                   placeholder="Mobile Number"
                   required
                   value={formData.phone}
                   onChange={handleChange}
                   className="w-full bg-[#25262b] border border-gray-700 rounded-xl pl-24 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#2e8b7d] transition-colors"
                />
             </div>

              {/* Email */}
              <input 
                  type="email" 
                  name="email"
                  placeholder="Email Address"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#25262b] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#2e8b7d] transition-colors"
               />


            {/* Info Box */}
            <div className="bg-[#25262b] border border-[#2e8b7d]/30 rounded-xl p-3 text-center">
               <p className="text-[#2e8b7d] text-xs font-medium">
                  We accept bookings with a minimum stay of 3 months.
               </p>
            </div>

            {/* WhatsApp Updates */}
            <div className="flex items-center justify-between py-2">
               <div className="flex items-center gap-2 text-white text-sm font-medium">
                  <div className="bg-green-500/20 p-1.5 rounded-full">
                     <FaWhatsapp className="text-green-500 text-lg" />
                  </div>
                  Get updates over WhatsApp
               </div>
               <button
                 type="button" 
                 role="switch"
                 onClick={() => setWhatsappUpdates(!whatsappUpdates)}
                 className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    whatsappUpdates ? 'bg-[#2e8b7d]' : 'bg-gray-600'
                 }`}
               >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      whatsappUpdates ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
               </button>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3">
               <div className="relative flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    required
                    className="h-5 w-5 rounded border-gray-600 bg-[#25262b] text-[#2e8b7d] focus:ring-[#2e8b7d] focus:ring-offset-[#1a1b1e]"
                    defaultChecked
                  />
               </div>
               <label htmlFor="terms" className="text-xs text-gray-400 leading-tight">
                  {activeTab === 'visit' ? (
                    <>I have read and agreed to the <a href="#" className="text-[#2e8b7d] hover:underline">terms and conditions</a> and <a href="#" className="text-[#2e8b7d] hover:underline">privacy policy</a> and hereby confirm to proceed.</>
                  ) : (
                    <>By clicking on the button I agree to the <a href="#" className="text-[#2e8b7d] hover:underline">Terms & Conditions</a>.</>
                  )}
               </label>
            </div>

            {/* Submit Button */}
            <button
               type="submit" 
               disabled={loading}
               className="w-full bg-[#2e8b7d] hover:bg-[#257a6e] disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-[#2e8b7d]/20 mt-2"
            >
               {loading ? 'Submitting...' : (activeTab === 'visit' ? 'Schedule a Visit' : 'Request Callback')}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ScheduleVisitModal;
