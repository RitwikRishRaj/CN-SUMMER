import React from 'react';

const GoogleIcon = ({ className, color = "#e5e7eb" }) => (
  <svg
    className={className}
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill={color}
      d="M44.5 20H24v8.5h11.7C34.9 33.7 30.2 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.1-6.1C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.6 20-21 0-1.4-.1-2.4-.3-3.5z"
    />
  </svg>
);

export default GoogleIcon;
