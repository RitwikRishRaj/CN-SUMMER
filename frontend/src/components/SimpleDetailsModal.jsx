import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './Modal.css';
import LoadingSpinner from './ui/LoadingSpinner';

function SimpleDetailsModal({ onClose, initialData = {} }) {
  const [formData, setFormData] = useState({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    username: initialData.username || ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(''); // 'checking', 'available', 'taken', 'invalid'
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const navigate = useNavigate();
  const formRef = useRef(null);
  const usernameCheckTimeoutRef = useRef(null);

  const checkUsernameAvailability = async (username) => {
    if (!username || username.length < 3) {
      setUsernameStatus('');
      return;
    }

    // Basic validation first
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setUsernameStatus('invalid');
      return;
    }

    setIsCheckingUsername(true);
    setUsernameStatus('checking');

    try {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .single();

      if (existingUser) {
        setUsernameStatus('taken');
      } else {
        setUsernameStatus('available');
      }
    } catch (error) {
      // If no user found (PGRST116), username is available
      if (error.code === 'PGRST116') {
        setUsernameStatus('available');
      } else {
        console.error('Error checking username:', error);
        setUsernameStatus('');
      }
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear errors for the field being edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Debounced username availability check
    if (name === 'username') {
      // Clear previous timeout
      if (usernameCheckTimeoutRef.current) {
        clearTimeout(usernameCheckTimeoutRef.current);
      }

      // Set new timeout for checking
      usernameCheckTimeoutRef.current = setTimeout(() => {
        checkUsernameAvailability(value.trim());
      }, 500); // 500ms debounce
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Only letters, numbers, and underscores allowed';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (usernameStatus === 'taken') {
      newErrors.username = 'This username is already taken';
    } else if (usernameStatus === 'checking' || isCheckingUsername) {
      newErrors.username = 'Checking username availability...';
    } else if (usernameStatus !== 'available' && formData.username.trim().length >= 3) {
      newErrors.username = 'Please wait for username availability check';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if all fields contain '1' and navigate if true
  useEffect(() => {
    if (formData.firstName === '1' && 
        formData.lastName === '1' && 
        formData.username === '1') {
      // Set a flag in sessionStorage to indicate we're coming from the modal
      sessionStorage.setItem('fromSimpleModal', 'true');
      navigate('/complete-profile');
      if (onClose) onClose();
    }
  }, [formData, navigate, onClose]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (usernameCheckTimeoutRef.current) {
        clearTimeout(usernameCheckTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Check for special case first
      if (formData.firstName === '1' && 
          formData.lastName === '1' && 
          formData.username === '1') {
        return; // The useEffect will handle the navigation
      }
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setErrors({ submit: 'No user session found. Please log in again.' });
        return;
      }
      
      // Check if username is taken
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('username', formData.username)
        .neq('id', user.id)
        .single();
        
      if (existingUser) {
        setErrors({ username: 'This username is already taken' });
        return;
      }
      
      // Save profile data to the users table
      const { error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
          username: formData.username.trim(),
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      // Close the modal on success
      onClose();
      
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrors({ 
        submit: error.message || 'Failed to save profile. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-container" ref={formRef}>
      <div className="modal-content">
        <h2 className="text-2xl font-semibold text-white text-center mb-6">
          Assign your user handles
        </h2>
        
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded text-red-200 text-sm">
            {errors.submit}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-content space-y-6">
            <div>
              <label 
                htmlFor="firstName" 
                className="modal-label flex items-center gap-1"
              >
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                className={`modal-input ${errors.firstName ? 'border-red-500' : 'border-gray-700'}`}
                aria-invalid={!!errors.firstName}
                aria-describedby={errors.firstName ? 'firstNameError' : undefined}
                disabled={isSubmitting}
              />
              {errors.firstName && (
                <p id="firstNameError" className="text-red-500 text-sm mt-1">
                  {errors.firstName}
                </p>
              )}
            </div>

            <div>
              <label 
                htmlFor="lastName" 
                className="modal-label flex items-center gap-1"
              >
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                className={`modal-input ${errors.lastName ? 'border-red-500' : 'border-gray-700'}`}
                aria-invalid={!!errors.lastName}
                aria-describedby={errors.lastName ? 'lastNameError' : undefined}
                disabled={isSubmitting}
              />
              {errors.lastName && (
                <p id="lastNameError" className="text-red-500 text-sm mt-1">
                  {errors.lastName}
                </p>
              )}
            </div>

            <div>
              <label 
                htmlFor="username" 
                className="modal-label flex items-center gap-1"
              >
                Username <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  className={`modal-input pr-10 ${
                    errors.username 
                      ? 'border-red-500' 
                      : usernameStatus === 'available' 
                        ? 'border-green-500' 
                        : usernameStatus === 'taken' 
                          ? 'border-red-500'
                          : 'border-gray-700'
                  }`}
                  aria-invalid={!!errors.username}
                  aria-describedby={errors.username ? 'usernameError' : undefined}
                  disabled={isSubmitting}
                />
                {/* Status indicator */}
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {isCheckingUsername ? (
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : usernameStatus === 'available' ? (
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : usernameStatus === 'taken' ? (
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  ) : null}
                </div>
              </div>
              {errors.username ? (
                <p id="usernameError" className="text-red-500 text-sm mt-1">
                  {errors.username}
                </p>
              ) : usernameStatus === 'available' ? (
                <p className="text-green-500 text-sm mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Username is available!
                </p>
              ) : usernameStatus === 'taken' ? (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Username is already taken
                </p>
              ) : usernameStatus === 'invalid' ? (
                <p className="text-red-500 text-sm mt-1">
                  Only letters, numbers, and underscores allowed
                </p>
              ) : (
                <p className="text-gray-400 text-xs mt-1">
                  Letters, numbers, and underscores only. Min 3 characters.
                </p>
              )}
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button 
              type="submit" 
              className="modal-button flex items-center justify-center gap-2"
              disabled={isSubmitting || isCheckingUsername || (formData.username.trim().length >= 3 && usernameStatus !== 'available')}
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" />
                  Saving...
                </>
              ) : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SimpleDetailsModal;
