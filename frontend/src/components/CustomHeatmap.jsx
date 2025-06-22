"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button-heatmap"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-heatmap"

// Generate mock data that matches the screenshot
const generateHeatmapData = () => {
  const months = [
    { name: "Nov", days: 30, startDay: 4 },
    { name: "Dec", days: 31, startDay: 0 },
    { name: "Jan", days: 31, startDay: 3 },
    { name: "Feb", days: 28, startDay: 6 },
    { name: "Mar", days: 31, startDay: 1 },
    { name: "July", days: 31, startDay: 3 },
  ]

  return months.map((month) => {
    const monthData = []
    // Add empty cells for days before month starts
    for (let i = 0; i < month.startDay; i++) {
      monthData.push({ isEmpty: true, count: 0 })
    }
    // Add actual days
    for (let day = 1; day <= month.days; day++) {
      const count = Math.floor(Math.random() * 5) // 0-4 submissions
      monthData.push({ isEmpty: false, count, day })
    }
    return { ...month, data: monthData }
  })
}

const getIntensityClass = (count) => {
  if (count === 0) return "bg-gray-800 border border-gray-700"
  if (count === 1) return "bg-green-900 border border-green-800"
  if (count === 2) return "bg-green-700 border border-green-600"
  if (count === 3) return "bg-green-500 border border-green-400"
  return "bg-green-400 border border-green-300 shadow-sm shadow-green-400/50"
}

const timeRanges = ["Current", "2025 (Jan - Jun)", "2024 (Jul - Dec)", "2024 (Jan - Jun)"]

export default function CustomHeatmap() {
  const [selectedRange, setSelectedRange] = useState("Current")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [tooltip, setTooltip] = useState({ show: false, content: "", x: 0, y: 0 })
  const [heatmapData, setHeatmapData] = useState([])

  useEffect(() => {
    setHeatmapData(generateHeatmapData())
  }, [])

  return (
    <div className="text-white w-full">
      {/* Header with stats and dropdown */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-3">
        <div className="flex flex-wrap items-center gap-6 text-sm">
          <span className="text-white">
            <span className="font-bold text-lg text-white">1570</span>
            <span className="text-[#610094] ml-2 font-medium">submissions</span>
          </span>
          <span className="text-white">
            <span className="text-[#610094] font-medium">Max Streak</span>
            <span className="font-bold ml-2 text-white">1127</span>
          </span>
          <span className="text-white">
            <span className="text-[#610094] font-medium">Current Streak</span>
            <span className="font-bold ml-2 text-white">1127</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="bg-[#150050]/80 text-white hover:bg-[#3F0071]/60 border border-[#610094]/30 px-4 py-2 h-9 rounded-lg transition-all duration-200"
              >
                {selectedRange}
                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-[#150050]/95 border border-[#610094]/30 text-white backdrop-blur-sm"
            >
              {timeRanges.map((range) => (
                <DropdownMenuItem
                  key={range}
                  onClick={() => setSelectedRange(range)}
                  className="cursor-pointer hover:bg-[#3F0071]/40 focus:bg-[#3F0071]/40 text-white"
                >
                  {range}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="sm" className="p-2 h-9 w-9 hover:bg-[#3F0071]/40 rounded-lg">
            <svg className="h-4 w-4 text-[#610094]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </Button>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-3 min-w-max">
          {heatmapData.map((month, monthIndex) => (
            <div key={month.name} className="flex flex-col items-center">
              {/* Month grid */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {month.data.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`w-3 h-3 rounded-sm ${day.isEmpty ? "bg-transparent" : getIntensityClass(day.count)} cursor-pointer transition-all duration-200 hover:scale-110`}
                    onMouseEnter={(e) => {
                      if (!day.isEmpty) {
                        const rect = e.target.getBoundingClientRect()
                        setTooltip({
                          show: true,
                          content: `${day.count} submission${day.count !== 1 ? "s" : ""} on ${month.name} ${day.day}, 2024`,
                          x: rect.left + rect.width / 2,
                          y: rect.top - 10,
                        })
                      }
                    }}
                    onMouseLeave={() => {
                      setTooltip({ show: false, content: "", x: 0, y: 0 })
                    }}
                  />
                ))}
              </div>
              {/* Month label */}
              <span className="text-xs text-[#610094] font-semibold">{month.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4 text-xs">
        <span className="text-[#610094] font-medium">Less</span>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 bg-gray-800 border border-gray-700 rounded-sm"></div>
          <div className="w-2.5 h-2.5 bg-green-900 border border-green-800 rounded-sm"></div>
          <div className="w-2.5 h-2.5 bg-green-700 border border-green-600 rounded-sm"></div>
          <div className="w-2.5 h-2.5 bg-green-500 border border-green-400 rounded-sm"></div>
          <div className="w-2.5 h-2.5 bg-green-400 border border-green-300 rounded-sm"></div>
        </div>
        <span className="text-[#610094] font-medium">More</span>
      </div>

      {/* Custom Tooltip */}
      {tooltip.show && (
        <div
          className="fixed z-50 px-3 py-2 text-xs text-white bg-[#150050]/95 border border-[#610094]/50 rounded-lg shadow-lg shadow-[#610094]/20 pointer-events-none backdrop-blur-sm"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translateX(-50%) translateY(-100%)",
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  )
}
