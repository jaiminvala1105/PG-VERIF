import React from 'react';
import Hero from '../components/Hero';

const Home = () => {
  return (
    <div>
      <Hero />
      <div className="container mx-auto px-4 py-8">
        {/* Placeholder for future content below the Hero section */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4 dark:text-gray-200">More details coming soon...</h2>
      </div>
    </div>
  );
};

export default Home;
