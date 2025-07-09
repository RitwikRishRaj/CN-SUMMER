import React, { useState } from 'react';

const HorizontalBarGraph = ({ data, title, xAxisKey, barKey, barColor = '#9F7AEA', maxItems = 15, showAll: initialShowAll = false }) => {
  const [showAll, setShowAll] = useState(initialShowAll);
  const displayData = showAll ? data : data.slice(0, maxItems);
  const hasMore = data.length > maxItems;

  // Calculate maximum count for percentage calculation
  const maxCount = Math.max(...data.map(item => item[barKey] || 0), 1);

  return (
    <div className="bg-gradient-to-br from-[#0f0f1a] to-[#1a1a2e] backdrop-blur-sm border border-[#2a2a42]/40 rounded-2xl p-4 shadow-md h-full">
      {title && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white text-sm font-semibold">{title}</h3>
        </div>
      )}
      
      <div className="space-y-2 max-h-[calc(100%-40px)] overflow-y-auto pr-2 custom-scrollbar">
        {displayData.map((item, index) => {
          const percentage = ((item[barKey] / maxCount) * 100).toFixed(0);
          
          return (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-300 truncate mr-2" title={item[xAxisKey]}>
                  {item[xAxisKey]}
                </span>
                <span className="text-white font-medium">
                  {item[barKey].toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div 
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${percentage}%`,
                    background: `linear-gradient(90deg, ${barColor} 0%, ${barColor}80 100%)`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      {hasMore && (
        <div className="mt-3 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-[#9F7AEA] hover:text-white transition-colors px-3 py-1.5 rounded-md bg-[#3F0071]/20 hover:bg-[#3F0071]/40 border border-[#610094]/30"
          >
            {showAll ? 'Show Less' : `Show All ${data.length} Topics`}
          </button>
        </div>
      )}
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${barColor}80;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${barColor};
        }
      `}</style>
    </div>
  );
};

export default HorizontalBarGraph;
