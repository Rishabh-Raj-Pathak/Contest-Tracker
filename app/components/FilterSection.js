"use client";
import { useState } from "react";

export default function FilterSection() {
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);

  const platforms = [
    {
      name: "Codeforces",
      logo: "https://codeforces.org/s/0/favicon-32x32.png",
    },
    {
      name: "CodeChef",
      logo: "https://img.icons8.com/carbon_copy/200/4D4D4D/codechef.png",
    },
    {
      name: "LeetCode",
      logo: "https://leetcode.com/favicon-32x32.png",
    },
  ];

  const statusOptions = [
    { id: "all", label: "All" },
    { id: "ongoing", label: "Ongoing" },
    { id: "upcoming", label: "Upcoming" },
    { id: "past", label: "Past" },
  ];

  const togglePlatform = (platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  return (
    <div className="w-[280px] rounded-2xl bg-[#1a1b1e]/95 shadow-xl border border-white/[0.05] p-6 space-y-6 backdrop-blur-sm">
      {/* Title */}
      <div className="flex items-center gap-2 text-lg font-semibold text-white/90">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
            clipRule="evenodd"
          />
        </svg>
        Filters
      </div>

      {/* Platforms */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-white/70">Platforms</h3>
        <div className="space-y-2">
          {platforms.map((platform) => (
            <button
              key={platform.name}
              onClick={() => togglePlatform(platform.name)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                selectedPlatforms.includes(platform.name)
                  ? "bg-white/10 shadow-inner"
                  : "hover:bg-white/5"
              }`}
            >
              <img
                src={platform.logo}
                alt={platform.name}
                className="w-5 h-5 rounded"
              />
              <span className="text-sm text-white/90">{platform.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-white/70">Status</h3>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedStatus(option.id)}
              className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                selectedStatus === option.id
                  ? option.id === "ongoing"
                    ? "bg-green-500/20 text-green-400"
                    : option.id === "upcoming"
                    ? "bg-orange-500/20 text-orange-400"
                    : option.id === "past"
                    ? "bg-gray-500/20 text-gray-400"
                    : "bg-blue-500/20 text-blue-400"
                  : "bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookmarked Only */}
      <div>
        <button
          onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
            bookmarkedOnly
              ? "bg-amber-500/20 text-amber-400"
              : "bg-white/5 text-white/70 hover:bg-white/10"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 ${
              bookmarkedOnly ? "fill-amber-400" : "fill-white/70"
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
          </svg>
          <span className="text-sm font-medium">Bookmarked Only</span>
        </button>
      </div>
    </div>
  );
}
