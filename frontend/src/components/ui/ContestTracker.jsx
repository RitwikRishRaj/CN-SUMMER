"use client"

import { TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"

function Counter({ end, duration = 2000 }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime
    let animationFrame

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      setCount(Math.floor(progress * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])

  return <span className="text-white font-bold tabular-nums min-w-[4ch]">{count}</span>
}

export default function ContestTracker() {
  const [selectedPlatform, setSelectedPlatform] = useState(null)

  const platforms = [
    {
      name: "LeetCode",
      count: 141,
      icon: (
        <div className="w-8 h-8 flex items-center justify-center">
          <div className="relative">
            <div className="w-6 h-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-yellow-500 rounded transform rotate-12"></div>
              <div className="absolute inset-0.5 bg-[#000000] rounded transform rotate-12"></div>
              <div className="absolute inset-1 bg-gradient-to-br from-orange-400 to-yellow-500 rounded transform rotate-12 flex items-center justify-center">
                <span className="text-xs font-bold text-[#000000] transform -rotate-12">LC</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      name: "CodeChef",
      count: 49,
      icon: (
        <div className="w-8 h-8 flex items-center justify-center">
          <div className="relative">
            <div className="w-5 h-3 bg-gradient-to-r from-white to-[#610094] rounded-t-full"></div>
            <div className="w-6 h-1.5 bg-gradient-to-r from-[#610094] to-white rounded-full -mt-0.5"></div>
            <div className="absolute top-0.5 left-1 w-1 h-1 bg-[#3F0071] rounded-full"></div>
            <div className="absolute top-0.5 right-1 w-1 h-1 bg-[#3F0071] rounded-full"></div>
          </div>
        </div>
      ),
    },
    {
      name: "CodeForces",
      count: 240,
      icon: (
        <div className="w-8 h-8 flex items-center justify-center gap-0.5">
          <div className="w-1 h-4 bg-[#3F0071] rounded-full"></div>
          <div className="w-1 h-5 bg-[#610094] rounded-full"></div>
          <div className="w-1 h-3 bg-yellow-400 rounded-full"></div>
        </div>
      ),
    },
    {
      name: "GeeksForGeeks",
      count: 1,
      icon: (
        <div className="w-8 h-8 flex items-center justify-center">
          <div className="relative w-6 h-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-3 border-2 border-[#610094] rounded-full transform rotate-45"></div>
              <div className="absolute w-6 h-3 border-2 border-[#3F0071] rounded-full transform -rotate-45"></div>
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="relative text-white overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#610094]/5 to-transparent animate-pulse"></div>
      <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-[#610094]/10 via-transparent to-[#3F0071]/10"></div>

      <div className="relative">
        {/* Header with trend indicator */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-[#3F0071]/30 to-[#610094]/20 rounded-lg border border-[#610094]/30">
            <TrendingUp className="w-6 h-6 text-[#610094]" />
          </div>
          <div>
            <h2 className="text-[#610094] text-lg font-bold">Contest Performance</h2>
            <p className="text-gray-300 text-sm">Track your competitive programming journey</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
          {/* Left side - Total Contests */}
          <div className="flex-shrink-0">
            <h3 className="text-[#610094] text-xl font-semibold mb-3 tracking-wide">Total Contests</h3>
            <div className="text-6xl font-bold text-white leading-none mb-4">
              <Counter end={431} />
            </div>
            <div className="w-20 h-1.5 bg-gradient-to-r from-[#3F0071] to-[#610094] rounded-full"></div>
          </div>

          {/* Right side - Platform Statistics */}
          <div className="space-y-3 flex-1 min-w-0 max-w-md">
            {platforms.map((platform, index) => (
              <div
                key={platform.name}
                className={`group relative overflow-hidden rounded-xl p-4 bg-gradient-to-r from-[#150050]/60 to-[#3F0071]/30 border border-[#610094]/20 hover:border-[#610094]/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#610094]/20 cursor-pointer backdrop-blur-sm ${
                  selectedPlatform === platform.name
                    ? "border-[#610094]/70 bg-gradient-to-r from-[#3F0071]/50 to-[#610094]/30 shadow-lg shadow-[#610094]/20"
                    : ""
                }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
                onClick={() => setSelectedPlatform(selectedPlatform === platform.name ? null : platform.name)}
              >
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#610094]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {platform.icon}
                    <span className="text-white font-semibold text-lg group-hover:text-white transition-colors duration-200">
                      {platform.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-white">
                      <Counter end={platform.count} duration={1500} />
                    </span>
                    {/* Progress indicator */}
                    <div className="w-1.5 h-8 bg-[#150050]/60 rounded-full overflow-hidden border border-[#610094]/30">
                      <div
                        className="w-full bg-gradient-to-t from-[#3F0071] to-[#610094] rounded-full transition-all duration-1000 ease-out"
                        style={{
                          height: `${Math.min((platform.count / 240) * 100, 100)}%`,
                          animationDelay: `${index * 200}ms`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
