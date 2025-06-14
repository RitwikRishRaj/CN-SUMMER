import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NavBar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const navItems = [
    { label: 'AI', to: '/ai' },
    { label: 'Friends', to: '/friends' },
    { label: 'Event Calendar', to: '/calendar' },
    { label: 'Profile Tracker', to: '/profile-tracker' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-4xl font-bold text-white hover:text-gray-200 transition-colors"
            onClick={() => window.scrollTo(0, 0)}
          >
            CodeChan
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 h-16">
            {navItems.map((item) => (
              <div key={item.to} className="relative group">
                <Link
                  to={item.to}
                  className={`relative z-10 px-4 py-2 transition-all duration-300 ${
                    location.pathname === item.to 
                      ? 'text-white text-xl font-bold transform scale-105' 
                      : 'text-gray-300 hover:text-white text-lg font-medium hover:font-semibold'
                  }`}
                >
                  {item.label}
                  <span 
                    className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 ${
                      location.pathname === item.to 
                        ? 'w-full opacity-100' 
                        : 'group-hover:w-full group-hover:opacity-100'
                    }`}
                  />
                </Link>
              </div>
            ))}
            
            {currentUser ? (
              <button
                onClick={handleLogout}
                className="text-lg text-gray-300 hover:text-white px-4 py-2 font-medium border border-gray-600 rounded-md hover:bg-white/10 transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="group relative inline-flex items-center justify-center px-6 py-2.5 overflow-hidden font-medium text-white transition-all duration-300 bg-gradient-to-r from-[#150050] via-[#3F0071] to-[#610094] rounded-lg hover:shadow-[0_0_15px_rgba(63,0,113,0.7)] focus:ring-4 focus:ring-purple-500/30 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span className="relative">Login</span>
                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-lg"></span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{
                  animation: 'shimmer 3s infinite linear',
                  backgroundSize: '200% 100%',
                  backgroundPosition: '150% 0',
                }}></span>
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button className="text-gray-300 hover:text-white">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
