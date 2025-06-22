import React from 'react';
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export const description = "An area chart with gradient fill";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 text-white p-2 border border-gray-700 rounded">
        <p className="font-semibold">{label}</p>
        <p className="text-blue-300">Desktop: {payload[0].value}</p>
        <p className="text-purple-300">Mobile: {payload[1].value}</p>
      </div>
    );
  }
  return null;
};

const RatingGraph = () => {
  return (
    <div className="bg-gradient-to-br from-[#150050]/80 to-[#3F0071]/60 backdrop-blur-sm border border-[#610094]/30 rounded-2xl p-4 shadow-2xl">
      <div className="mb-4">
        <h3 className="text-[#610094] text-lg font-semibold">Rating Progress</h3>
        <p className="text-sm text-gray-300">Showing rating changes over the last 6 months</p>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stop="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stop="#8884d8" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorMobile" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stop="#82ca9d" stopOpacity={0.8}/>
                <stop offset="95%" stop="#82ca9d" stopOpacity={0.1}/>
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
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="desktop"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorDesktop)"
            />
            <Area
              type="monotone"
              dataKey="mobile"
              stroke="#82ca9d"
              fillOpacity={1}
              fill="url(#colorMobile)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#8884d8]"></div>
          <span>Desktop</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#82ca9d]"></div>
          <span>Mobile</span>
        </div>
        <div className="flex items-center gap-1 text-blue-300">
          <TrendingUp className="h-4 w-4" />
          <span>5.2% this month</span>
        </div>
      </div>
    </div>
  );
};

export default RatingGraph;
