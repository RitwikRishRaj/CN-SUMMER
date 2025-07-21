import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import SimpleDetailsModal from '../components/SimpleDetailsModal';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [googleUserData, setGoogleUserData] = useState(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (data.session) {
          const user = data.session.user;
          
          // Check if user profile exists in our users table
          const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

          if (fetchError && fetchError.code !== 'PGRST116') {
            // PGRST116 is "not found" error, which is expected for new users
            throw fetchError;
          }

          if (!existingUser) {
            // New user - extract info from Google OAuth data
            const firstName = user.user_metadata?.full_name?.split(' ')[0] || 
                             user.user_metadata?.name?.split(' ')[0] || 
                             'User';
            const lastName = user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || 
                            user.user_metadata?.name?.split(' ').slice(1).join(' ') || 
                            '';
            
            // Generate a username from email or name
            const baseUsername = user.email?.split('@')[0] || 
                                firstName.toLowerCase() + 
                                Math.random().toString(36).substring(2, 6);

            // Create user profile
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                id: user.id,
                first_name: firstName,
                last_name: lastName,
                username: baseUsername,
                onboarding_completed: false,
                updated_at: new Date().toISOString()
              });

            if (insertError) {
              throw insertError;
            }

            // Store Google profile picture and email in user_settings
            const googleProfilePic = user.user_metadata?.avatar_url || 
                                   user.user_metadata?.picture || '';
            
            if (googleProfilePic) {
              const { error: settingsError } = await supabase
                .from('user_settings')
                .insert({
                  id: user.id,
                  profile_pic: googleProfilePic,
                  email: user.email,
                  updated_at: new Date().toISOString()
                });
              
              // Don't throw error if settings insert fails, just log it
              if (settingsError) {
                console.error('Error storing user settings:', settingsError);
              }
            }

            // Store Google OAuth data and show details modal for new user
            const modalFirstName = user.user_metadata?.given_name || user.user_metadata?.full_name?.split(' ')[0] || '';
            const modalLastName = user.user_metadata?.family_name || user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '';
            
            setGoogleUserData({
              firstName: modalFirstName,
              lastName: modalLastName,
              username: '' // Let user choose their username
            });
            setIsNewUser(true);
            setLoading(false);
            setShowDetailsModal(true);
          } else {
            // Existing user - check if they completed their profile
            if (!existingUser.onboarding_completed) {
              navigate('/complete-profile');
            } else {
              // Check if they have extended profile data
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

              if (!profile) {
                navigate('/complete-profile');
              } else {
                navigate('/');
              }
            }
          }
        } else {
          // No session found, redirect to login
          navigate('/login');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setError(error.message || 'Authentication failed');
        
        // Redirect to login after a delay
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  const handleModalClose = () => {
    setShowDetailsModal(false);
    // After modal closes, redirect to complete profile
    navigate('/complete-profile');
  };

  if (loading && !showDetailsModal) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-white mt-4">Completing sign in...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-900/50 text-red-200 p-4 rounded-lg mb-4">
            <h2 className="text-lg font-semibold mb-2">Authentication Error</h2>
            <p>{error}</p>
          </div>
          <p className="text-gray-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (showDetailsModal) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <SimpleDetailsModal 
          onClose={handleModalClose} 
          initialData={googleUserData}
        />
      </div>
    );
  }

  return null;
};

export default AuthCallback;
