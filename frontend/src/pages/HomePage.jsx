import React from 'react';
import Aurora from '../components/AuroraBackground';
import NavBar from '../components/NavBar';
import DatabaseTest from '../components/DatabaseTest';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <Aurora 
        colorStops={["#150050", "#3F0071", "#690091"]}
        blend={0.5}
        amplitude={0.5}
        speed={0.75}
        className="absolute inset-0 z-0"
      />
      <div className="relative z-10">
        <NavBar />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-4xl font-bold text-center mb-8">Welcome to CN Summer</h1>
              <DatabaseTest />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
