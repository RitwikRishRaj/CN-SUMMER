import React from 'react';
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export const description = "An area chart with gradient fill";

// Chart data is now passed as a prop

const CustomTooltip = ({ active, payload, label, platform }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 text-white p-3 border border-[#610094]/30 rounded-lg shadow-lg">
        <p className="font-semibold text-[#9F7AEA]">{label} - {platform}</p>
        <p className="text-white">Rating: <span className="font-bold">{payload[0].value}</span></p>
        <p className="text-gray-400 text-sm">Contests: {payload[0].payload.contests}</p>
      </div>
    );
  }
  return null;
};

const RatingGraph = ({ data, platform }) => {
  return (
    <div className="bg-gradient-to-br from-[#150050]/80 to-[#3F0071]/60 backdrop-blur-sm border border-[#610094]/30 rounded-2xl p-4 shadow-2xl">
      <div className="mb-4">
        <h3 className="text-white text-lg font-semibold">{platform} Rating</h3>
        <p className="text-sm text-gray-300">Your rating progress over time</p>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
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
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#4B0082" />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF' }}
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
      
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#9F7AEA]"></div>
          <span className="text-gray-300">{platform} Rating</span>
        </div>
        <div className="flex items-center gap-1 text-green-400">
          <TrendingUp className="h-4 w-4" />
          <span>
            {data.length > 1 ? (
              <>
                {data[data.length - 1].rating - data[0].rating > 0 ? '+' : ''}
                {data[data.length - 1].rating - data[0].rating} points
                {` (${Math.round(((data[data.length - 1].rating - data[0].rating) / data[0].rating) * 100)}%)`}
              </>
            ) : 'No data'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RatingGraph;
