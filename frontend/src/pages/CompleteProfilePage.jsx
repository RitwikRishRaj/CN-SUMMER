import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Squares from '../components/Squares';
import collegesData from '../data/college.json';

const CompleteProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Education options
  const degreeOptions = [
    'B.Tech', 'B.E.', 'B.Sc', 'B.Com', 'BBA', 'BA', 
    'M.Tech', 'MBA', 'MCA', 'Other'
  ];

  const branchOptions = [
    'Computer Science', 'Information Technology', 'Electronics',
    'Mechanical', 'Civil', 'Electrical', 'Electronics & Communication',
    'Aerospace', 'Biotechnology', 'Chemical', 'Other'
  ];

  // Generate graduation years (from 1976 to 2030)
  const currentYear = new Date().getFullYear();
  const endYear = 2030;
  const startYear = 1976;
  const yearOptions = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => (startYear + i).toString()
  ).reverse();
  
  // This will ensure the component updates if the year changes
  const [currentYearState, setCurrentYearState] = useState(currentYear);
  
  useEffect(() => {
    const timer = setInterval(() => {
      const newYear = new Date().getFullYear();
      if (newYear !== currentYearState) {
        setCurrentYearState(newYear);
      }
    }, 1000 * 60 * 60 * 24); // Check once per day
    
    return () => clearInterval(timer);
  }, [currentYearState]);

  // College data imported from JSON
  const colleges = collegesData;

  const [collegeSearch, setCollegeSearch] = useState('');
  const [collegeSuggestions, setCollegeSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [comingFromModal, setComingFromModal] = useState(false);
  
  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  };
  
  // Memoize the filter function
  const filterColleges = useCallback((searchTerm) => {
    if (!searchTerm.trim()) {
      setCollegeSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const filtered = colleges.filter(college =>
        college && typeof college === 'string' && 
        college.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 10);
      
      setCollegeSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      setIsSearching(false);
    }, 300);
  }, [colleges]);
  
  // Create debounced version of the filter function
  const debouncedFilterColleges = useCallback(
    debounce((searchTerm) => filterColleges(searchTerm), 300),
    [filterColleges]
  );
  
  // Update effect to use debounced search
  useEffect(() => {
    debouncedFilterColleges(collegeSearch);
    
    // Cleanup function to cancel any pending debounced calls
    return () => {
      debouncedFilterColleges.cancel?.();
    };
  }, [collegeSearch, debouncedFilterColleges]);

  const [formData, setFormData] = useState({
    degree: '',
    branch: '',
    college: '',
    graduationYear: '',
    bio: ''
  });

  // Check if user is already logged in and has completed profile
  useEffect(() => {
    const checkProfile = async () => {
      const fromModal = sessionStorage.getItem('fromSimpleModal');
      
      if (fromModal) {
        setComingFromModal(true);
        sessionStorage.removeItem('fromSimpleModal');
        setLoading(false);
        return;
      }
      
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile?.username) {
          navigate('/dashboard');
          return;
        }
      } catch (error) {
        console.error('Error checking profile:', error);
      } finally {
        setLoading(false);
      }
    };

    checkProfile();
  }, [user, navigate]);

  useEffect(() => {
    if (comingFromModal) {
      const savedData = localStorage.getItem('userProfile');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setFormData(prev => ({
          ...prev,
          ...(parsedData.degree && { degree: parsedData.degree }),
          ...(parsedData.branch && { branch: parsedData.branch }),
          ...(parsedData.college && { college: parsedData.college }),
          ...(parsedData.graduationYear && { graduationYear: parsedData.graduationYear }),
          ...(parsedData.bio && { bio: parsedData.bio })
        }));
      }
    }
  }, [comingFromModal]);

  useEffect(() => {
    if (collegeSearch.trim() === '') {
      setCollegeSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const searchTerm = collegeSearch.toLowerCase();
    const filtered = colleges.filter(college =>
      college && typeof college === 'string' && college.toLowerCase().includes(searchTerm)
    ).slice(0, 10); // Limit to 10 suggestions for performance
    
    setCollegeSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  }, [collegeSearch, colleges]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'college') {
      // Only update the search term, form data will be updated on selection
      setCollegeSearch(value);
    }
    
    // For bio field, enforce max length
    if (name === 'bio' && value.length > 500) {
      setErrors(prev => ({
        ...prev,
        bio: 'Bio must be less than 500 characters'
      }));
      return;
    }
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      [name]: name === 'college' ? value.trim() : value
    }));
    
    // Clear any existing errors for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.degree) newErrors.degree = 'Please select a degree';
    if (!formData.branch) newErrors.branch = 'Please select a branch';
    if (!formData.college) newErrors.college = 'Please select or enter your college';
    if (!formData.graduationYear) newErrors.graduationYear = 'Please select graduation year';
    if (formData.bio && formData.bio.length > 500) newErrors.bio = 'Bio must be less than 500 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveFormData = () => {
    localStorage.setItem('userProfile', JSON.stringify({
      degree: formData.degree,
      branch: formData.branch,
      college: formData.college,
      graduationYear: formData.graduationYear,
      bio: formData.bio
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    if (!validateForm()) {
      setSubmitting(false);
      return;
    }

    try {
      if (comingFromModal) {
        saveFormData();
        window.dispatchEvent(new Event('profileUpdated'));
      } else {
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            degree: formData.degree,
            branch: formData.branch,
            college: formData.college.trim(),
            graduation_year: formData.graduationYear,
            bio: formData.bio.trim(),
            updated_at: new Date().toISOString()
          });

        if (error) throw error;

        // Mark onboarding as completed in users table
        const { error: userUpdateError } = await supabase
          .from('users')
          .update({
            onboarding_completed: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (userUpdateError) throw userUpdateError;
      }

      // Navigate to home page after successful submission
      navigate('/');
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors(prev => ({
        ...prev,
        submit: error.message || 'Failed to update profile. Please try again.'
      }));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-transparent">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Background effect */}
      <div className="absolute inset-0 z-0">
        <Squares
          speed={0.5}
          squareSize={40}
          direction='diagonal'
          borderColor="#610094"
          noiseIntensity={1.5}
          rotation={0}
          className="w-full h-full"
        />
      </div>
      
      {/* Main content */}
      <div className="relative z-10 w-full max-w-6xl px-4 sm:px-8">
        <div className="flex flex-col md:flex-row gap-6 w-full">
          {/* Left container - Original Form */}
          <div className="w-full md:w-2/3 lg:w-2/5 bg-gradient-to-br from-[#191825]/30 to-[#2a1b3d]/40 backdrop-blur-lg rounded-xl p-6 sm:p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] border border-white/20 relative overflow-hidden transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 mix-blend-overlay pointer-events-none"></div>
          
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white">
                Complete Your Profile
              </h2>
              <p className="mt-2 text-sm text-gray-300">
                Set up your profile to get started
              </p>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.submit && (
                <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-left">
                  {errors.submit}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Degree Field */}
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="degree" className="block text-sm font-medium text-gray-300 mb-1">
                    Degree <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="degree"
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required
                  >
                  <option value="">Select Degree</option>
                  {degreeOptions.map(degree => (
                    <option key={degree} value={degree}>
                      {degree}
                    </option>
                  ))}
                </select>
                {errors.degree && (
                  <p className="mt-1 text-sm text-red-400">{errors.degree}</p>
                )}
              </div>

                {/* Branch Field */}
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="branch" className="block text-sm font-medium text-gray-300 mb-1">
                    Branch <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="branch"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required
                  >
                  <option value="">Select Branch</option>
                  {branchOptions.map(branch => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
                {errors.branch && (
                  <p className="mt-1 text-sm text-red-400">{errors.branch}</p>
                )}
              </div>

                {/* College Field */}
                <div className="col-span-2 relative">
                  <label htmlFor="college" className="block text-sm font-medium text-gray-300 mb-1">
                    College/University <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="college"
                      name="college"
                      value={collegeSearch}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Enter your college or university"
                      required
                      autoComplete="off"
                    />
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                </div>
                {showSuggestions && collegeSuggestions.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {isSearching ? (
                      <div className="p-2 text-center text-gray-400">Searching...</div>
                    ) : collegeSuggestions.length === 0 && collegeSearch ? (
                      <div className="p-2 text-gray-400">No colleges found. Try a different search term.</div>
                    ) : (
                      collegeSuggestions.map((college, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, college }));
                            setCollegeSearch(college);
                            setShowSuggestions(false);
                          }}
                        >
                          {college}
                        </div>
                      ))
                    )}
                  </div>
                )}
                {errors.college && (
                  <p className="mt-1 text-sm text-red-400">{errors.college}</p>
                )}
              </div>

                {/* Graduation Year */}
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-300 mb-1">
                    Graduation Year <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="graduationYear"
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required
                  >
                  <option value="">Select Year</option>
                  {yearOptions.map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                {errors.graduationYear && (
                  <p className="mt-1 text-sm text-red-400">{errors.graduationYear}</p>
                )}
              </div>

                {/* Bio Field */}
                <div className="col-span-2">
                  <div className="flex items-center gap-2 mb-1">
                    <label htmlFor="bio" className="text-sm font-medium text-gray-300">
                      Bio
                    </label>
                    <span className="text-xs text-gray-400">
                      ({formData.bio?.length || 0}/250)
                    </span>
                  </div>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 min-h-[120px]"
                    placeholder="Tell us about yourself... (max 250 characters)"
                    maxLength={250}
                  />
                  {errors.bio && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.bio}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="col-span-2 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/20"
                  >
                    {submitting ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        
        {/* Right container */}
        <div className="w-full md:w-3/5 lg:w-3/5 bg-gradient-to-br from-[#191825]/30 to-[#2a1b3d]/40 backdrop-blur-lg rounded-xl p-6 sm:p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] border border-white/20 relative overflow-hidden transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 mix-blend-overlay pointer-events-none"></div>
          <div className="relative z-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white">
                Additional Information
              </h2>
              <p className="mt-2 text-sm text-gray-300">
                More details about your profile
              </p>
            </div>
            {/* Add your right container content here */}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default CompleteProfilePage;