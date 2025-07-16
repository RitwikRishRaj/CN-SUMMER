import React from "react";
import { TrendingUp, Users, Smartphone, BarChart2 } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const maxValue = Math.max(...chartData.map(item => item.desktop));
    const percentage = Math.round((value / maxValue) * 100);
    
    return (
      <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg p-3 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-4 w-4 text-purple-400" />
          <p className="font-semibold text-white">{label}</p>
          <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-0.5 rounded-full">
            {chartData.find(item => item.parameter === label)?.value || 0}%
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-purple-300">{value}%</span>
          <span className="text-sm text-gray-300">of total</span>
        </div>
        <div className="mt-2">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Progress</span>
            <span>{percentage}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div 
              className="bg-purple-500 h-1.5 rounded-full" 
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-700 flex items-center gap-2 text-xs text-gray-400">
          <BarChart2 className="h-3 w-3" />
          <span>Performance Metrics</span>
        </div>
      </div>
    );
  }
  return null;
};

const chartData = [
  { parameter: "Tried", value: 85 },
  { parameter: "Solved", value: 72 },
  { parameter: "Solved in 1 Submission", value: 58 },
  { parameter: "Contest Participation Rate", value: 63 },
  { parameter: "Accuracy", value: 91 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
};

export default function RadarGridCircleCard() {
  return (
    <div className="bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] rounded-xl border border-[#2a2a42]/40 shadow-md p-4 mb-6">
      <div className="pb-4 text-center">
        <h2 className="text-lg font-bold text-white">Performance Analysis</h2>
        <p className="text-xs text-gray-400">Key metrics overview</p>
      </div>
      <div className="mx-auto aspect-square max-h-[300px] pb-0">
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={chartData}>
            <PolarGrid gridType="circle" />
            <PolarAngleAxis 
              dataKey="parameter" 
              tick={{
                fill: '#a259ff',
                fontWeight: 600,
                fontSize: 11,
                textShadow: '0 0 5px rgba(162, 89, 255, 0.5)',
                wordWrap: 'break-word',
                textAlign: 'center',
                maxWidth: 80, // Increased from default to accommodate longer text
              }}
              tickFormatter={(value) => {
                // Split long labels into multiple lines
                if (value === 'Contest Participation Rate') return ['Contest', 'Participation', 'Rate'];
                if (value === 'Solved in 1 Submission') return ['Solved in', '1 Submission'];
                return value;
              }}
              tickLine={false}
              axisLineType='circle'
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{
                stroke: '#a259ff',
                strokeDasharray: '3 3',
                strokeWidth: 1,
                fill: 'rgba(97, 0, 148, 0.1)'
              }}
              wrapperStyle={{
                zIndex: 100,
                backdropFilter: 'blur(4px)'
              }}
            />
            <Radar
              dataKey="value"
              fill="#610094"
              fillOpacity={0.6}
              stroke="#a259ff"
              dot={{
                r: 4,
                fill: "#a259ff",
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-col gap-2 text-sm items-center mt-4">
        <div className="flex items-center gap-2 leading-none font-medium text-green-400">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-gray-400 flex items-center gap-2 leading-none">
          January - June 2024
        </div>
      </div>
    </div>
  );
}
