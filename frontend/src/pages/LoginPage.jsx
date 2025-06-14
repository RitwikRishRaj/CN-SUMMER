import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { FcGoogle } from 'react-icons/fc';
import SimpleDetailsModal from '../components/SimpleDetailsModal';
import Silk from '../components/Silk';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    // For now, simulate a successful login with the test user
    const mockUser = {
      id: 'test-google-user-123',
      email: 'google@example.com',
      user_metadata: {
        username: 'googleuser',
        first_name: 'Google',
        last_name: 'User'
      }
    };
    
    try {
      setLoading(true);
      // Store in localStorage for session management
      localStorage.setItem('user', JSON.stringify(mockUser));
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error during Google login:', error);
      setError('Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    const enteredUsername = username.trim();
    
    if (!enteredUsername) {
      setError('Please enter a username');
      return;
    }
    
    // Basic validation
    if (enteredUsername.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(enteredUsername)) {
      setError('Username can only contain letters, numbers, and underscores');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Special case for 'codeChan' to show details modal
      if (enteredUsername.toLowerCase() === 'codechan') {
        setShowDetailsModal(true);
        return;
      }
      
      // For other usernames, continue with normal flow
      const mockUser = {
        id: `user-${Date.now()}`,
        email: `${enteredUsername.toLowerCase()}@example.com`,
        user_metadata: {
          username: enteredUsername,
          first_name: enteredUsername.charAt(0).toUpperCase() + enteredUsername.slice(1),
          last_name: 'User',
          created_at: new Date().toISOString()
        }
      };
      
      // Check if username is already taken in localStorage
      const existingUsers = JSON.parse(localStorage.getItem('mockUsers') || '{}');
      const usernameExists = Object.values(existingUsers).some(
        (user) => user.user_metadata && user.user_metadata.username && 
                 user.user_metadata.username.toLowerCase() === enteredUsername.toLowerCase()
      );
      
      if (usernameExists) {
        setError('This username is already taken');
        return;
      }
      
      // Store in localStorage for session management
      existingUsers[mockUser.id] = mockUser;
      localStorage.setItem('mockUsers', JSON.stringify(existingUsers));
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Navigate to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Error during login:', error);
      setError(error.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Silk
          speed={5}
          scale={1}
          color="#610094"
          noiseIntensity={1.5}
          rotation={0}
          className="w-full h-full"
        />
      </div>
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Container - Login Form */}
          <div className="w-full lg:w-1/2">
            <div className="bg-gradient-to-br from-[#191825]/40 to-[#2a1b3d]/50 backdrop-blur-md rounded-xl p-6 sm:p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] border border-white/10 relative overflow-hidden w-full">
              {/* Glass overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 mix-blend-overlay pointer-events-none"></div>
              <div className="relative z-10">
                <div className="text-center mb-5">
                  <h2 className="text-2xl font-bold text-white">
                    CodeChan
                  </h2>
                  <p className="mt-1 text-sm text-gray-400">
                    Sign in to continue
                  </p>
                </div>
                
                <form onSubmit={handleUsernameSubmit} className="space-y-4">
                  {error && (
                    <div className="p-2 text-sm bg-red-900/50 text-red-200 rounded-lg">
                      {error}
                    </div>
                  )}
                  
                  <div className="space-y-1.5">
                    <label htmlFor="username" className="block text-xs font-medium text-gray-300">
                      Username
                    </label>
                    <div className="relative">
                      <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        className="w-full px-3 py-2 text-sm bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        disabled={loading}
                        autoComplete="username"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={loading || !username.trim()}
                      className="w-full py-2 px-4 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Signing in...
                        </>
                      ) : 'Sign In'}
                    </button>
                  </div>
                  
                  <div className="flex items-center my-3">
                    <div className="flex-1 h-px bg-gray-700"></div>
                    <span className="px-3 text-xs text-gray-400">OR</span>
                    <div className="flex-1 h-px bg-gray-700"></div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 text-sm bg-white text-gray-800 font-medium py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 border border-gray-300"
                  >
                    <FcGoogle className="w-4 h-4" />
                    Continue with Google
                  </button>
                </form>
                
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    By continuing, you agree to our{' '}
                    <a href="#" className="text-blue-400 hover:underline">Terms</a> and{' '}
                    <a href="#" className="text-blue-400 hover:underline">Privacy Policy</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Container - Additional Content */}
          <div className="w-full lg:w-1/2">
            <div className="bg-gradient-to-br from-[#191825]/40 to-[#2a1b3d]/50 backdrop-blur-md rounded-xl p-6 sm:p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] border border-white/10 relative overflow-hidden h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 mix-blend-overlay pointer-events-none"></div>
              <div className="relative z-10 h-full flex flex-col">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    Welcome to CodeChan
                  </h2>
                  <p className="mt-2 text-sm text-gray-400">
                    Join our community of developers
                  </p>
                </div>
                
                <div className="space-y-4 flex-1 flex flex-col justify-center">
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <h3 className="font-medium text-white mb-2">🚀 Key Features</h3>
                    <ul className="text-sm space-y-2 text-gray-300">
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Real-time code collaboration</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Integrated development environment</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Smart code suggestions</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white/5 p-4 rounded-lg border border-white/10 mt-4">
                    <h3 className="font-medium text-white mb-2">💡 Quick Tips</h3>
                    <p className="text-sm text-gray-300">
                      Sign in with Google for a faster experience and to access all features across devices.
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 text-center text-xs text-gray-500">
                  <p>Need help? <a href="#" className="text-blue-400 hover:underline">Contact support</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showDetailsModal && (
        <SimpleDetailsModal 
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </div>
  );
}

export default LoginPage;