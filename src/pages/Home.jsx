import React from 'react';
import Hero from '../components/Hero';
import FeaturedPGs from '../components/FeaturedPGs';
import WhyChooseUs from '../components/WhyChooseUs';

const Home = () => {
  return (
    <div>
      <Hero />
      <FeaturedPGs />
      <WhyChooseUs />
      <div className="container">
        {/* Placeholder for future content below the Hero section */}
      </div>
    </div>
  );
};

export default Home;
