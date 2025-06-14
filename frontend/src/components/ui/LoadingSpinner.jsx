import React from 'react';

const LoadingSpinner = ({ size = 20, color = 'white' }) => {
  return (
    <div className="flex items-center justify-center">
      <div className={`w-${size} h-${size} border-2 border-${color} border-t-transparent rounded-full animate-spin`} />
    </div>
  );
};

export default LoadingSpinner;
