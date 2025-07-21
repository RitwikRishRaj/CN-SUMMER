import { useState } from 'react';
import { FiUser } from 'react-icons/fi';

const ProfilePicture = ({ src, alt = "Profile", className = "", size = "w-24 h-24" }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  // If no src or image failed to load, show fallback
  if (!src || imageError) {
    return (
      <div className={`${size} rounded-full bg-white/5 border-2 border-white/10 flex items-center justify-center ${className}`}>
        <FiUser className="w-12 h-12 text-gray-500" />
      </div>
    );
  }

  // Try different URL formats for Google profile pictures
  const getOptimizedImageUrl = (url) => {
    if (!url) return url;
    
    // If it's a Google profile picture, try different size parameters
    if (url.includes('googleusercontent.com')) {
      // Remove existing size parameters and add a more compatible one
      const baseUrl = url.split('=')[0];
      return `${baseUrl}=s200`; // Use s200 instead of s96-c
    }
    
    return url;
  };

  const optimizedSrc = getOptimizedImageUrl(src);

  return (
    <div className={`${size} rounded-full bg-white/5 border-2 border-white/10 flex items-center justify-center overflow-hidden ${className}`}>
      <img
        src={optimizedSrc}
        alt={alt}
        className="w-full h-full object-cover"
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{ display: imageLoaded ? 'block' : 'none' }}
        referrerPolicy="no-referrer"
      />
      {/* Show loading state */}
      {!imageLoaded && !imageError && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="relative">
            {/* Outer spinning ring with gradient */}
            <div className="animate-spin rounded-full h-12 w-12 relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-75"></div>
              <div className="absolute inset-1 rounded-full bg-gray-900"></div>
              <div className="absolute inset-2 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-50"></div>
              <div className="absolute inset-3 rounded-full bg-gray-900"></div>
            </div>
            
            {/* Inner pulsing elements */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Center dot */}
                <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                {/* Orbiting dots */}
                <div className="absolute -inset-2 animate-spin" style={{animationDuration: '2s'}}>
                  <div className="w-1 h-1 bg-blue-400 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2"></div>
                </div>
                <div className="absolute -inset-2 animate-spin" style={{animationDuration: '3s', animationDirection: 'reverse'}}>
                  <div className="w-1 h-1 bg-purple-400 rounded-full absolute bottom-0 left-1/2 transform -translate-x-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePicture;
