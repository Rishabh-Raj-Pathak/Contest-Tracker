"use client";
import { useState, useEffect } from "react";
import {
  addBookmark,
  removeBookmark,
  isContestBookmarked,
} from "../lib/bookmarkStorage";

const formatTimeLeft = (startTime, status) => {
  if (status === "past") return "Contest Ended";
  if (status === "ongoing") return "Live Now";

  const now = new Date();
  const contestStart = new Date(startTime);

  // Convert to IST (UTC+5:30)
  const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
  const istNow = new Date(now.getTime() + istOffset);
  const istContestStart = new Date(contestStart.getTime() + istOffset);

  const diff = istContestStart - istNow;

  if (diff <= 0) return "Live Now";

  // Calculate days, hours, minutes, seconds
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  // Format with leading zeros
  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  // Return formatted string
  if (days > 0) {
    return `${days}d ${formattedHours}h ${formattedMinutes}m ${formattedSeconds}s`;
  }
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

const formatDate = (date) => {
  // Convert to IST for display
  const istDate = new Date(new Date(date).getTime() + 5.5 * 60 * 60 * 1000);

  const day = istDate.getUTCDate();
  const month = istDate.toLocaleString("en-US", {
    month: "short",
    timeZone: "UTC",
  });
  const weekday = istDate.toLocaleString("en-US", {
    weekday: "short",
    timeZone: "UTC",
  });
  const year = istDate.getUTCFullYear();
  const time = istDate.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });

  // Add ordinal suffix to day
  const ordinal = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  return `${weekday}, ${ordinal(day)} ${month} ${year} at ${time} IST`;
};

export default function ContestCard({
  platform,
  title,
  startTime,
  duration,
  status,
  isBookmarked = false,
  url,
  isHighlighted = false,
}) {
  const [timeLeft, setTimeLeft] = useState(formatTimeLeft(startTime, status));
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  useEffect(() => {
    // Check if this contest is already bookmarked in localStorage
    const checkBookmarkStatus = () => {
      if (typeof window !== "undefined") {
        const isBookmarked = isContestBookmarked({
          platform,
          title,
          startTime,
          duration,
          status,
          url,
        });
        setBookmarked(isBookmarked);
      }
    };

    checkBookmarkStatus();
  }, [platform, title, startTime, duration, status, url]);

  useEffect(() => {
    // Only set up timer for upcoming contests
    if (status !== "upcoming") {
      setTimeLeft(formatTimeLeft(startTime, status));
      return;
    }

    // Initial calculation
    setTimeLeft(formatTimeLeft(startTime, status));

    // Update every second
    const timer = setInterval(() => {
      const newTimeLeft = formatTimeLeft(startTime, status);
      setTimeLeft(newTimeLeft);

      // If contest has started, clear interval
      if (newTimeLeft === "Live Now") {
        clearInterval(timer);
      }
    }, 1000);

    // Cleanup on unmount
    return () => clearInterval(timer);
  }, [startTime, status]);

  const handleBookmarkToggle = () => {
    const contestData = {
      platform,
      title,
      startTime,
      duration,
      status,
      url,
    };

    if (bookmarked) {
      removeBookmark(contestData);
    } else {
      addBookmark(contestData);
    }

    setBookmarked(!bookmarked);

    // Dispatch a custom event to notify about bookmark changes
    if (typeof window !== "undefined") {
      const event = new CustomEvent("bookmarkChange", {
        detail: {
          contest: contestData,
          isBookmarked: !bookmarked,
        },
      });
      window.dispatchEvent(event);
    }
  };

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
        border: "border-[#1FA34B]/20",
        badge: "bg-[#1FA34B]/10 text-[#1FA34B]",
        hover: "hover:border-[#1FA34B]/40",
        logo: "https://img.icons8.com/fluent-systems-filled/512/FFFFFF/codechef.png",
        button: "bg-[#1FA34B]/10 hover:bg-[#1FA34B]/20 text-[#1FA34B]",
      },
      // Add uppercase case variants for compatibility
      CodeChef: {
        border: "border-[#1FA34B]/20",
        badge: "bg-[#1FA34B]/10 text-[#1FA34B]",
        hover: "hover:border-[#1FA34B]/40",
        logo: "https://img.icons8.com/fluent-systems-filled/512/FFFFFF/codechef.png",
        button: "bg-[#1FA34B]/10 hover:bg-[#1FA34B]/20 text-[#1FA34B]",
      },
      Codeforces: {
        border: "border-[#318CE7]/30",
        badge: "bg-[#318CE7]/10 text-[#318CE7]",
        hover: "hover:border-[#318CE7]/50",
        logo: "https://codeforces.org/s/0/favicon-32x32.png",
        button: "bg-[#318CE7]/10 hover:bg-[#318CE7]/20 text-[#318CE7]",
      },
      LeetCode: {
        border: "border-[#FFA116]/20",
        badge: "bg-[#FFA116]/10 text-[#FFA116]",
        hover: "hover:border-[#FFA116]/40",
        logo: "https://leetcode.com/favicon-32x32.png",
        button: "bg-[#FFA116]/10 hover:bg-[#FFA116]/20 text-[#FFA116]",
      },
    };
    return styles[platform] || styles.leetcode;
  };

  const getStatusStyles = (status) => {
    const styles = {
      upcoming: "bg-green-500/20 text-green-400",
      ongoing: "bg-red-500/20 text-red-400",
      past: "bg-yellow-500/20 text-yellow-400",
    };
    return styles[status.toLowerCase()] || styles.upcoming;
  };

  const getTimeLeftStyles = (timeText) => {
    if (timeText === "Live Now") {
      return "bg-red-500/20 text-red-400 animate-pulse";
    }
    if (timeText === "Contest Ended") {
      return "bg-yellow-500/20 text-yellow-400";
    }
    return "bg-white/5 text-white/90";
  };

  const platformStyle = getPlatformStyles(platform);

  return (
    <div
      className={`group relative rounded-2xl bg-[#1a1b1e]/95 border ${
        status === "past" ? "opacity-90" : "opacity-100"
      } ${platformStyle.border} ${
        platformStyle.hover
      } backdrop-blur-sm transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl ${
        isHighlighted
          ? "ring-2 ring-offset-2 ring-offset-[#1a1b1e] animate-pulse"
          : ""
      }`}
      style={
        isHighlighted
          ? {
              boxShadow: `0 0 15px ${
                platform === "LeetCode" || platform === "leetcode"
                  ? "#FFA116"
                  : platform === "Codeforces" || platform === "codeforces"
                  ? "#318CE7"
                  : "#1FA34B"
              }`,
            }
          : {}
      }
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
                  width={24}
                  height={24}
                  loading="lazy"
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
            onClick={handleBookmarkToggle}
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

          <div
            className={`px-3 py-2 rounded-xl ${getTimeLeftStyles(
              timeLeft
            )} backdrop-blur-sm`}
          >
            <span className="text-sm font-medium">{timeLeft}</span>
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
            onClick={() => {
              const contestUrl =
                status === "upcoming" && platform === "Codeforces"
                  ? "https://codeforces.com/contests"
                  : url;
              window.open(contestUrl, "_blank");
            }}
            className={`w-full px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 group ${platformStyle.button}`}
          >
            {status === "upcoming" ? "View Contests" : "Join Contest"}
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
