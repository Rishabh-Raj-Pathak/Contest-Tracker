"use client";
import { useEffect, useRef, useState } from "react";

export default function ContestModal({
  isOpen,
  onClose,
  date,
  contests,
  onContestClick,
}) {
  const modalRef = useRef(null);
  const [animateIn, setAnimateIn] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [dayNumber, setDayNumber] = useState("");

  // Format dates in useEffect to avoid hydration mismatches
  useEffect(() => {
    if (date) {
      // Format date for display with explicit locale
      setFormattedDate(
        date.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );

      // Get day of week for the sidebar
      setDayOfWeek(
        date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()
      );

      // Get day number for display
      setDayNumber(date.getDate().toString());
    }
  }, [date]);

  // Handle animation
  useEffect(() => {
    if (isOpen) {
      setAnimateIn(true);
    }
  }, [isOpen]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close on escape key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  // Handle close with animation
  const handleClose = () => {
    setAnimateIn(false);
    setTimeout(() => {
      onClose();
    }, 300); // Match animation duration
  };

  if (!isOpen) return null;

  // Get platform color
  const getPlatformColor = (platform) => {
    switch (platform.toLowerCase()) {
      case "leetcode":
        return "#FFA116";
      case "codeforces":
        return "#318CE7";
      case "codechef":
        return "#1FA34B";
      default:
        return "#FFFFFF";
    }
  };

  // Filter contests for the selected date
  const dateContests = contests.filter((contest) => {
    if (!contest || !contest.startTime) return false;

    const contestDate = new Date(contest.startTime);
    const selectedDate = new Date(date);

    // Compare year, month, and day only (ignoring time)
    return (
      contestDate.getFullYear() === selectedDate.getFullYear() &&
      contestDate.getMonth() === selectedDate.getMonth() &&
      contestDate.getDate() === selectedDate.getDate()
    );
  });

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-md transition-opacity duration-300 ${
        animateIn ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Decorative blurs */}
      <div className="absolute -top-20 -right-40 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-20 -left-40 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>

      {/* Main modal container */}
      <div
        ref={modalRef}
        className={`relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#1a1b1e]/95 to-[#23242b]/95 border border-white/[0.08] shadow-2xl transition-all duration-300 ${
          animateIn ? "translate-y-0 scale-100" : "translate-y-8 scale-95"
        }`}
      >
        {/* Modal sidebar - date indicator */}
        <div className="absolute top-0 left-0 bottom-0 w-12 sm:w-16 md:w-20 bg-gradient-to-b from-purple-500/20 to-blue-500/20 border-r border-white/[0.08] flex flex-col items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="text-xs font-semibold text-white/60 mb-1">
              {dayOfWeek}
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
              {dayNumber}
            </div>
          </div>
        </div>

        {/* Modal content */}
        <div className="ml-12 sm:ml-16 md:ml-20">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-3 sm:p-4 md:p-5 border-b border-white/10 bg-black/20 backdrop-blur-md">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              {formattedDate}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-white/10 transition-all duration-200 hover:rotate-90"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-5 sm:w-5 text-white/70"
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
          </div>

          {/* Body with custom scrollbar */}
          <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
            {dateContests.length > 0 ? (
              <>
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="relative flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/10">
                    <div className="absolute inset-0 rounded-full bg-white/5 animate-ping opacity-60"></div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 sm:h-4 sm:w-4 text-white/80"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-sm sm:text-base text-white/80 font-medium">
                    {dateContests.length} contest
                    {dateContests.length > 1 ? "s" : ""} scheduled
                  </p>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {dateContests.map((contest, index) => {
                    const platformColor = getPlatformColor(contest.platform);
                    return (
                      <div
                        key={`${contest.platform}-${contest.title}-${index}`}
                        onClick={() => onContestClick(contest)}
                        className="group relative p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border backdrop-blur-sm cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                        style={{
                          borderColor: `${platformColor}30`,
                          backgroundColor: `${platformColor}08`,
                          boxShadow: `0 4px 20px ${platformColor}10`,
                        }}
                      >
                        {/* Gradient hover effect */}
                        <div
                          className="absolute inset-0 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background: `linear-gradient(45deg, ${platformColor}10, transparent)`,
                          }}
                        ></div>

                        {/* Border top light effect */}
                        <div
                          className="absolute top-0 left-4 right-4 h-[1px] opacity-50"
                          style={{
                            background: `linear-gradient(90deg, transparent, ${platformColor}, transparent)`,
                          }}
                        ></div>

                        <div className="relative flex items-start gap-3 sm:gap-4">
                          {/* Platform icon with glow */}
                          <div
                            className="relative flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${platformColor}20` }}
                          >
                            <div
                              className="absolute inset-0 rounded-full animate-pulse opacity-60"
                              style={{ backgroundColor: `${platformColor}10` }}
                            ></div>
                            <img
                              src={
                                contest.platform.toLowerCase() === "leetcode"
                                  ? "https://leetcode.com/favicon-32x32.png"
                                  : contest.platform.toLowerCase() ===
                                    "codeforces"
                                  ? "https://codeforces.org/s/0/favicon-32x32.png"
                                  : "https://img.icons8.com/fluent-systems-filled/512/FFFFFF/codechef.png"
                              }
                              alt={contest.platform}
                              className="w-5 h-5 sm:w-6 sm:h-6 rounded object-contain"
                            />
                          </div>

                          <div className="flex-1 space-y-2 sm:space-y-3">
                            {/* Top badges row */}
                            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                              <span
                                className="inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium"
                                style={{
                                  backgroundColor: `${platformColor}20`,
                                  color: platformColor,
                                }}
                              >
                                {contest.platform}
                              </span>

                              <span
                                className={`inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  contest.status === "ongoing"
                                    ? "bg-red-100 text-red-800"
                                    : contest.status === "upcoming"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {contest.status === "ongoing"
                                  ? "Live"
                                  : contest.status === "upcoming"
                                  ? "Upcoming"
                                  : "Past"}
                              </span>

                              {contest.duration && (
                                <span className="inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-white/70">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  {contest.duration}
                                </span>
                              )}
                            </div>

                            {/* Title */}
                            <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-white transition-colors">
                              {contest.title}
                            </h3>

                            {/* Time and Duration in a styled box */}
                            <div className="bg-black/20 rounded-lg p-2 sm:p-3 space-y-1 sm:space-y-2 border border-white/5">
                              <div className="flex items-center gap-2 text-xs sm:text-sm text-white/70">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3 w-3 sm:h-4 sm:w-4 text-white/50"
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
                                <span className="font-medium">
                                  Starts at:{" "}
                                  {contest.startTime
                                    ? new Date(
                                        contest.startTime
                                      ).toLocaleTimeString("en-US", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                      })
                                    : "Unknown time"}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs sm:text-sm text-white/70">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3 w-3 sm:h-4 sm:w-4 text-white/50"
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
                                <span className="font-medium">
                                  Duration:{" "}
                                  {contest.duration || "Not specified"}
                                </span>
                              </div>
                            </div>

                            {/* Visit button indicator */}
                            <div
                              className="mt-2 sm:mt-3 text-center py-1.5 sm:py-2 rounded-lg bg-white/5 border border-white/10 group-hover:bg-white/10 transition-all duration-300"
                              style={{
                                color: platformColor,
                              }}
                            >
                              <div className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium">
                                <span>Visit Official Contest Page</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform duration-300"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>

                          {/* Premium arrow button */}
                          <div
                            className="relative flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300"
                            style={{
                              backgroundColor: `${platformColor}20`,
                              color: platformColor,
                            }}
                          >
                            <div
                              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              style={{
                                backgroundColor: platformColor,
                                mixBlendMode: "overlay",
                              }}
                            ></div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3 sm:h-4 sm:w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="py-10 sm:py-16 text-center">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6">
                  <div className="absolute inset-0 rounded-full bg-white/5 animate-pulse"></div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 sm:h-20 sm:w-20 mx-auto text-white/20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white/80 mb-2">
                  No Contests Scheduled
                </h3>
                <p className="text-sm text-white/50 max-w-md mx-auto">
                  There are no coding contests scheduled for this date. Check
                  other dates or come back later.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.3);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.5);
        }

        /* Mobile optimization */
        @media (max-width: 640px) {
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
            height: 4px;
          }
        }
      `}</style>
    </div>
  );
}
