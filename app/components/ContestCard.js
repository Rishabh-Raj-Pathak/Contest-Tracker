"use client";
import { useState, useEffect } from "react";

const formatTimeLeft = (startTime) => {
  const now = new Date();
  const contestStart = new Date(startTime);
  const diff = contestStart - now;

  if (diff <= 0) return "Started";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${hours}h : ${minutes}m : ${seconds}s`;
};

const formatDate = (date) => {
  return new Date(date).toLocaleString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

export default function ContestCard({
  platform,
  title,
  startTime,
  duration,
  status,
  isBookmarked = false,
}) {
  const [timeLeft, setTimeLeft] = useState("Loading...");
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  useEffect(() => {
    // Initial calculation
    setTimeLeft(formatTimeLeft(startTime));

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(formatTimeLeft(startTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const getPlatformStyles = (platform) => {
    const styles = {
      leetcode: {
        border: "border-[#FFA116]/20",
        badge: "bg-[#FFA116]/10 text-[#FFA116]",
        hover: "hover:border-[#FFA116]/40",
        logo: "https://leetcode.com/favicon-32x32.png",
        button: "bg-[#FFA116]/10 hover:bg-[#FFA116]/20 text-[#FFA116]",
      },
      codeforces: {
        border: "border-[#318CE7]/30",
        badge: "bg-[#318CE7]/10 text-[#318CE7]",
        hover: "hover:border-[#318CE7]/50",
        logo: "https://codeforces.org/s/0/favicon-32x32.png",
        button: "bg-[#318CE7]/10 hover:bg-[#318CE7]/20 text-[#318CE7]",
      },
      codechef: {
        border: "border-[#9B4E1C]/20",
        badge: "bg-[#9B4E1C]/10 text-[#9B4E1C]",
        hover: "hover:border-[#9B4E1C]/40",
        logo: "https://cdn.codechef.com/images/favicon-32x32.png",
        button: "bg-[#9B4E1C]/10 hover:bg-[#9B4E1C]/20 text-[#9B4E1C]",
      },
    };
    return styles[platform.toLowerCase()] || styles.leetcode;
  };

  const getStatusStyles = (status) => {
    const styles = {
      upcoming: "bg-orange-500/20 text-orange-400",
      ongoing: "bg-green-500/20 text-green-400",
      past: "bg-zinc-500/20 text-zinc-400",
    };
    return styles[status.toLowerCase()] || styles.upcoming;
  };

  const platformStyle = getPlatformStyles(platform);

  return (
    <div
      className={`group relative rounded-2xl bg-[#1a1b1e]/95 border ${
        status === "past" ? "opacity-75" : "opacity-100"
      } ${platformStyle.border} ${
        platformStyle.hover
      } backdrop-blur-sm transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl`}
    >
      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <img
                  src={platformStyle.logo}
                  alt={platform}
                  className="w-6 h-6 rounded"
                />
                <span
                  className={`px-2 py-1 rounded-lg text-sm ${platformStyle.badge}`}
                >
                  {platform}
                </span>
              </div>
              <span
                className={`px-2 py-1 rounded-lg text-xs ${getStatusStyles(
                  status
                )}`}
              >
                {status}
              </span>
            </div>
            <h3 className="text-lg font-medium text-white/90 line-clamp-1">
              {title}
            </h3>
          </div>
          <button
            onClick={() => setBookmarked(!bookmarked)}
            className="p-2 rounded-xl transition-all duration-200 hover:bg-white/5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 transition-colors duration-200 ${
                bookmarked
                  ? "fill-amber-400"
                  : "fill-white/20 hover:fill-white/40"
              }`}
              viewBox="0 0 20 20"
            >
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
          </button>
        </div>

        {/* Contest Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-white/60">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>Starts on: {formatDate(startTime)}</span>
          </div>

          <div className="px-3 py-2 rounded-xl bg-white/5 text-center">
            <span className="text-sm font-medium text-white/90">
              {timeLeft}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-white/60">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Duration: {duration}</span>
          </div>
        </div>

        {/* Join Button */}
        <div className="pt-2">
          <button
            className={`w-full px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 group ${platformStyle.button}`}
          >
            Join Contest
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
