import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Mail, User, MessageSquare, CheckCircle, Ticket } from 'lucide-react';
import { addDoc, collection } from 'firebase/firestore';
import { __DB } from '../backend/firebaseConfig';
import toast from 'react-hot-toast';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    message: ''
  });
  const [ticketCreated, setTicketCreated] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const faqs = [
    {
      question: 'How to book a visit?',
      answer: 'To book a visit, browse through our verified PG listings, select your preferred property, and click on the "Schedule Visit" button. You can choose your preferred date and time, and the owner will be notified immediately. You\'ll receive a confirmation via email and SMS.'
    },
    {
      question: 'Is my payment secure?',
      answer: 'Absolutely! We use industry-standard encryption and secure payment gateways to process all transactions. Your financial information is never stored on our servers. We support multiple payment methods including UPI, Net Banking, Credit/Debit Cards, and Wallets.'
    },
    {
      question: 'What is the verification process for PGs?',
      answer: 'All PGs listed on PG-VERIF undergo a rigorous verification process. Our team physically visits each property, verifies ownership documents, checks amenities, and ensures safety standards are met. Only verified properties are shown on the platform with a "Verified" badge.'
    },
    {
      question: 'Can I cancel my booking?',
      answer: 'Yes, you can cancel your booking from your dashboard. Cancellation policies vary by property and are clearly mentioned at the time of booking. Generally, free cancellation is available up to 48 hours before your check-in date. For cancellations within 48 hours, a nominal fee may apply.'
    }
  ];

  const categories = [
    'General Inquiry',
    'Booking & Payments',
    'Property Verification',
    'Account & Profile',
    'Technical Support',
    'Refund & Cancellation',
    'Other'
  ];

  const handleFAQToggle = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateTicketId = () => {
    const randomNum = Math.floor(Math.random() * 90000) + 10000;
    return `PG-${randomNum}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.category || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const newTicketId = generateTicketId();
      const collectionRef = collection(__DB, 'helpTickets');
      
      await addDoc(collectionRef, {
        ...formData,
        ticketId: newTicketId,
        status: 'open',
        createdAt: new Date().toISOString()
      });

      setTicketId(newTicketId);
      setTicketCreated(true);
      toast.success('Support ticket created successfully!');

      // Reset form
      setFormData({
        name: '',
        email: '',
        category: '',
        message: ''
      });

    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error('Failed to create ticket. Please try again.');
    }
  };

  const handleNewTicket = () => {
    setTicketCreated(false);
    setTicketId('');
  };

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 px-6 overflow-hidden bg-gradient-to-br from-indigo-950 via-gray-900 to-gray-950">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>

        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 bg-indigo-900/40 border border-indigo-500/30 rounded-full px-5 py-2 mb-6 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="text-sm text-indigo-200 font-medium">We're here to help</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
            How can we help you?{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-600">
              
            </span>
          </h1>

          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Search our knowledge base or get in touch with our support team
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help..."
              className="w-full bg-gray-800/50 border border-gray-700 text-white text-lg rounded-2xl pl-16 pr-6 py-5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder-gray-500 backdrop-blur-sm"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 px-6 bg-gray-900/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-400">Quick answers to common questions</p>
          </div>

          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-800/50 border border-gray-700/50 rounded-2xl overflow-hidden backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/30"
              >
                <button
                  onClick={() => handleFAQToggle(index)}
                  className="w-full flex items-center justify-between p-6 text-left transition-colors hover:bg-gray-800/80"
                >
                  <span className="text-lg font-semibold text-white pr-4">{faq.question}</span>
                  {expandedFAQ === index ? (
                    <ChevronUp className="w-6 h-6 text-orange-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                
                {expandedFAQ === index && (
                  <div className="px-6 pb-6 pt-0">
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-4"></div>
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No FAQs found matching your search.</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 px-6 bg-gray-950">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4">Still need help?</h2>
            <p className="text-gray-400">Can't find what you're looking for? Send us a message and we'll get back to you.</p>
          </div>

          {!ticketCreated ? (
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-indigo-500 to-orange-500"></div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div className="relative group">
                  <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className="w-full bg-gray-900/50 border border-gray-600 text-white text-sm rounded-xl pl-12 p-3.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder-gray-500"
                  />
                </div>

                {/* Email */}
                <div className="relative group">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    className="w-full bg-gray-900/50 border border-gray-600 text-white text-sm rounded-xl pl-12 p-3.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder-gray-500"
                  />
                </div>

                {/* Category Dropdown */}
                <div className="relative group">
                  <MessageSquare className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-indigo-500 transition-colors z-10" />
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-gray-900/50 border border-gray-600 text-white text-sm rounded-xl pl-12 p-3.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-gray-800">Select a category</option>
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat} className="bg-gray-800">{cat}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-gray-500 pointer-events-none" />
                </div>

                {/* Message */}
                <div className="relative group">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Describe your issue or question..."
                    className="w-full bg-gray-900/50 border border-gray-600 text-white text-sm rounded-xl p-4 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder-gray-500 resize-none"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-600/30 transform transition-all duration-200 hover:-translate-y-1 focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:ring-offset-gray-900"
                >
                  Submit Ticket
                </button>
              </form>
            </div>
          ) : (
            // Success State
            <div className="bg-gradient-to-br from-indigo-900/40 to-gray-800/40 border border-indigo-500/30 rounded-3xl p-8 md:p-10 shadow-2xl text-center relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-indigo-500 to-green-500"></div>
              
              {/* Success Icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-4 relative">
                <CheckCircle className="w-12 h-12 text-green-500" />
                <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
              </div>

              <h3 className="text-3xl font-bold text-white mb-3">Ticket Created Successfully!</h3>
              
              <div className="inline-flex items-center space-x-3 bg-gray-900/60 border border-gray-700 rounded-xl px-6 py-4 mb-4">
                <Ticket className="w-6 h-6 text-orange-400" />
                <div className="text-left">
                  <p className="text-xs text-gray-400 mb-0.5">Your Ticket ID</p>
                  <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">
                    #{ticketId}
                  </p>
                </div>
              </div>

              <p className="text-gray-300 mb-6 max-w-md mx-auto leading-relaxed">
                Our support team has received your request and will get back to you within 24 hours. 
                Please check your email for updates.
              </p>

              <button
                onClick={handleNewTicket}
                className="inline-flex items-center justify-center px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all duration-200 border border-gray-700 hover:border-gray-600"
              >
                Submit Another Ticket
              </button>
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default HelpCenter;
