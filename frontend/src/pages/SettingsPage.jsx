import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import NavBar from '../components/NavBar';
import ProfilePicture from '../components/ProfilePicture';
import { FiUser, FiMail, FiGlobe, FiBriefcase, FiLink, FiCode, FiAward, FiEye, FiCheckCircle, FiAlertCircle, FiSave } from 'react-icons/fi';
import { FaGithub, FaHackerrank } from 'react-icons/fa';
import { SiCodeforces, SiCodechef, SiGeeksforgeeks, SiLeetcode, SiCodingninjas } from 'react-icons/si';
import { motion, AnimatePresence } from 'framer-motion';

const SettingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('basic');
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ type: null, message: '' });
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    // Basic Info
    profilePic: '',
    codeChanId: '',
    firstName: '',
    lastName: '',
    email: user?.email || '',
    bio: '',
    country: '',

    // Education
    college: '',
    degree: '',
    branch: '',
    graduationYear: '',

    // Socials
    linkedin: '',
    twitter: '',
    portfolio: '',
    resume: '',

    // Coding Platforms
    github: '',
    leetcode: '',
    hackerrank: '',
    codeforces: '',
    codechef: '',
    geeksforgeeks: '',
    codingninja: '',
    atcoder: '',

    // Accounts
    codolioId: '',

    // Preferences
    theme: 'system',
    notifications: true,
    emailNotifications: true,
  });

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        // Fetch user data from users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        // Fetch profile data from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        // Fetch settings data from user_settings table
        const { data: settingsData, error: settingsError } = await supabase
          .from('user_settings')
          .select('*')
          .eq('id', user.id)
          .single();

        // Extract Google profile data from user metadata
        const googleProfilePic = user.user_metadata?.avatar_url || 
                                user.user_metadata?.picture || '';
        const googleFirstName = user.user_metadata?.full_name?.split(' ')[0] || 
                               user.user_metadata?.given_name || 
                               userData?.first_name || '';
        const googleLastName = user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || 
                              user.user_metadata?.family_name || 
                              userData?.last_name || '';



        // Update form data with fetched information
        setFormData(prev => ({
          ...prev,
          // Basic Info - prioritize Google data
          profilePic: googleProfilePic || settingsData?.profile_pic || '',
          firstName: googleFirstName,
          lastName: googleLastName,
          email: user.email || '',
          bio: profileData?.bio || '',
          
          // Education Info
          college: profileData?.college || '',
          degree: profileData?.degree || '',
          branch: profileData?.branch || '',
          graduationYear: profileData?.graduation_year || '',
          
          // Settings Info
          codeChanId: settingsData?.code_chan_id || '',
          country: settingsData?.country || '',
          linkedin: settingsData?.linkedin_url || '',
          twitter: settingsData?.twitter_url || '',
          portfolio: settingsData?.portfolio_url || '',
          github: settingsData?.github_username || '',
        }));

      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [user]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName?.trim()) newErrors.firstName = 'First name is required';
    if (!formData.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Please enter a valid email';
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    setErrors(formErrors);
    
    if (Object.keys(formErrors).length > 0) {
      setSaveStatus({
        type: 'error',
        message: 'Please fix the errors in the form.'
      });
      return;
    }

    setIsLoading(true);
    setSaveStatus({ type: null, message: '' });

    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Update users table (basic info)
      const { error: userError } = await supabase
        .from('users')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (userError) throw userError;

      // Update or insert profiles table (education info)
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          bio: formData.bio,
          college: formData.college,
          degree: formData.degree,
          branch: formData.branch,
          graduation_year: formData.graduationYear,
          updated_at: new Date().toISOString()
        });

      if (profileError) throw profileError;

      // Update or insert user_settings table (settings and social info)
      const { error: settingsError } = await supabase
        .from('user_settings')
        .upsert({
          id: user.id,
          profile_pic: formData.profilePic,
          code_chan_id: formData.codeChanId,
          email: formData.email,
          country: formData.country,
          linkedin_url: formData.linkedin,
          twitter_url: formData.twitter,
          portfolio_url: formData.portfolio,
          github_username: formData.github,
          updated_at: new Date().toISOString()
        });

      if (settingsError) throw settingsError;
      
      setSaveStatus({
        type: 'success',
        message: 'Settings saved successfully!'
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveStatus({ type: null, message: '' });
      }, 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus({
        type: 'error',
        message: error.message || 'Failed to save settings. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: <FiUser className="mr-2" /> },
    { id: 'socials', label: 'Socials', icon: <FiLink className="mr-2" /> },
    { id: 'coding-platforms', label: 'Coding Platforms', icon: <FiCode className="mr-2" /> },
    { id: 'accounts', label: 'Account', icon: <FiUser className="mr-2" /> },
  ];

  // Animation variants for the save status message
  const statusVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-black">
      <NavBar />
      <div className="flex relative bg-black pt-16">
        {/* Sidebar */}
        <div className="w-64 bg-white/5 backdrop-blur-sm text-white p-6 pt-8 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto border-r border-white/10">
          <div className="sticky top-0 pt-2 pb-6 z-10">
            <h1 className="text-2xl font-semibold text-white mb-1">Settings</h1>
            <p className="text-sm text-gray-400">Manage your account preferences</p>
          </div>
          <nav className="space-y-1 mt-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white/10 text-white border border-white/20'
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent hover:border-white/10'
                }`}
              >
                <span className="flex items-center">
                  {React.cloneElement(tab.icon, { className: 'mr-3' + (activeTab === tab.id ? ' text-white' : '') })}
                  {tab.label}
                </span>
              </motion.button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 shadow-2xl shadow-black/50 p-6 max-w-5xl mx-auto w-full">
            <AnimatePresence mode="wait">
              {saveStatus.message && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={statusVariants}
                  className={`mb-6 p-4 rounded-xl backdrop-blur-sm ${
                    saveStatus.type === 'success' 
                      ? 'bg-green-500/10 border border-green-500/30 text-green-400 shadow-lg shadow-green-500/10' 
                      : 'bg-red-500/10 border border-red-500/30 text-red-400 shadow-lg shadow-red-500/10'
                  }`}
                >
                  <div className="flex items-center">
                    {saveStatus.type === 'success' ? (
                      <FiCheckCircle className="mr-2" />
                    ) : (
                      <FiAlertCircle className="mr-2" />
                    )}
                    {saveStatus.message}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <form onSubmit={handleSubmit} className="space-y-6 text-gray-100">
              {/* Profile Information Tab - Combined Basic Info and Education */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <div className="border-b border-white/10 pb-4 mb-6">
                    <h2 className="text-xl font-semibold text-white">
                      Profile Information
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                      Update your personal and educational details
                    </p>
                  </div>
                  
                  {/* Profile Picture Section */}
                  <div className="flex items-center space-x-6">
                    <ProfilePicture 
                      src={formData.profilePic} 
                      alt="Profile Picture" 
                      size="w-24 h-24"
                    />

                    <div>
                      <button
                        type="button"
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-all border border-white/20 hover:border-white/30"
                      >
                        Change Photo
                      </button>
                      <p className="text-xs text-gray-500 mt-1">JPG, GIF or PNG. Max size 2MB</p>
                    </div>
                  </div>

                  {/* Personal Information Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* CodeChan ID (Display Only) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">CodeChan ID</label>
                      <div className="bg-white/5 border border-white/10 text-gray-300 rounded-lg h-10 px-3 flex items-center">
                        {formData.codeChanId || 'user123'}
                      </div>
                    </div>

                    {/* First Name */}
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName || ''}
                        onChange={handleInputChange}
                        className="bg-white/5 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-white/20 focus:border-white/20 h-10 px-3 w-full transition-all"
                        placeholder="Enter your first name"
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName || ''}
                        onChange={handleInputChange}
                        className="bg-white/5 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-white/20 focus:border-white/20 h-10 px-3 w-full transition-all"
                        placeholder="Enter your last name"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email || ''}
                        onChange={handleInputChange}
                        className="bg-gray-800 border border-gray-700 text-gray-400 rounded-lg h-10 px-3 w-full cursor-not-allowed"
                        disabled
                      />
                    </div>

                    {/* Country */}
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-1">Country</label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={formData.country || ''}
                        onChange={handleInputChange}
                        className="bg-white/5 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-white/20 focus:border-white/20 h-10 px-3 w-full transition-all"
                        placeholder="Enter your country"
                      />
                    </div>

                    {/* Education Section Header */}
                    <div className="md:col-span-2 pt-4">
                      <h3 className="text-lg font-medium text-gray-200 mb-2">Education Details</h3>
                      <div className="h-px bg-white/10 w-full mb-4"></div>
                    </div>

                    {/* College/University */}
                    <div className="md:col-span-2">
                      <label htmlFor="college" className="block text-sm font-medium text-gray-300 mb-1">College/University</label>
                      <input
                        type="text"
                        id="college"
                        name="college"
                        value={formData.college || ''}
                        onChange={handleInputChange}
                        className="bg-white/5 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-white/20 focus:border-white/20 h-10 px-3 w-full transition-all"
                        placeholder="Enter your college/university name"
                      />
                    </div>

                    {/* Degree */}
                    <div>
                      <label htmlFor="degree" className="block text-sm font-medium text-gray-300 mb-1">Degree</label>
                      <select
                        id="degree"
                        name="degree"
                        value={formData.degree || ''}
                        onChange={handleInputChange}
                        className="bg-white/5 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-white/20 focus:border-white/20 h-10 px-3 w-full transition-all"
                      >
                        <option value="">Select degree</option>
                        <option value="btech">Bachelor of Technology (B.Tech)</option>
                        <option value="bsc">Bachelor of Science (B.Sc)</option>
                        <option value="bca">Bachelor of Computer Applications (BCA)</option>
                        <option value="mtech">Master of Technology (M.Tech)</option>
                        <option value="msc">Master of Science (M.Sc)</option>
                        <option value="mca">Master of Computer Applications (MCA)</option>
                        <option value="phd">Doctor of Philosophy (PhD)</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Branch */}
                    <div>
                      <label htmlFor="branch" className="block text-sm font-medium text-gray-300 mb-1">Branch/Field</label>
                      <input
                        type="text"
                        id="branch"
                        name="branch"
                        value={formData.branch || ''}
                        onChange={handleInputChange}
                        className="bg-white/5 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-white/20 focus:border-white/20 h-10 px-3 w-full transition-all"
                        placeholder="e.g., Computer Science"
                      />
                    </div>

                    {/* Year of Graduation */}
                    <div>
                      <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-300 mb-1">Year of Graduation</label>
                      <select
                        id="graduationYear"
                        name="graduationYear"
                        value={formData.graduationYear || ''}
                        onChange={handleInputChange}
                        className="bg-white/5 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-white/20 focus:border-white/20 h-10 px-3 w-full transition-all"
                      >
                        <option value="">Select year</option>
                        {Array.from({length: 10}, (_, i) => new Date().getFullYear() + i).map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Bio Section */}
                  <div className="pt-2">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio || ''}
                      onChange={handleInputChange}
                      rows="3"
                      className="bg-white/5 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-white/20 focus:border-white/20 w-full p-3 transition-all"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>
              )}

              {/* Social Media Links */}
              {activeTab === 'socials' && (
                <div className="space-y-6">
                  <div className="border-b border-white/10 pb-4 mb-6">
                    <h2 className="text-xl font-semibold text-white">Social Profiles</h2>
                    <p className="text-sm text-gray-400 mt-1">Connect your social and professional accounts</p>
                  </div>
                  <div className="space-y-4">
                    {/* LinkedIn */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <div className="flex items-center mb-4">
                        <svg className="w-6 h-6 text-[#0A66C2] mr-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        <h3 className="text-lg font-medium text-gray-300">LinkedIn</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Profile URL</label>
                          <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-white/10 bg-white/5 text-gray-400 text-sm">
                              linkedin.com/in/
                            </span>
                            <input
                              type="text"
                              name="linkedin"
                              value={formData.linkedin || ''}
                              onChange={handleInputChange}
                              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-white/10 bg-white/5 text-white focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
                              placeholder="username"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* X (Twitter) */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <div className="flex items-center mb-4">
                        <svg className="w-5 h-5 text-gray-300 mr-3" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                        <h3 className="text-lg font-medium text-gray-300">X</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Profile URL</label>
                          <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-white/10 bg-white/5 text-gray-400 text-sm">
                              x.com/
                            </span>
                            <input
                              type="text"
                              name="twitter"
                              value={formData.twitter || ''}
                              onChange={handleInputChange}
                              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-white/10 bg-white/5 text-white focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
                              placeholder="username"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Portfolio Website */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <div className="flex items-center mb-4">
                        <svg className="w-6 h-6 text-purple-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-300">Portfolio Website</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Website URL</label>
                          <input
                            type="url"
                            name="portfolio"
                            value={formData.portfolio || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
                            placeholder="https://yourportfolio.com"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Resume */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <div className="flex items-center mb-4">
                        <svg className="w-6 h-6 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-300">Resume</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1">Google Drive Link</label>
                          <input
                            type="url"
                            name="resume"
                            value={formData.resume || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
                            placeholder="https://drive.google.com/..."
                          />
                          <p className="mt-1 text-xs text-gray-500">Make sure the link has view permissions set to 'Anyone with the link'</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'coding-platforms' && (
                <div className="space-y-6">
                  <div className="border-b border-white/10 pb-4 mb-6">
                    <h2 className="text-xl font-semibold text-white">Coding Platforms</h2>
                    <p className="text-sm text-gray-400 mt-1">Connect and verify your coding profiles</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-200 mb-2">Development</h3>
                    <div className="flex items-center mb-4">
                      <FaGithub className="w-5 h-5 mr-2 text-gray-300" />
                      <span className="w-32">GitHub</span>
                      <input
                        type="text"
                        name="github"
                        value={formData.github}
                        onChange={handleInputChange}
                        className="flex-1 bg-white/5 border border-white/10 text-white rounded-lg h-10 px-3 mx-2 transition-all"
                        placeholder="Your GitHub username"
                      />
                      <button type="button" className="px-4 py-2 bg-gradient-to-r from-blue-600/90 to-purple-600/90 hover:from-blue-700 hover:to-purple-700 text-white rounded-md transition-all shadow-lg shadow-blue-500/20">Connect</button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-200 mb-2">Problem Solving</h3>
                    {[
                      { name: 'LeetCode', key: 'leetcode', icon: <SiLeetcode className="w-5 h-5 mr-2 text-orange-500" /> },
                      { name: 'HackerRank', key: 'hackerrank', icon: <FaHackerrank className="w-5 h-5 mr-2 text-green-500" /> },
                      { name: 'Codeforces', key: 'codeforces', icon: <SiCodeforces className="w-5 h-5 mr-2 text-red-500" /> },
                      { name: 'AtCoder', key: 'atcoder', icon: <FiAward className="w-5 h-5 mr-2 text-blue-500" /> },
                      { name: 'CodeChef', key: 'codechef', icon: <SiCodechef className="w-5 h-5 mr-2 text-yellow-600" /> },
                      { name: 'GFG', key: 'geeksforgeeks', icon: <SiGeeksforgeeks className="w-5 h-5 mr-2 text-green-600" /> },
                      { name: 'Coding Ninja', key: 'codingninja', icon: <SiCodingninjas className="w-5 h-5 mr-2 text-orange-400" /> },
                    ].map(platform => (
                      <div key={platform.key} className="flex items-center mb-4">
                        {platform.icon || <FiCode className="w-5 h-5 mr-2" />}
                        <span className="w-32">{platform.name}</span>
                        <input
                          type="text"
                          name={platform.key}
                          value={formData[platform.key]}
                          onChange={handleInputChange}
                          className="flex-1 bg-white/5 border border-white/10 text-white rounded-lg h-10 px-3 mx-2 transition-all"
                          placeholder={`Your ${platform.name} username`}
                        />
                        <button type="button" className="px-4 py-2 bg-gradient-to-r from-blue-600/90 to-purple-600/90 hover:from-blue-700 hover:to-purple-700 text-white rounded-md transition-all shadow-lg shadow-blue-500/20">Submit</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'accounts' && (
                <div className="space-y-6">
                  <div className="border-b border-white/10 pb-4 mb-6">
                    <h2 className="text-xl font-semibold text-white">Account Settings</h2>
                    <p className="text-sm text-gray-400 mt-1">Manage your account preferences</p>
                  </div>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">CodeChan ID</label>
                      <input
                        type="text"
                        name="codechanId"
                        value={formData.codechanId}
                        onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 text-white rounded-lg h-10 px-3 transition-all"
                        placeholder="Enter your CodeChan ID"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full bg-white/5 border border-white/10 text-gray-300 rounded-lg h-10 px-3"
                      />
                    </div>
                  </div>
                </div>
              )}
              {/* Form actions */}
              <div className="flex justify-end space-x-3 pt-3 border-t border-gray-800 mt-6">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03, x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2.5 border border-gray-700 rounded-xl text-sm font-medium text-gray-300 bg-gray-800/50 hover:bg-gray-800/80 hover:border-gray-600 transition-all duration-200 flex items-center group"
                >
                  <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
                  <span className="ml-1">Discard</span>
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: '0 0 20px -5px rgba(124, 58, 237, 0.5)'
                  }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                  className={`inline-flex items-center justify-center px-4 py-1.5 h-9 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/20 ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="font-medium">Saving...</span>
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-2" />
                      <span className="font-medium">Save Changes</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;