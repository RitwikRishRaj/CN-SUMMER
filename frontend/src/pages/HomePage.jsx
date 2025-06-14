import React from 'react';
import Aurora from '../components/AuroraBackground';
import NavBar from '../components/NavBar';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <Aurora 
        colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
        blend={0.5}
        amplitude={0.5}
        speed={0.5}
        className="absolute inset-0 z-0"
      />
      <div className="relative z-10">
        <NavBar />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Main content goes here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
