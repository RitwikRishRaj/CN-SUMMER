import React from 'react';

const ShimmerEffect = ({ width = '100%', height = '100%' }) => {
  return (
    <div className="relative overflow-hidden rounded-lg">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
      <div className={`w-full h-full ${width} ${height} bg-gray-800/50`} />
    </div>
  );
};

export default ShimmerEffect;
