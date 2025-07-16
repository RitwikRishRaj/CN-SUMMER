import React, { useRef, useEffect } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip
} from "recharts";

const radarGradientId = "radar-gradient";

const EnhancedRadarChart = ({ radarData }) => {
  const radarRef = useRef();

  useEffect(() => {
    if (radarRef.current) {
      radarRef.current.querySelectorAll("polygon").forEach((polygon) => {
        polygon.style.filter = "drop-shadow(0 0 12px #61009488)";
      });
    }
  }, [radarData]);

  // Enhanced Custom Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { subject, value, color } = payload[0].payload;
      return (
        <div className="custom-tooltip bg-gradient-to-br from-[#1a1a2e] to-[#3F0071] p-4 rounded-xl shadow-xl border border-[#610094]/50">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-3 h-3 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }}></span>
            <span className="text-base font-bold text-[#a259ff]">{subject}</span>
          </div>
          <div className="text-sm text-white font-semibold mb-1">Value: {value}%</div>
          <div className="w-full bg-[#2a2a42] rounded h-2">
            <div
              className="h-2 rounded"
              style={{
                width: `${value}%`,
                background: `linear-gradient(90deg, #a259ff 0%, #610094 100%)`
              }}
            />
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] backdrop-blur-sm border border-[#2a2a42]/40 rounded-xl p-4 shadow-2xl hover:shadow-purple-900 hover:scale-[1.02] hover:border-[#a259ff]/70 transition-all duration-300">
      <ResponsiveContainer width="100%" height={420}>
        <RadarChart
          ref={radarRef}
          data={radarData}
          margin={{ top: 40, right: 40, left: 40, bottom: 40 }}
        >
          <defs>
            <linearGradient id={radarGradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#a259ff" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#610094" stopOpacity={0.5} />
            </linearGradient>
          </defs>
          <PolarGrid stroke="#a259ff" strokeDasharray="6 6" style={{ opacity: 0.18 }} />
          <PolarAngleAxis
            dataKey="subject"
            tick={{
              fill: "#a259ff",
              fontSize: 15,
              fontWeight: 700,
              textShadow: "0 2px 6px #000"
            }}
            tickLine={false}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: "#a259ff", fontSize: 12, fontWeight: 600 }}
            tickLine={false}
            axisLine={false}
          />
          <Radar
            name="Metrics"
            dataKey="value"
            stroke="#a259ff"
            fill={`url(#${radarGradientId})`}
            fillOpacity={0.7}
            strokeWidth={3}
            isAnimationActive={true}
            animationBegin={0}
            animationDuration={1200}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#a259ff', strokeWidth: 2, fillOpacity: 0.1 }} />
          <Legend
            iconSize={14}
            iconType="circle"
            layout="vertical"
            align="right"
            verticalAlign="top"
            wrapperStyle={{
              position: "absolute",
              top: "10px",
              right: "10px",
              color: "#fff",
              fontSize: "14px",
              backgroundColor: "rgba(15, 15, 26, 0.9)",
              borderRadius: "10px",
              border: "1px solid #a259ff33",
              padding: "10px 16px"
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EnhancedRadarChart;
