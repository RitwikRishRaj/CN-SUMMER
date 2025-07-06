import { useEffect, useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import CustomHeatmap from "../components/CustomHeatmap";
import CountUp from "../components/ui/CountUp";
import NavBar from "../components/NavBar";
import RatingGraph from "../components/ui/RatingGraph";

const ProfileTracker = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // State for time period toggle
  const [timePeriod, setTimePeriod] = useState('month'); // 'week' or 'month'
  
  // State for contest tracking
  const [selectedPlatform, setSelectedPlatform] = useState('LeetCode');

  // Mock contest data for each platform
  const platformData = useMemo(() => ({
    'LeetCode': {
      count: 141,
      rating: 2100,
      change: '+25',
      icon: 'https://leetcode.com/favicon.ico'
    },
    'CodeChef': {
      count: 49,
      rating: 1850,
      change: '+30',
      icon: 'https://img.icons8.com/fluent/512/codechef.png'
    },
    'CodeForces': {
      count: 240,
      rating: 1950,
      change: '+50',
      icon: 'https://codeforces.org/s/0/favicon-32x32.png'
    },
    'GeeksForGeeks': {
      count: 1,
      rating: 1500,
      change: '0',
      icon: 'https://media.geeksforgeeks.org/gfg-gg-logo.svg'
    }
  }), []);

  // Generate rating data based on selected platform
  const contestRatingData = useMemo(() => {
    const platform = platformData[selectedPlatform];
    if (!platform) return [];
    
    return [
      { month: 'Jan', rating: platform.rating - 300 },
      { month: 'Feb', rating: platform.rating - 200 },
      { month: 'Mar', rating: platform.rating - 100 },
      { month: 'Apr', rating: platform.rating - 50 },
      { month: 'May', rating: platform.rating },
    ];
  }, [selectedPlatform, platformData]);

  // Total stats (all-time)
  const totalStats = {
    totalQuestions: 7250,
    totalActiveDays: 256,
    questionsChange: 15.2,
    daysChange: 8.3,
    isPositiveQuestions: true,
    isPositiveDays: true
  };

  // Mock data for the rating graph
  const ratingData = [
    { month: 'Jan', rating: 1200, contests: 4 },
    { month: 'Feb', rating: 1350, contests: 5 },
    { month: 'Mar', rating: 1420, contests: 6 },
    { month: 'Apr', rating: 1380, contests: 4 },
    { month: 'May', rating: 1550, contests: 7 },
    { month: 'Jun', rating: 1600, contests: 6 },
  ];

  // Stats data based on time period
  const statsData = {
    week: {
      totalQuestions: 154,
      activeDays: 5,
      questionsChange: 12.5,
      daysChange: -3.2,
      isPositiveQuestions: true,
      isPositiveDays: false
    },
    month: {
      totalQuestions: 5754,
      activeDays: 1138,
      questionsChange: 8.2,
      daysChange: 5.7,
      isPositiveQuestions: true,
      isPositiveDays: true
    }
  };
  
  const currentStats = statsData[timePeriod];

  return (
    <div className="bg-black min-h-screen">
      <NavBar />
      <div className="pt-14 px-2 sm:px-3 pb-2 overflow-x-hidden">
        <div className="relative z-10 max-w-7xl mx-auto space-y-4">
          {/* Top Row: Profile, Stats Card, and Heatmap */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
            {/* Profile Card - 3 columns on lg+ */}
            <div className="lg:col-span-3">
              <div className="bg-gradient-to-br from-[#150050]/80 to-[#3F0071]/60 backdrop-blur-sm border border-[#610094]/30 rounded-2xl p-4 shadow-2xl h-full">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-[#3F0071] to-[#610094] flex items-center justify-center text-lg sm:text-xl font-bold mb-2 sm:mb-3 border-2 border-[#610094]/50 text-white">
                    RJ
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white text-center">Rajat Joshi</h2>
                  <p className="text-[#610094] text-xs sm:text-sm text-center mb-1 sm:mb-2 flex items-center justify-center gap-1">
                    @Rajat.18
                    <span className="text-green-400">✓</span>
                  </p>
                  <p className="text-gray-300 text-xs sm:text-sm text-center mb-3 sm:mb-4">Optimistic</p>
                </div>

                {/* Social Links */}
                <div className="flex gap-2 sm:gap-3 mb-3 sm:mb-4 justify-center">
                  <div className="w-8 h-8 bg-[#3F0071]/40 rounded flex items-center justify-center border border-[#610094]/30">
                    📧
                  </div>
                  <div className="w-8 h-8 bg-[#3F0071]/40 rounded flex items-center justify-center border border-[#610094]/30">
                    💼
                  </div>
                  <div className="w-8 h-8 bg-[#3F0071]/40 rounded flex items-center justify-center border border-[#610094]/30">
                    🌐
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Card - 4 columns on lg+ */}
            <div className="lg:col-span-4">
              <div className="bg-gradient-to-br from-[#150050]/80 to-[#3F0071]/60 backdrop-blur-sm border border-[#610094]/30 rounded-2xl p-4 shadow-2xl">
                {/* Time Period Toggle */}
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-white text-sm font-semibold uppercase tracking-wider">
                    {timePeriod === 'week' ? 'Weekly Stats' : 'Monthly Stats'}
                  </h3>
                  <div className="inline-flex items-center bg-[#3F0071]/30 rounded-lg p-1">
                    <button
                      onClick={() => setTimePeriod('week')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${timePeriod === 'week' ? 'bg-[#610094] text-white' : 'text-gray-300 hover:bg-[#3F0071]/50'}`}
                    >
                      Week
                    </button>
                    <button
                      onClick={() => setTimePeriod('month')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${timePeriod === 'month' ? 'bg-[#610094] text-white' : 'text-gray-300 hover:bg-[#3F0071]/50'}`}
                    >
                      Month
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-2">
                  {/* Current Period Stats */}
                  <div className="space-y-4">
                    {/* Total Questions */}
                    <div className="bg-[#3F0071]/20 p-2 sm:p-3 rounded-lg">
                      <div className="text-xs text-gray-300 mb-1">{timePeriod === 'week' ? 'THIS WEEK' : 'THIS MONTH'}</div>
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-2xl font-bold text-white">
                            <CountUp to={currentStats.totalQuestions} duration={2} />
                          </div>
                          <div className="text-xs text-gray-400">Questions</div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${currentStats.isPositiveQuestions ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                          {currentStats.isPositiveQuestions ? '↑' : '↓'} {currentStats.questionsChange}%
                        </span>
                      </div>
                    </div>

                    {/* Active Days */}
                    <div className="bg-[#3F0071]/20 p-2 sm:p-3 rounded-lg">
                      <div className="text-xs text-gray-300 mb-1">ACTIVE DAYS</div>
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-2xl font-bold text-white">
                            <CountUp to={currentStats.activeDays} duration={2} />
                          </div>
                          <div className="text-xs text-gray-400">Days Active</div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${currentStats.isPositiveDays ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                          {currentStats.isPositiveDays ? '↑' : '↓'} {currentStats.daysChange}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* All-time Stats */}
                  <div className="space-y-4">
                    {/* Total Questions All-time */}
                    <div className="bg-[#3F0071]/20 p-2 sm:p-3 rounded-lg">
                      <div className="text-xs text-gray-300 mb-1">TOTAL</div>
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-2xl font-bold text-white">
                            <CountUp to={totalStats.totalQuestions} duration={2} />
                          </div>
                          <div className="text-xs text-gray-400">Questions</div>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-900/30 text-blue-400">
                          All Time
                        </span>
                      </div>
                    </div>

                    {/* Total Active Days All-time */}
                    <div className="bg-[#3F0071]/20 p-2 sm:p-3 rounded-lg">
                      <div className="text-xs text-gray-300 mb-1">TOTAL</div>
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-2xl font-bold text-white">
                            <CountUp to={totalStats.totalActiveDays} duration={2} />
                          </div>
                          <div className="text-xs text-gray-400">Active Days</div>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-900/30 text-blue-400">
                          All Time
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contest Tracker */}
              <div className="mt-4">
                <div className="bg-gradient-to-br from-[#150050]/80 to-[#3F0071]/60 backdrop-blur-sm border border-[#610094]/30 rounded-2xl p-5 shadow-2xl">
                  <div className="flex flex-col md:flex-row">
                    {/* Total Contests - Left side */}
                    <div className="w-full md:w-[45%] md:pr-6 md:border-r border-[#610094]/30 flex flex-col items-center justify-center py-2">
                      <h3 className="text-[#610094] text-base font-semibold mb-2 text-center">Total Contests</h3>
                      <div className="text-4xl md:text-5xl font-bold text-white">
                        <CountUp to={431} duration={2.5} separator="," />
                      </div>
                    </div>

                    {/* Contest Platforms - Right side */}
                    <div className="w-full md:w-[55%] md:pl-6 mt-5 md:mt-0">
                      <h4 className="text-sm text-gray-300 mb-3 uppercase tracking-wider font-medium">Platforms</h4>
                      <div className="space-y-2">
                        {Object.entries(platformData).map(([name, data]) => (
                          <div 
                            key={name}
                            onClick={() => setSelectedPlatform(name)}
                            className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
                              selectedPlatform === name 
                                ? 'bg-[#610094]/50' 
                                : 'bg-[#3F0071]/20 hover:bg-[#3F0071]/30'
                            }`}
                          >
                            <img src={data.icon} alt={name} className="w-5 h-5 rounded-sm flex-shrink-0" />
                            <span className="text-sm text-gray-300">{name}</span>
                            <span className="ml-auto text-sm font-bold text-white">{data.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating Graph */}
              <div className="mt-4">
                <RatingGraph 
                  data={contestRatingData}
                  platform={selectedPlatform}
                  currentRating={platformData[selectedPlatform]?.rating}
                  ratingChange={platformData[selectedPlatform]?.change}
                />
              </div>
            </div>

            {/* Heatmap - 5 columns on lg+ */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-br from-[#000000]/90 to-[#150050]/80 backdrop-blur-sm border border-[#610094]/30 rounded-2xl p-4 shadow-2xl">
                <CustomHeatmap />
              </div>
              
              {/* Problems Solved - Moved below heatmap */}
              <div className="mt-2">
                <div className="bg-gradient-to-br from-[#150050]/80 to-[#3F0071]/60 backdrop-blur-sm border border-[#610094]/30 rounded-xl p-2 shadow-2xl">
                  <h3 className="text-white text-xs font-semibold mb-2 flex items-center gap-1">
                    <span className="text-[#9F7AEA] text-sm">📊</span> Problems Solved
                  </h3>
                  
                  {/* Pie Charts Grid */}
                  <div className="flex flex-col gap-2 w-full">
                    {/* Fundamentals */}
                    <div className="bg-gradient-to-br from-[#150050]/80 to-[#3F0071]/60 backdrop-blur-sm border border-[#610094]/30 rounded-lg p-2 w-full shadow-2xl">
                      <div className="mb-3 text-center">
                        <h3 className="text-sm font-bold text-white mb-0.5">Fundamentals</h3>
                        <div className="h-0.5 w-12 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full"></div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                        {/* Left Side - Pie Chart */}
                        <div className="w-full md:w-2/5 max-w-[180px]">
                          <div className="w-full h-40 relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-xl font-bold text-white">2,450</div>
                                <div className="text-[9px] text-gray-400">Total</div>
                              </div>
                            </div>
                            
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <defs>
                                  <linearGradient id="gfgGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10B981" />
                                    <stop offset="100%" stopColor="#059669" />
                                  </linearGradient>
                                  <linearGradient id="cnGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#F59E0B" />
                                    <stop offset="100%" stopColor="#D97706" />
                                  </linearGradient>
                                </defs>
                                
                                <Pie
                                  data={[
                                    { name: 'GFG', value: 1500, color: '#10B981' },
                                    { name: 'Coding Ninjas', value: 950, color: '#F59E0B' },
                                  ]}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={40}
                                  outerRadius={55}
                                  paddingAngle={2}
                                  cornerRadius={4}
                                  dataKey="value"
                                  animationBegin={0}
                                  animationDuration={800}
                                  animationEasing="ease-out"
                                >
                                  <Cell fill="url(#gfgGradient)" stroke="#1F1A30" strokeWidth={1} />
                                  <Cell fill="url(#cnGradient)" stroke="#1F1A30" strokeWidth={1} />
                                </Pie>
                                
                                <Tooltip 
                                  content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                      return (
                                        <div className="bg-gray-800 p-1.5 rounded border border-gray-700 text-xs">
                                          <p className="font-medium text-white">{payload[0].name}</p>
                                          <p className="text-gray-300">{payload[0].value} problems</p>
                                        </div>
                                      );
                                    }
                                    return null;
                                  }}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        
                        {/* Right Side - Stats Cards */}
                        <div className="w-full md:w-1/2 flex flex-col gap-1.5">
                          <div className="bg-gray-800/50 backdrop-blur-sm p-2 rounded-lg border border-gray-700/50 hover:border-green-400/30 transition-all duration-200">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-green-400 to-green-600"></div>
                                <h5 className="text-[11px] font-medium text-green-300">GeeksforGeeks</h5>
                              </div>
                              <div className="text-right">
                                <div className="text-base font-bold text-white">1.5K</div>
                                <div className="text-[9px] text-gray-400">Solved</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-gray-800/50 backdrop-blur-sm p-2 rounded-lg border border-gray-700/50 hover:border-orange-400/30 transition-all duration-200">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-orange-400 to-orange-600"></div>
                                <h5 className="text-[11px] font-medium text-orange-300">Coding Ninjas</h5>
                              </div>
                              <div className="text-right">
                                <div className="text-base font-bold text-white">950</div>
                                <div className="text-[9px] text-gray-400">Solved</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Data Structures */}
                    <div className="bg-gradient-to-br from-[#150050]/80 to-[#3F0071]/60 backdrop-blur-sm border border-[#610094]/30 rounded-lg p-2 w-full shadow-2xl">
                      <div className="mb-3 text-center">
                        <h3 className="text-sm font-bold text-white mb-0.5">Data Structures</h3>
                        <div className="h-0.5 w-12 bg-gradient-to-r from-green-400 to-teal-400 mx-auto rounded-full"></div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                        {/* Left Side - Pie Chart */}
                        <div className="w-full md:w-2/5 max-w-[180px]">
                          <div className="w-full h-40 relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-xl font-bold text-white">1.85K</div>
                                <div className="text-[9px] text-gray-400">Total</div>
                              </div>
                            </div>
                            
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <defs>
                                  <linearGradient id="easyGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10B981" />
                                    <stop offset="100%" stopColor="#059669" />
                                  </linearGradient>
                                  <linearGradient id="mediumGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#F59E0B" />
                                    <stop offset="100%" stopColor="#D97706" />
                                  </linearGradient>
                                  <linearGradient id="hardGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#EF4444" />
                                    <stop offset="100%" stopColor="#DC2626" />
                                  </linearGradient>
                                </defs>
                                
                                <Pie
                                  data={[
                                    { name: 'Easy', value: 1000, color: '#10B981' },
                                    { name: 'Medium', value: 700, color: '#F59E0B' },
                                    { name: 'Hard', value: 150, color: '#EF4444' },
                                  ]}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={40}
                                  outerRadius={55}
                                  paddingAngle={2}
                                  cornerRadius={4}
                                  dataKey="value"
                                  animationBegin={0}
                                  animationDuration={800}
                                  animationEasing="ease-out"
                                >
                                  <Cell fill="url(#easyGradient)" stroke="#1F1A30" strokeWidth={1} />
                                  <Cell fill="url(#mediumGradient)" stroke="#1F1A30" strokeWidth={1} />
                                  <Cell fill="url(#hardGradient)" stroke="#1F1A30" strokeWidth={1} />
                                </Pie>
                                
                                <Tooltip 
                                  content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                      return (
                                        <div className="bg-gray-800 p-1.5 rounded border border-gray-700 text-xs">
                                          <p className="font-medium text-white">{payload[0].name}</p>
                                          <p className="text-gray-300">{payload[0].value} problems</p>
                                        </div>
                                      );
                                    }
                                    return null;
                                  }}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        
                        {/* Right Side - Stats Cards */}
                        <div className="w-full md:w-1/2 flex flex-col gap-1.5">
                          <div className="bg-gray-800/50 backdrop-blur-sm p-2 rounded-lg border border-gray-700/50 hover:border-green-400/30 transition-all duration-200">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-green-400 to-green-600"></div>
                                <h5 className="text-[11px] font-medium text-green-300">Easy</h5>
                              </div>
                              <div className="text-right">
                                <div className="text-base font-bold text-white">1K</div>
                                <div className="text-[9px] text-gray-400">Solved</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-gray-800/50 backdrop-blur-sm p-2 rounded-lg border border-gray-700/50 hover:border-yellow-400/30 transition-all duration-200">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600"></div>
                                <h5 className="text-[11px] font-medium text-yellow-300">Medium</h5>
                              </div>
                              <div className="text-right">
                                <div className="text-base font-bold text-white">700</div>
                                <div className="text-[9px] text-gray-400">Solved</div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-800/50 backdrop-blur-sm p-2 rounded-lg border border-gray-700/50 hover:border-red-400/30 transition-all duration-200">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-red-400 to-red-600"></div>
                                <h5 className="text-[11px] font-medium text-red-300">Hard</h5>
                              </div>
                              <div className="text-right">
                                <div className="text-base font-bold text-white">150</div>
                                <div className="text-[9px] text-gray-400">Solved</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Competitive Programming */}
                    <div className="bg-gradient-to-br from-[#150050]/80 to-[#3F0071]/60 backdrop-blur-sm border border-[#610094]/30 rounded-lg p-2 w-full shadow-2xl">
                      <div className="mb-3 text-center">
                        <h3 className="text-sm font-bold text-white mb-0.5">Competitive Programming</h3>
                        <div className="h-0.5 w-12 bg-gradient-to-r from-pink-400 to-rose-500 mx-auto rounded-full"></div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                        {/* Left Side - Pie Chart */}
                        <div className="w-full md:w-2/5 max-w-[180px]">
                          <div className="w-full h-40 relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-xl font-bold text-white">1.2K</div>
                                <div className="text-[9px] text-gray-400">Total</div>
                              </div>
                            </div>
                            
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <defs>
                                  <linearGradient id="codechefGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#F472B6" />
                                    <stop offset="100%" stopColor="#DB2777" />
                                  </linearGradient>
                                  <linearGradient id="codeforcesGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#F97316" />
                                    <stop offset="100%" stopColor="#EA580C" />
                                  </linearGradient>
                                </defs>
                                
                                <Pie
                                  data={[
                                    { name: 'CodeChef', value: 700, color: '#DB2777' },
                                    { name: 'CodeForces', value: 500, color: '#F97316' },
                                  ]}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={40}
                                  outerRadius={55}
                                  paddingAngle={2}
                                  cornerRadius={4}
                                  dataKey="value"
                                  animationBegin={0}
                                  animationDuration={800}
                                  animationEasing="ease-out"
                                >
                                  <Cell fill="url(#codechefGradient)" stroke="#1F1A30" strokeWidth={1} />
                                  <Cell fill="url(#codeforcesGradient)" stroke="#1F1A30" strokeWidth={1} />
                                </Pie>
                                
                                <Tooltip 
                                  content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                      return (
                                        <div className="bg-gray-800 p-1.5 rounded border border-gray-700 text-xs">
                                          <p className="font-medium text-white">{payload[0].name}</p>
                                          <p className="text-gray-300">{payload[0].value} problems</p>
                                        </div>
                                      );
                                    }
                                    return null;
                                  }}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                        
                        {/* Right Side - Stats Cards */}
                        <div className="w-full md:w-1/2 flex flex-col gap-1.5">
                          <div className="bg-gray-800/50 backdrop-blur-sm p-2 rounded-lg border border-gray-700/50 hover:border-pink-500/30 transition-all duration-200">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-pink-400 to-rose-500"></div>
                                <h5 className="text-[11px] font-medium text-pink-300">CodeChef</h5>
                              </div>
                              <div className="text-right">
                                <div className="text-base font-bold text-white">700</div>
                                <div className="text-[9px] text-gray-400">Solved</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-gray-800/50 backdrop-blur-sm p-2 rounded-lg border border-gray-700/50 hover:border-orange-400/30 transition-all duration-200">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-orange-400 to-orange-600"></div>
                                <h5 className="text-[11px] font-medium text-orange-300">CodeForces</h5>
                              </div>
                              <div className="text-right">
                                <div className="text-base font-bold text-white">500</div>
                                <div className="text-[9px] text-gray-400">Solved</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left Column - Problem Solving Stats */}
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-gradient-to-br from-[#150050]/80 to-[#3F0071]/60 backdrop-blur-sm border border-[#610094]/30 rounded-2xl p-4 shadow-2xl">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[#610094] text-sm sm:text-base font-semibold">Problem Solving Stats</h3>
                  <span className="text-[#610094]">▲</span>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between p-3 bg-[#3F0071]/20 rounded-lg border border-[#610094]/20">
                    <div className="flex items-center gap-2">
                      <span className="text-orange-500">⚡</span>
                      <span className="text-xs sm:text-sm text-white">LeetCode</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      <span className="text-[#610094]">🔗</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#3F0071]/20 rounded-lg border border-[#610094]/20">
                    <div className="flex items-center gap-2">
                      <span className="text-orange-600">CS</span>
                      <span className="text-xs sm:text-sm text-white">CodeStudio</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      <span className="text-[#610094]">🔗</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Achievement Badges */}
              <div className="bg-gradient-to-br from-[#150050]/80 to-[#3F0071]/60 backdrop-blur-sm border border-[#610094]/30 rounded-2xl p-4 shadow-2xl">
                <h3 className="text-[#610094] text-base font-semibold mb-4">Achievements</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { title: 'Consistency', value: '30-day streak', icon: '🔥' },
                    { title: 'Solver', value: '2500+ problems', icon: '🏆' },
                    { title: 'Rating', value: 'Expert', icon: '⭐' },
                    { title: 'Contests', value: '100+', icon: '🏅' }
                  ].map((item, index) => (
                    <div key={index} className="bg-[#3F0071]/20 rounded-lg p-3 text-center">
                      <div className="text-2xl mb-1">{item.icon}</div>
                      <div className="text-xs text-gray-300">{item.title}</div>
                      <div className="text-sm font-medium text-white">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Additional Content */}
            <div className="lg:col-span-5 space-y-4">
              {/* ... existing right column content ... */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTracker;
