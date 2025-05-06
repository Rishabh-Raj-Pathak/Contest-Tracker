"use client";
import { useState } from "react";
import Image from "next/image";

export default function FilterSection({
  selectedPlatforms,
  setSelectedPlatforms,
  selectedStatus,
  setSelectedStatus,
  bookmarkedOnly,
  setBookmarkedOnly,
  showDisclaimer = false,
  isCompact = false,
}) {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [showCompactFilters, setShowCompactFilters] = useState(false);

  const platforms = [
    {
      name: "Codeforces",
      logo: "https://codeforces.org/s/0/favicon-32x32.png",
      color: "#318CE7",
    },
    {
      name: "CodeChef",
      logo: "https://img.icons8.com/fluent-systems-filled/512/FFFFFF/codechef.png",
      color: "#1FA34B",
    },
    {
      name: "LeetCode",
      logo: "https://leetcode.com/favicon-32x32.png",
      color: "#FFA116",
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

  // Get platform-specific hover color
  const getPlatformHoverClass = (platform) => {
    switch (platform) {
      case "Codeforces":
        return "hover:bg-[#318CE7]/10 hover:border-[#318CE7]/30";
      case "CodeChef":
        return "hover:bg-[#1FA34B]/10 hover:border-[#1FA34B]/30";
      case "LeetCode":
        return "hover:bg-[#FFA116]/10 hover:border-[#FFA116]/30";
      default:
        return "hover:bg-white/5";
    }
  };

  // Get platform-specific active color
  const getPlatformActiveClass = (platform) => {
    switch (platform) {
      case "Codeforces":
        return "bg-[#318CE7]/10 border-[#318CE7]/30 text-[#318CE7]";
      case "CodeChef":
        return "bg-[#1FA34B]/10 border-[#1FA34B]/30 text-[#1FA34B]";
      case "LeetCode":
        return "bg-[#FFA116]/10 border-[#FFA116]/30 text-[#FFA116]";
      default:
        return "bg-white/10";
    }
  };

  // Render compact version for mobile
  if (isCompact) {
    return (
      <div className="rounded-2xl bg-[#1a1b1e]/95 shadow-xl border border-white/[0.05] p-3 space-y-3 backdrop-blur-sm transition-all duration-300 hover:border-white/10">
        {/* Compact Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-white/70"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium text-white/90">Filters</span>
          </div>
          <button
            onClick={() => setShowCompactFilters(!showCompactFilters)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all active:scale-95"
            aria-label={showCompactFilters ? "Hide filters" : "Show filters"}
          >
            {showCompactFilters ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-white/70"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-white/70"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Compact Filters */}
        {showCompactFilters && (
          <div className="space-y-3 py-1 animate-fadeIn">
            {/* Platforms (Wrapping Grid) */}
            <div className="space-y-2">
              <h3 className="text-xs font-medium text-white/70">Platforms</h3>
              <div className="flex flex-wrap gap-2">
                {platforms.map((platform) => (
                  <button
                    key={platform.name}
                    onClick={() => togglePlatform(platform.name)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 border active:scale-95 ${
                      selectedPlatforms.includes(platform.name)
                        ? getPlatformActiveClass(platform.name)
                        : `border-transparent ${getPlatformHoverClass(
                            platform.name
                          )}`
                    }`}
                  >
                    <Image
                      src={platform.logo}
                      alt={platform.name}
                      className="w-4 h-4 rounded"
                      width={16}
                      height={16}
                    />
                    <span
                      className={`text-xs ${
                        selectedPlatforms.includes(platform.name)
                          ? ""
                          : "text-white/90"
                      }`}
                    >
                      {platform.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* LeetCode Coming Soon Note - Compact */}
              {platforms.some((p) => p.name === "LeetCode") && (
                <div className="mt-2 px-2.5 py-2 rounded-lg bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 backdrop-blur-sm">
                  <div className="flex items-start gap-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-[10px] text-amber-300 leading-tight">
                      <span className="font-semibold">Coming Soon:</span>{" "}
                      LeetCode contests will be incorporated in the next update.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Status (Wrapping Grid) */}
            <div className="space-y-2">
              <h3 className="text-xs font-medium text-white/70">Status</h3>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedStatus(option.id)}
                    className={`px-3 py-1 rounded-full text-xs transition-all duration-200 active:scale-95 ${
                      selectedStatus === option.id
                        ? option.id === "ongoing"
                          ? "bg-red-500/20 text-red-400 ring-1 ring-red-500/20"
                          : option.id === "upcoming"
                          ? "bg-green-500/20 text-green-400 ring-1 ring-green-500/20"
                          : option.id === "past"
                          ? "bg-yellow-500/20 text-yellow-400 ring-1 ring-yellow-500/20"
                          : "bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/20"
                        : "bg-white/5 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bookmarked Toggle */}
            <div>
              <button
                onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all duration-200 active:scale-95 ${
                  bookmarkedOnly
                    ? "bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/10"
                    : "bg-white/5 text-white/70 hover:bg-white/10"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ${
                    bookmarkedOnly ? "fill-amber-400" : "fill-white/70"
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
                <span className="font-medium">Bookmarked Only</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Regular desktop version
  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <button
        onClick={() => setIsFilterVisible(!isFilterVisible)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-[#1a1b1e] shadow-xl border border-white/[0.05] lg:hidden flex items-center justify-center hover:bg-[#1a1b1e]/90 transition-all active:scale-95"
        aria-label="Toggle filters"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white/90"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Filter Section */}
      <div
        className={`
          fixed lg:relative top-0 right-0 h-full lg:h-auto
          w-[280px] max-w-[90vw]
          rounded-2xl bg-[#1a1b1e]/95 shadow-xl border border-white/[0.05] 
          p-6 space-y-6 backdrop-blur-sm
          transition-all duration-300 z-40
          ${
            isFilterVisible
              ? "translate-x-0"
              : "translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Close Button for Mobile */}
        <button
          onClick={() => setIsFilterVisible(false)}
          className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 lg:hidden hover:bg-white/10 transition-all active:scale-95"
          aria-label="Close filters"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white/70"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

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
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 border active:scale-95 ${
                  selectedPlatforms.includes(platform.name)
                    ? getPlatformActiveClass(platform.name)
                    : `border-transparent ${getPlatformHoverClass(
                        platform.name
                      )}`
                }`}
              >
                <Image
                  src={platform.logo}
                  alt={platform.name}
                  className="w-5 h-5 rounded"
                  width={20}
                  height={20}
                />
                <span
                  className={`text-sm ${
                    selectedPlatforms.includes(platform.name)
                      ? ""
                      : "text-white/90"
                  }`}
                >
                  {platform.name}
                </span>
              </button>
            ))}
          </div>

          {/* LeetCode Coming Soon Note */}
          {platforms.some((p) => p.name === "LeetCode") && (
            <div className="mt-2 px-3 py-2 rounded-lg bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 backdrop-blur-sm">
              <div className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-xs text-amber-300 leading-tight">
                  <span className="font-semibold">Coming Soon:</span> LeetCode
                  contests will be fully incorporated in the next update.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Status */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-white/70">Status</h3>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedStatus(option.id)}
                className={`px-3 py-1 rounded-full text-sm transition-all duration-200 active:scale-95 ${
                  selectedStatus === option.id
                    ? option.id === "ongoing"
                      ? "bg-red-500/20 text-red-400 ring-1 ring-red-500/20"
                      : option.id === "upcoming"
                      ? "bg-green-500/20 text-green-400 ring-1 ring-green-500/20"
                      : option.id === "past"
                      ? "bg-yellow-500/20 text-yellow-400 ring-1 ring-yellow-500/20"
                      : "bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/20"
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
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 active:scale-95 ${
              bookmarkedOnly
                ? "bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/10"
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

        {/* Disclaimer */}
        {showDisclaimer && (
          <div className="pt-4 mt-2 border-t border-white/10">
            <p className="text-xs text-white/50 leading-tight">
              Note: This platform shows upcoming contests and past contests from
              the last 30 days only.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
