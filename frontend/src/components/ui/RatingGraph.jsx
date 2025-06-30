import React from 'react';
import { TrendingUp, Award, Zap } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export const description = "An area chart with gradient fill";

const CustomTooltip = ({ active, payload, label, platform }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 text-white p-3 border border-[#610094]/30 rounded-lg shadow-lg">
        <p className="font-semibold text-[#9F7AEA]">{label} - {platform}</p>
        <p className="text-white">Rating: <span className="font-bold">{payload[0].value}</span></p>
        <p className="text-gray-400 text-sm">Contests: {payload[0].payload.contests || 'N/A'}</p>
      </div>
    );
  }
  return null;
};

const RatingGraph = ({ data, platform, currentRating, ratingChange }) => {
  // Calculate highest rating from the data
  const highestRating = data.length > 0 ? 
    Math.max(...data.map(item => item.rating)) : 
    currentRating || 0;
  
  // Calculate rating change percentage
  const ratingChangePercentage = data.length > 1 ? 
    Math.round(((data[data.length - 1].rating - data[0].rating) / data[0].rating) * 100) : 0;
  const isPositiveChange = ratingChangePercentage >= 0;

  return (
    <div className="bg-gradient-to-br from-[#150050]/80 to-[#3F0071]/60 backdrop-blur-sm border border-[#610094]/30 rounded-2xl p-5 shadow-2xl">
      <div className="mb-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-3">
          <div>
            <h3 className="text-white text-xl font-bold">{platform} Rating</h3>
            <p className="text-sm text-gray-300">Your rating progress over time</p>
          </div>
          
          {/* Rating Stats */}
          <div className="flex items-center gap-4 bg-[#3F0071]/30 rounded-xl p-2 sm:p-3 w-full sm:w-auto">
            {/* Current Rating */}
            <div className="text-center px-3 py-1 sm:px-4 sm:py-2">
              <div className="flex items-center justify-center gap-1 text-xs text-gray-300 mb-1">
                <Zap className="h-3 w-3 text-yellow-400" />
                <span>Current</span>
              </div>
              <div className="text-xl font-bold text-white">{currentRating || 'N/A'}</div>
              {ratingChange && (
                <div className={`text-xs mt-0.5 ${ratingChange.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  {ratingChange} pts
                </div>
              )}
            </div>
            
            <div className="h-12 w-px bg-[#610094]/50"></div>
            
            {/* Highest Rating */}
            <div className="text-center px-3 py-1 sm:px-4 sm:py-2">
              <div className="flex items-center justify-center gap-1 text-xs text-gray-300 mb-1">
                <Award className="h-3 w-3 text-yellow-400" />
                <span>Highest</span>
              </div>
              <div className="text-xl font-bold text-yellow-400">{highestRating || 'N/A'}</div>
              <div className="text-xs text-gray-400 mt-0.5">All Time</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chart Container */}
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 0,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stop="#9F7AEA" stopOpacity={0.8}/>
                <stop offset="95%" stop="#9F7AEA" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#4B0082" opacity={0.3} />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              tickMargin={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              tickMargin={10}
              width={35}
            />
            <Tooltip content={<CustomTooltip platform={platform} />} />
            <Area
              type="monotone"
              dataKey="rating"
              stroke="#9F7AEA"
              strokeWidth={2}
              fillOpacity={0.7}
              fill="url(#colorRating)"
              activeDot={{ r: 6, fill: '#9F7AEA', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      {/* Chart Footer */}
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#9F7AEA]"></div>
          <span className="text-gray-300 text-sm">{platform} Rating</span>
        </div>
        {data.length > 1 && (
          <div className={`flex items-center gap-1 text-sm ${isPositiveChange ? 'text-green-400' : 'text-red-400'}`}>
            <TrendingUp className={`h-4 w-4 ${!isPositiveChange ? 'transform rotate-180' : ''}`} />
            <span>
              {isPositiveChange ? '+' : ''}{data[data.length - 1].rating - data[0].rating} points
              {` (${Math.abs(ratingChangePercentage)}%)`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RatingGraph;
