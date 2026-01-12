import React from 'react';
import { ShieldCheck, Search, Users, Headset } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      id: 1,
      icon: <ShieldCheck className="w-8 h-8 text-blue-500" />,
      title: "Verified Listings",
      description: "All PG accommodations are verified for authenticity and safety"
    },
    {
      id: 2,
      icon: <Search className="w-8 h-8 text-blue-500" />,
      title: "Easy Search",
      description: "Find your perfect PG with advanced filters and search options"
    },
    {
      id: 3,
      icon: <Users className="w-8 h-8 text-blue-500" />,
      title: "Trusted Community",
      description: "Join thousands of satisfied tenants and property owners"
    },
    {
      id: 4,
      icon: <Headset className="w-8 h-8 text-blue-500" />,
      title: "24/7 Support",
      description: "Get help anytime with our dedicated customer support team"
    }
  ];

  return (
    <div className="bg-gray-950 py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Choose PG Finder?</h2>
          <p className="text-gray-400">We make finding and listing PG accommodations simple, safe, and hassle-free</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.id} className="flex flex-col items-center text-center p-6">
              <div className="bg-gray-900 p-4 rounded-full mb-6 border border-gray-800 shadow-lg shadow-blue-500/5 hover:border-blue-500/30 transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
