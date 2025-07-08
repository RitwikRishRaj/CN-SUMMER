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
    <div className="bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] backdrop-blur-sm border border-[#2a2a42]/40 rounded-2xl p-4 shadow-md h-full">
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="text-white text-sm font-semibold">{platform} Rating</h3>
            <p className="text-xs text-gray-400">Your rating progress over time</p>
          </div>
          
          {/* Rating Stats */}
          <div className="flex items-center gap-4 bg-[#1a1a2e] rounded-lg p-2 w-full sm:w-auto">
            {/* Current Rating */}
            <div className="text-center px-3 py-1">
              <div className="flex items-center justify-center gap-1 text-xs text-gray-400 mb-0.5">
                <Zap className="h-3 w-3 text-yellow-400" />
                <span>Current</span>
              </div>
              <div className="text-lg font-bold text-white">{currentRating || 'N/A'}</div>
              {ratingChange && (
                <div className={`text-xs ${ratingChange.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                  {ratingChange} pts
                </div>
              )}
            </div>

            {/* Highest Rating */}
            {highestRating > 0 && (
              <div className="text-center px-3 py-1 border-l border-[#2a2a42]/60">
                <div className="flex items-center justify-center gap-1 text-xs text-gray-400 mb-0.5">
                  <Award className="h-3 w-3 text-purple-400" />
                  <span>Highest</span>
                </div>
                <div className="text-lg font-bold text-white">{highestRating}</div>
                <div className={`text-xs ${isPositiveChange ? 'text-green-400' : 'text-red-400'}`}>
                  {isPositiveChange ? '↑' : '↓'} {Math.abs(ratingChangePercentage)}%
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9F7AEA" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#9F7AEA" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a42" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              tickLine={{ stroke: '#2a2a42' }}
              axisLine={{ stroke: '#2a2a42' }}
            />
            <YAxis 
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              tickLine={{ stroke: '#2a2a42' }}
              axisLine={{ stroke: '#2a2a42' }}
            />
            <Tooltip 
              content={<CustomTooltip platform={platform} />}
              cursor={{ stroke: '#9F7AEA', strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <Area 
              type="monotone" 
              dataKey="rating" 
              stroke="#9F7AEA"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRating)"
              activeDot={{ r: 6, fill: '#9F7AEA', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RatingGraph;
