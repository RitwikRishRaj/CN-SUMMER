import { useEffect, useState } from 'react';
import CustomHeatmap from "../components/CustomHeatmap";
import CountUp from "../components/ui/CountUp";
import NavBar from "../components/NavBar";
import RatingGraph from "../components/ui/RatingGraph";

export default function ProfileTracker() {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // State for time period toggle
  const [timePeriod, setTimePeriod] = useState('month'); // 'week' or 'month'
  
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
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
            {/* Left Sidebar - Profile - Full width on mobile, 3 columns on md+ */}
            <div className="md:col-span-3 space-y-3">
              {/* Profile Card */}
              <div className="bg-gradient-to-br from-[#150050]/80 to-[#3F0071]/60 backdrop-blur-sm border border-[#610094]/30 rounded-2xl p-3 sm:p-4 shadow-2xl">
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

                {/* Social Links */}
                <div className="flex gap-2 sm:gap-3 mb-3 sm:mb-4">
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

                <div className="w-full space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <span>📍</span>
                    <span>India</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <span>🎓</span>
                    <span>Graphic era hill university dehra...</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Problem Solving Stats */}
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
          </div>

          {/* Main Content Area - Full width on mobile, 9 columns on md+ */}
          <div className="md:col-span-9 space-y-4">
            {/* Top Row - Stats Card and Heatmap Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Stats Card - Full width on mobile, 4 columns on lg+ */}
              <div className="lg:col-span-4 bg-gradient-to-br from-[#150050]/80 to-[#3F0071]/60 backdrop-blur-sm border border-[#610094]/30 rounded-2xl p-3 sm:p-4 shadow-2xl">
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
                
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {/* Current Period Stats */}
                  <div className="space-y-4">
                    {/* Total Questions */}
                    <div className="bg-[#3F0071]/20 p-3 rounded-lg">
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
                    <div className="bg-[#3F0071]/20 p-3 rounded-lg">
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
                    <div className="bg-[#3F0071]/20 p-3 rounded-lg">
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
                    <div className="bg-[#3F0071]/20 p-3 rounded-lg">
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

              {/* Heatmap - Full width on mobile, 8 columns on lg+ */}
              <div className="lg:col-span-8 bg-gradient-to-br from-[#000000]/90 to-[#150050]/80 backdrop-blur-sm border border-[#610094]/30 rounded-2xl p-4 shadow-2xl">
                <CustomHeatmap />
              </div>
            </div>

            {/* Contest Tracker with Rating Graph Below - Full width on mobile, 6 columns on lg+ */}
            <div className="lg:col-span-6 space-y-2">
              {/* Contest Tracker */}
              <div className="bg-gradient-to-br from-[#150050]/80 to-[#3F0071]/60 backdrop-blur-sm border border-[#610094]/30 rounded-2xl p-2 sm:p-3 shadow-2xl">
                <div className="flex flex-col sm:flex-row h-auto sm:h-[180px] md:h-[170px]">
                  {/* Total Contests Number - Top on mobile, Left on larger screens */}
                  <div className="flex-1 flex flex-col items-center justify-center py-3 sm:py-0">
                    <h3 className="text-[#610094] text-sm sm:text-base md:text-lg font-semibold mb-1">Total Contests</h3>
                    <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                      <CountUp to={431} duration={2} />
                    </div>
                  </div>

                  {/* Contest List - Bottom on mobile, Right on larger screens */}
                  <div className="flex-1 flex items-center justify-center sm:pl-4 sm:border-l border-t sm:border-t-0 border-[#610094]/30 pt-3 sm:pt-0">
                    <div className="w-full max-w-full sm:max-w-[240px] space-y-1.5 px-2 sm:px-0">
                      <div className="flex items-center justify-between px-2 sm:px-3 py-1.5 bg-[#3F0071]/20 rounded-lg border border-[#610094]/20">
                        <img 
                          src="https://leetcode.com/favicon.ico" 
                          alt="LeetCode" 
                          className="w-5 h-5 rounded-sm flex-shrink-0"
                        />
                        <div className="flex items-center gap-3">
                          <span className="text-xs sm:text-sm text-gray-200">LeetCode</span>
                          <span className="font-bold text-white text-sm sm:text-base">141</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between px-3 py-2 bg-[#3F0071]/20 rounded-lg border border-[#610094]/20">
                        <img 
                          src="https://img.icons8.com/fluent/512/codechef.png" 
                          alt="CodeChef" 
                          className="w-5 h-5 rounded-sm flex-shrink-0"
                        />
                        <div className="flex items-center gap-3">
                          <span className="text-xs sm:text-sm text-gray-200">CodeChef</span>
                          <span className="font-bold text-white text-sm sm:text-base">49</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between px-3 py-2 bg-[#3F0071]/20 rounded-lg border border-[#610094]/20">
                        <img 
                          src="https://codeforces.org/s/0/favicon-32x32.png" 
                          alt="CodeForces" 
                          className="w-5 h-5 rounded-sm flex-shrink-0"
                        />
                        <div className="flex items-center gap-3">
                          <span className="text-xs sm:text-sm text-gray-200">CodeForces</span>
                          <span className="font-bold text-white text-sm sm:text-base">240</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between px-3 py-2 bg-[#3F0071]/20 rounded-lg border border-[#610094]/20">
                        <img 
                          src="https://media.geeksforgeeks.org/gfg-gg-logo.svg" 
                          alt="GeeksForGeeks" 
                          className="w-5 h-5 rounded-sm flex-shrink-0"
                        />
                        <div className="flex items-center gap-3">
                          <span className="text-xs sm:text-sm text-gray-200">GeeksForGeeks</span>
                          <span className="font-bold text-white text-sm sm:text-base">1</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating Graph */}
              <div>
                <RatingGraph data={ratingData} platform="CodeForces" />
              </div>
            </div>

            {/* Problems Solved - Full width on mobile, 6 columns on lg+ */}
            <div className="lg:col-span-6 bg-gradient-to-br from-[#150050]/80 to-[#3F0071]/60 backdrop-blur-sm border border-[#610094]/30 rounded-2xl p-4 sm:p-6 shadow-2xl">
              <h3 className="text-[#610094] text-lg font-semibold mb-4">Problems Solved</h3>

              {/* Fundamentals */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-300 text-sm font-medium">Fundamentals</span>
                  <span className="text-[#610094]">ℹ️</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        className="text-[#3F0071]/40"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 28}`}
                        strokeDashoffset={`${2 * Math.PI * 28 * (1 - 45 / 100)}`}
                        className="text-[#610094]"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-white">45</span>
                    </div>
                  </div>
                  <div className="flex-1 ml-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[#610094] text-sm font-medium">GFG</span>
                      <span className="font-bold text-white">45</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* DSA */}
              <div>
                <h4 className="text-gray-300 font-semibold mb-3">DSA</h4>
                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-20 h-20">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        className="text-[#3F0071]/40"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 36}`}
                        strokeDashoffset={`${2 * Math.PI * 36 * (1 - 2504 / 3000)}`}
                        className="text-[#610094]"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold text-white">2504</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-green-400 text-sm font-medium">Easy</span>
                    <span className="font-bold text-white">817</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-400 text-sm font-medium">Medium</span>
                    <span className="font-bold text-white">1348</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-red-400 text-sm font-medium">Hard</span>
                    <span className="font-bold text-white">339</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
