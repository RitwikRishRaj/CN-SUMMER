import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './Modal.css';
import LoadingSpinner from './ui/LoadingSpinner';

function SimpleDetailsModal({ onClose }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const formRef = useRef(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className={`modal-input ${errors.username ? 'border-red-500' : 'border-gray-700'}`}
                aria-invalid={!!errors.username}
                aria-describedby={errors.username ? 'usernameError' : undefined}
                disabled={isSubmitting}
              />
              {errors.username ? (
                <p id="usernameError" className="text-red-500 text-sm mt-1">
                  {errors.username}
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
              disabled={isSubmitting}
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
