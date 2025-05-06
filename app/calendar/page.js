"use client";
import { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useRouter } from "next/navigation";
import ContestModal from "../components/ContestModal";
import LoadingScreen from "../components/LoadingScreen";
// Import the same fetching functions used in the main page
import { getCodeforcesContests } from "../lib/api/codeforces";
import { getLeetCodeContests } from "../lib/api/leetcode";
import { isContestBookmarked } from "../lib/bookmarkStorage";
import { useAppState } from "../lib/StateContext";

export default function CalendarPage() {
  const router = useRouter();

  // Get state from context
  const { calendarData, saveCalendarData, calendarNeedRefresh } = useAppState();

  const [selectedDate, setSelectedDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(!calendarData);
  // Check if this is a fresh page load (refresh or initial visit)
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [allContests, setAllContests] = useState(
    calendarData?.allContests || []
  );
  const [debugInfo, setDebugInfo] = useState(
    calendarData?.debugInfo || { loaded: false, count: 0 }
  );

  // Check if this is a fresh page load and set loading screen accordingly
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check for page load session flag, specifically for calendar page
      const isPageFreshLoad = !sessionStorage.getItem("calendar_page_loaded");

      if (isPageFreshLoad) {
        // This is a fresh page load, show loading screen for full duration
        setShowLoadingScreen(true);

        // Set the flag so we don't show the loading screen again during navigation
        sessionStorage.setItem("calendar_page_loaded", "true");

        // Clear the flag when the user leaves the page (for refresh detection)
        window.addEventListener("beforeunload", () => {
          sessionStorage.removeItem("calendar_page_loaded");
        });
      }
    }
  }, []);

  // Always show loading for full duration if it's active
  useEffect(() => {
    if (showLoadingScreen) {
      const timer = setTimeout(() => {
        setShowLoadingScreen(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showLoadingScreen]);

  // State for platform-specific contests, same as in the main page
  const [codeforcesContests, setCodeforcesContests] = useState(
    calendarData?.codeforcesContests || []
  );
  const [leetcodeContests, setLeetcodeContests] = useState(
    calendarData?.leetcodeContests || []
  );
  const [codechefContests, setCodechefContests] = useState(
    calendarData?.codechefContests || []
  );
  const [loadingCodeforces, setLoadingCodeforces] = useState(!calendarData);
  const [loadingLeetcode, setLoadingLeetcode] = useState(!calendarData);
  const [loadingCodechef, setLoadingCodechef] = useState(!calendarData);

  // Use client-side only rendering for date-related elements
  const [formattedDate, setFormattedDate] = useState("");

  // Save state to context when data changes
  useEffect(() => {
    // Only save if we have valid data and aren't in the loading state
    if (!loading && allContests.length > 0) {
      // Create a clean data object with only what we need
      // Use a limited subset of data to avoid large localStorage objects
      const limitedContests = allContests
        .map((contest) => ({
          id: contest.id,
          title: contest.title,
          platform: contest.platform,
          startTime: contest.startTime,
          duration: contest.duration,
          status: contest.status,
          url: contest.url,
        }))
        .slice(0, 50); // Only cache the first 50 contests

      const stateToSave = {
        allContests: limitedContests,
        debugInfo: {
          loaded: debugInfo.loaded || false,
          count: debugInfo.count || 0,
          cfCount: debugInfo.cfCount || 0,
          lcCount: debugInfo.lcCount || 0,
          ccCount: debugInfo.ccCount || 0,
        },
        // Only save limited contest data for each platform
        codeforcesContests: codeforcesContests.slice(0, 10).map((c) => ({
          title: c.title,
          platform: c.platform,
          startTime: c.startTime,
          duration: c.duration,
          status: c.status,
        })),
        leetcodeContests: leetcodeContests.slice(0, 10).map((c) => ({
          title: c.title,
          platform: c.platform,
          startTime: c.startTime,
          duration: c.duration,
          status: c.status,
        })),
        codechefContests: codechefContests.slice(0, 10).map((c) => ({
          title: c.title,
          platform: c.platform,
          startTime: c.startTime,
          duration: c.duration,
          status: c.status,
        })),
      };

      saveCalendarData(stateToSave);
    }
  }, [
    allContests,
    debugInfo,
    codeforcesContests,
    leetcodeContests,
    codechefContests,
    loading,
    saveCalendarData,
  ]);

  // Format date in useEffect to avoid hydration mismatch
  useEffect(() => {
    // Update date display after component mounts (client-side only)
    const updateDateDisplay = () => {
      const now = new Date();
      setFormattedDate(now.toLocaleDateString("en-US")); // Force en-US locale for consistency
    };

    updateDateDisplay();
  }, []);

  // Fetch contest data only if we need a refresh
  useEffect(() => {
    async function fetchContests() {
      setLoading(true);

      // Only fetch if we need a refresh
      if (!calendarNeedRefresh() && calendarData) {
        setLoading(false);
        return;
      }

      // Fetch Codeforces contests (using the same function as main page)
      try {
        setLoadingCodeforces(true);
        const cfContests = await getCodeforcesContests();

        // Apply bookmark status to each contest
        const cfContestsWithBookmarks = cfContests.map((contest) => ({
          ...contest,
          isBookmarked: isContestBookmarked(contest),
        }));

        setCodeforcesContests(cfContestsWithBookmarks);
        console.log(`Loaded ${cfContests.length} Codeforces contests`);
      } catch (error) {
        console.error("Error fetching Codeforces contests:", error);
      } finally {
        setLoadingCodeforces(false);
      }

      // Fetch LeetCode contests (using the same function as main page)
      try {
        setLoadingLeetcode(true);
        const lcContests = await getLeetCodeContests();

        // Apply bookmark status to each contest
        const lcContestsWithBookmarks = lcContests.map((contest) => ({
          ...contest,
          isBookmarked: isContestBookmarked(contest),
        }));

        setLeetcodeContests(lcContestsWithBookmarks);
        console.log(`Loaded ${lcContests.length} LeetCode contests`);
      } catch (error) {
        console.error("Error fetching LeetCode contests:", error);
      } finally {
        setLoadingLeetcode(false);
      }

      // Fetch CodeChef contests
      try {
        setLoadingCodechef(true);
        const ccResponse = await fetch("/api/contests/codechef");
        if (!ccResponse.ok) {
          throw new Error(
            `Failed to fetch CodeChef contests: ${ccResponse.status}`
          );
        }
        const ccData = await ccResponse.json();
        console.log("Fetched CodeChef data:", ccData);

        // Format CodeChef contests the same way as in the main page
        const ccContests = [
          ...(ccData.upcoming || []).map((contest) => ({
            ...contest,
            platform: "CodeChef",
            title: contest.name,
            duration: contest.duration || "2h 30m",
            status: "upcoming",
          })),
          ...(ccData.past30Days || []).map((contest) => ({
            ...contest,
            platform: "CodeChef",
            title: contest.name,
            duration: contest.duration || "2h 30m",
            status: "past",
          })),
        ];

        // Apply bookmark status to each contest
        const ccContestsWithBookmarks = ccContests.map((contest) => ({
          ...contest,
          isBookmarked: isContestBookmarked(contest),
        }));

        setCodechefContests(ccContestsWithBookmarks);
        console.log(`Loaded ${ccContests.length} CodeChef contests`);
      } catch (error) {
        console.error("Error fetching CodeChef contests:", error);
      } finally {
        setLoadingCodechef(false);
        setLoading(false);
      }
    }

    fetchContests();
  }, [
    calendarNeedRefresh,
    calendarData,
    setLoading,
    setLoadingCodeforces,
    setLoadingLeetcode,
    setLoadingCodechef,
    setCodeforcesContests,
    setLeetcodeContests,
    setCodechefContests,
  ]);

  // Separate useEffect to combine contests once they're all loaded
  useEffect(() => {
    // Only combine when all platforms are done loading
    if (!loadingCodeforces && !loadingLeetcode && !loadingCodechef) {
      const combined = [
        ...codeforcesContests,
        ...leetcodeContests,
        ...codechefContests,
      ];

      console.log("Combined contests before validation:", combined.length);

      // Validate and log individual contests with issues
      const validContests = combined.filter((contest) => {
        if (!contest) {
          console.warn("Null contest object in results");
          return false;
        }

        if (!contest.startTime) {
          console.warn("Contest missing startTime:", contest);
          return false;
        }

        const hasValidStartTime =
          new Date(contest.startTime).toString() !== "Invalid Date";
        if (!hasValidStartTime) {
          console.warn(
            "Invalid startTime format:",
            contest.startTime,
            "for contest:",
            contest
          );
          return false;
        }

        if (!contest.title && !contest.name) {
          console.warn("Contest missing title/name:", contest);
          return false;
        }

        return true;
      });

      console.log(
        `Loaded ${validContests.length} valid contests out of ${combined.length} total`
      );

      // Log a few sample contests for debugging
      if (validContests.length > 0) {
        console.log("Sample contests:", validContests.slice(0, 3));
      }

      setAllContests(validContests);
      setDebugInfo({
        loaded: true,
        count: validContests.length,
        cfCount: codeforcesContests.length,
        lcCount: leetcodeContests.length,
        ccCount: codechefContests.length,
      });
    }
  }, [
    codeforcesContests,
    leetcodeContests,
    codechefContests,
    loadingCodeforces,
    loadingLeetcode,
    loadingCodechef,
    setAllContests,
    setDebugInfo,
  ]);

  // Transform contests into calendar events
  const events = allContests
    .map((contest) => {
      if (!contest || !contest.startTime) {
        console.warn("Invalid contest data:", contest);
        return null;
      }

      const platform = contest.platform?.toLowerCase() || "";
      let color;

      switch (platform) {
        case "leetcode":
          color = "#FFA116";
          break;
        case "codeforces":
          color = "#318CE7";
          break;
        case "codechef":
          color = "#1FA34B";
          break;
        default:
          color = "#CCCCCC";
      }

      // Determine status color and opacity based on status
      let backgroundColor;
      if (contest.status === "ongoing") {
        backgroundColor = "#EF4444"; // Red for ongoing (fully opaque)
      } else if (contest.status === "upcoming") {
        backgroundColor = "#10B981"; // Green for upcoming (fully opaque)
      } else {
        backgroundColor = color; // Platform color for other statuses
      }

      // Parse contest start time safely
      let startTime;
      try {
        startTime = new Date(contest.startTime);
        if (isNaN(startTime.getTime())) {
          throw new Error("Invalid date");
        }
      } catch (error) {
        console.warn(
          `Invalid start time for contest '${contest.title || contest.name}':`,
          contest.startTime
        );
        // Default to today if date is invalid
        startTime = new Date();
      }

      // Calculate end time if available
      let endTime = null;
      if (startTime && contest.duration) {
        // Parse duration like "2h 30m" into minutes
        const durationMatch = contest.duration.match(/(\d+)h\s*(?:(\d+)m)?/);
        if (durationMatch) {
          const hours = parseInt(durationMatch[1]) || 0;
          const minutes = parseInt(durationMatch[2]) || 0;
          const durationMs = (hours * 60 + minutes) * 60 * 1000;

          endTime = new Date(startTime.getTime() + durationMs);
        }
      }

      // Use title property (CodeChef events should now have title property set)
      const title = contest.title || "Unnamed Contest";

      // Create event object
      return {
        id: `${contest.platform}-${contest.id || title}`,
        title: title,
        start: startTime,
        end: endTime || undefined, // Use end time if available
        backgroundColor: backgroundColor,
        borderColor: color,
        textColor: "#FFFFFF",
        display: "block", // Make sure events are displayed as blocks
        extendedProps: {
          platform: contest.platform,
          duration: contest.duration,
          status: contest.status,
          url: contest.url,
          originalData: contest,
        },
      };
    })
    .filter(Boolean); // Remove any null values

  // Handle date click
  const handleDateClick = (info) => {
    setSelectedDate(info.date);
    setModalOpen(true);
  };

  // Handle event click
  const handleEventClick = (info) => {
    // Set the selected date to show modal
    const eventDate = new Date(info.event.start);
    setSelectedDate(eventDate);

    // Extract and log the event details for debugging
    const eventData = info.event.extendedProps.originalData;
    console.log("Clicked event:", {
      title: info.event.title,
      platform: info.event.extendedProps.platform,
      start: eventDate.toISOString(),
      originalData: eventData,
    });

    // Always open modal to show details
    setModalOpen(true);
  };

  // Handle contest click in modal
  const handleContestClick = (contest) => {
    // Close the modal
    setModalOpen(false);

    console.log("Contest clicked:", contest);

    // Redirect to the official contest URL
    if (contest.url) {
      window.open(contest.url, "_blank");
    } else {
      // Fallback to platform websites if specific URL not available
      let platformUrl;
      switch (contest.platform.toLowerCase()) {
        case "codeforces":
          platformUrl = "https://codeforces.com/contests";
          break;
        case "leetcode":
          platformUrl = "https://leetcode.com/contest/";
          break;
        case "codechef":
          platformUrl = "https://www.codechef.com/contests";
          break;
        default:
          platformUrl = null;
      }

      if (platformUrl) {
        window.open(platformUrl, "_blank");
      }
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Add a cleanup effect to remove any tooltips when unmounting the component
  useEffect(() => {
    return () => {
      // Remove any tooltips that might be left in the DOM when navigating away
      const tooltips = document.querySelectorAll(".contest-tooltip");
      tooltips.forEach((tooltip) => {
        if (tooltip && document.body.contains(tooltip)) {
          document.body.removeChild(tooltip);
        }
      });
    };
  }, []);

  return (
    <div className="space-y-8 pb-16">
      {/* Show LoadingScreen component while loading */}
      {showLoadingScreen && <LoadingScreen />}

      {/* Premium Header with Glass Effect */}
      <div
        className={`rounded-2xl bg-gradient-to-r from-[#1a1b1e]/90 to-[#2a2b30]/90 border border-white/[0.08] p-4 sm:p-6 md:p-8 shadow-2xl backdrop-blur-md ${
          showLoadingScreen ? "opacity-0 invisible" : "opacity-100 visible"
        } transition-opacity duration-500`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
          <div className="space-y-2 md:space-y-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              Contest Calendar
            </h1>
            <p className="text-sm sm:text-base text-white/60 max-w-xl">
              Track upcoming and ongoing programming contests across major
              competitive coding platforms. Click on any day to see detailed
              contest information.
            </p>
          </div>

          {/* Platform Legend - Premium Style */}
          <div className="flex flex-wrap gap-2 sm:gap-4 p-3 sm:p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-2 bg-[#318CE7]/10 rounded-lg border border-[#318CE7]/20 transition-all duration-300 hover:bg-[#318CE7]/20 hover:scale-105">
              <div className="relative">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#318CE7]"></div>
                <div className="absolute -inset-1 bg-[#318CE7]/20 rounded-full animate-pulse"></div>
              </div>
              <span className="text-xs sm:text-sm font-medium text-white/90">
                Codeforces
              </span>
            </div>

            <div className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-2 bg-[#FFA116]/10 rounded-lg border border-[#FFA116]/20 transition-all duration-300 hover:bg-[#FFA116]/20 hover:scale-105">
              <div className="relative">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#FFA116]"></div>
                <div className="absolute -inset-1 bg-[#FFA116]/20 rounded-full animate-pulse"></div>
              </div>
              <span className="text-xs sm:text-sm font-medium text-white/90">
                LeetCode
              </span>
            </div>

            <div className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-2 bg-[#1FA34B]/10 rounded-lg border border-[#1FA34B]/20 transition-all duration-300 hover:bg-[#1FA34B]/20 hover:scale-105">
              <div className="relative">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#1FA34B]"></div>
                <div className="absolute -inset-1 bg-[#1FA34B]/20 rounded-full animate-pulse"></div>
              </div>
              <span className="text-xs sm:text-sm font-medium text-white/90">
                CodeChef
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Container with enhanced styling */}
      <div
        className={`rounded-2xl bg-gradient-to-b from-[#1a1b1e]/95 to-[#23242b]/95 border border-white/[0.08] p-0 shadow-2xl backdrop-blur-sm overflow-hidden ${
          showLoadingScreen ? "opacity-0 invisible" : "opacity-100 visible"
        } transition-opacity duration-500`}
      >
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>

        {/* Calendar header bar */}
        <div className="relative z-10 border-b border-white/10 bg-white/5 backdrop-blur-md px-2 sm:px-4 py-2 sm:py-3 mb-1 sm:mb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span className="ml-2 text-xs font-medium text-white/50">
                CALENDAR VIEW
              </span>
            </div>

            <div className="hidden md:flex items-center gap-2 text-xs text-white/30">
              <span className="date-display">{formattedDate}</span>
              <span>|</span>
              <span>
                {events.length} Contest{events.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Calendar content */}
        <div className="relative z-10 p-2 sm:p-4 md:p-6">
          {loading && !showLoadingScreen ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <div className="relative w-16 h-16">
                <div className="w-16 h-16 rounded-full border-2 border-white/10 animate-spin"></div>
                <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-t-2 border-purple-500 animate-spin"></div>
                <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-r-2 border-blue-500 animate-spin-slow"></div>
              </div>
              <p className="mt-6 text-white/70 font-medium">
                Loading your contests...
              </p>
              <p className="text-xs text-white/40 mt-2">
                Fetching from Codeforces, LeetCode, and CodeChef
              </p>
            </div>
          ) : (
            <>
              {/* Debug info - will help troubleshoot if no events are showing */}
              {events.length === 0 && (
                <div className="bg-red-500/20 text-white p-3 rounded-lg mb-4">
                  <p>
                    No events to display. Debug info:{" "}
                    {JSON.stringify(debugInfo)}
                  </p>
                  <p className="text-sm mt-1">
                    Check browser console for more details.
                  </p>
                </div>
              )}

              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left:
                    window.innerWidth < 640 ? "prev,next" : "prev,next today",
                  center: "title",
                  right: "dayGridMonth",
                }}
                events={events}
                eventClick={handleEventClick}
                dateClick={handleDateClick}
                height={window.innerWidth < 768 ? 600 : 800}
                themeSystem="standard"
                dayMaxEvents={window.innerWidth < 768 ? 2 : 3}
                eventTimeFormat={{
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                }}
                // Mobile optimization
                stickyHeaderDates={true}
                className="contest-calendar"
                // Misc options
                nowIndicator={true}
                eventDisplay="auto"
                displayEventTime={true}
                displayEventEnd={false}
                slotMinTime="00:00:00"
                slotMaxTime="24:00:00"
                eventDidMount={(info) => {
                  // Create tooltip element
                  const tooltip = document.createElement("div");
                  tooltip.className = "contest-tooltip";
                  tooltip.style.position = "absolute";
                  tooltip.style.display = "none";
                  tooltip.style.zIndex = "1000";
                  tooltip.style.backgroundColor = "rgba(26, 27, 30, 0.95)";
                  tooltip.style.color = "#fff";
                  tooltip.style.padding = "12px";
                  tooltip.style.borderRadius = "12px";
                  tooltip.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.3)";
                  tooltip.style.fontSize = "0.875rem";
                  tooltip.style.maxWidth = "300px";
                  tooltip.style.backdropFilter = "blur(10px)";
                  tooltip.style.border = "1px solid rgba(255, 255, 255, 0.1)";
                  tooltip.style.transition = "opacity 0.2s ease-in-out";
                  tooltip.innerHTML = `
                    <div class="tooltip-title" style="font-weight: 600; margin-bottom: 6px;">${
                      info.event.title
                    }</div>
                    <div class="tooltip-platform" style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
                      <span style="font-weight: 500;">${
                        info.event.extendedProps.platform
                      }</span>
                    </div>
                    <div class="tooltip-time" style="margin-bottom: 4px;">
                      <span>Start: ${new Date(
                        info.event.start
                      ).toLocaleString()}</span>
                    </div>
                    <div class="tooltip-duration" style="margin-bottom: 4px;">
                      <span>Duration: ${
                        info.event.extendedProps.duration
                      }</span>
                    </div>
                    <div class="tooltip-status" style="display: flex; align-items: center; gap: 6px;">
                      <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${
                        info.event.extendedProps.status === "upcoming"
                          ? "#10B981"
                          : info.event.extendedProps.status === "ongoing"
                          ? "#EF4444"
                          : "#FCD34D"
                      }"></span>
                      ${info.event.extendedProps.status || "Unknown status"}
                    </div>
                  `;

                  // Append tooltip to body
                  document.body.appendChild(tooltip);

                  // Show/hide tooltip on mouseover/mouseout
                  info.el.addEventListener("mouseover", () => {
                    const rect = info.el.getBoundingClientRect();
                    tooltip.style.display = "block";
                    tooltip.style.left = rect.left + window.scrollX + "px";
                    tooltip.style.top = rect.bottom + window.scrollY + "px";
                  });

                  info.el.addEventListener("mouseout", () => {
                    tooltip.style.display = "none";
                  });

                  // Clean up on event unmount
                  info.event.remove = () => {
                    if (document.body.contains(tooltip)) {
                      document.body.removeChild(tooltip);
                    }
                  };
                }}
                moreLinkClick="popover"
              />
            </>
          )}
        </div>
      </div>

      {/* Mobile note with premium styling */}
      <div
        className={`md:hidden p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-white/10 ${
          showLoadingScreen ? "opacity-0 invisible" : "opacity-100 visible"
        } transition-opacity duration-500`}
      >
        <div className="flex items-start gap-3">
          <div className="text-white/70 mt-0.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-white/70 font-medium">Pro Tip</p>
            <p className="text-xs text-white/50 leading-relaxed mt-1">
              Rotate your device horizontally for a better calendar view, or use
              the list view for an optimized experience on mobile devices.
            </p>
          </div>
        </div>
      </div>

      {/* Contest Modal */}
      <ContestModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        date={selectedDate}
        contests={allContests}
        onContestClick={handleContestClick}
      />

      {/* Custom styles for the calendar */}
      <style jsx global>{`
        /* Animation for spin slow */
        @keyframes spin-slow {
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .contest-calendar {
          --fc-border-color: rgba(255, 255, 255, 0.08);
          --fc-button-text-color: #fff;
          --fc-button-bg-color: rgba(255, 255, 255, 0.08);
          --fc-button-border-color: rgba(255, 255, 255, 0.1);
          --fc-button-hover-bg-color: rgba(255, 255, 255, 0.15);
          --fc-button-hover-border-color: rgba(255, 255, 255, 0.2);
          --fc-button-active-bg-color: rgba(139, 92, 246, 0.3);
          --fc-button-active-border-color: rgba(139, 92, 246, 0.4);
          --fc-event-bg-color: rgba(255, 255, 255, 0.9);
          --fc-event-border-color: rgba(255, 255, 255, 0.9);
          --fc-event-text-color: #fff;
          --fc-page-bg-color: transparent;
          --fc-neutral-bg-color: rgba(255, 255, 255, 0.03);
          --fc-neutral-text-color: rgba(255, 255, 255, 0.7);
          --fc-today-bg-color: rgba(139, 92, 246, 0.12);
          --fc-now-indicator-color: rgba(239, 68, 68, 0.7);
          --fc-list-event-hover-bg-color: rgba(255, 255, 255, 0.08);
          --fc-more-link-bg-color: rgba(139, 92, 246, 0.25);
          --fc-more-link-text-color: rgba(255, 255, 255, 0.9);
          margin: 0 auto;
          max-width: 1200px;
        }

        /* Base styles */
        .contest-calendar .fc-theme-standard td,
        .contest-calendar .fc-theme-standard th {
          border-color: rgba(255, 255, 255, 0.08);
        }

        /* Day cell styling */
        .contest-calendar .fc-daygrid-day {
          transition: all 0.3s ease;
        }

        .contest-calendar .fc-daygrid-day:hover {
          background-color: rgba(255, 255, 255, 0.03);
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
        }

        .contest-calendar .fc-day-today {
          background: rgba(139, 92, 246, 0.12) !important;
          border-radius: 4px;
          box-shadow: inset 0 0 0 1px rgba(139, 92, 246, 0.3);
        }

        .contest-calendar .fc-day-today .fc-daygrid-day-number {
          color: rgba(139, 92, 246, 1);
          font-weight: 600;
        }

        /* Button styling */
        .contest-calendar .fc-button {
          border-radius: 12px;
          padding: 0.6rem 1.2rem;
          font-weight: 500;
          transition: all 0.2s;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
          margin: 0 4px;
          border-width: 1px;
        }

        .contest-calendar .fc-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .contest-calendar .fc-button:active {
          transform: translateY(0);
        }

        .contest-calendar .fc-button-active {
          background: rgba(139, 92, 246, 0.3) !important;
          border-color: rgba(139, 92, 246, 0.4) !important;
          box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.15);
        }

        .contest-calendar .fc-today-button {
          background: rgba(139, 92, 246, 0.2) !important;
          border-color: rgba(139, 92, 246, 0.3) !important;
        }

        .contest-calendar .fc-today-button:disabled {
          opacity: 0.5;
          background: rgba(139, 92, 246, 0.3) !important;
        }

        /* Event styling - PREMIUM */
        .contest-calendar .fc-event {
          border-radius: 8px;
          padding: 4px 8px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 3px;
          border-width: 1px !important;
          opacity: 1 !important;
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1),
            0 0 0 1px rgba(255, 255, 255, 0.05);
          overflow: hidden;
        }

        .contest-calendar .fc-event::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
        }

        .contest-calendar .fc-event:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15),
            0 0 0 1px rgba(255, 255, 255, 0.1);
          z-index: 10;
        }

        .contest-calendar .fc-event:active {
          transform: translateY(0) scale(1);
        }

        /* "More" link styling */
        .contest-calendar .fc-daygrid-more-link {
          font-weight: 600;
          background: rgba(139, 92, 246, 0.25);
          border-radius: 12px;
          padding: 2px 8px;
          margin-top: 3px;
          transition: all 0.2s;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .contest-calendar .fc-daygrid-more-link:hover {
          background: rgba(139, 92, 246, 0.35);
          transform: translateY(-1px);
        }

        .contest-calendar .fc-popover {
          background-color: rgba(30, 30, 40, 0.98);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 16px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.05);
          overflow: hidden;
          backdrop-filter: blur(10px);
        }

        .contest-calendar .fc-popover-header {
          background-color: rgba(139, 92, 246, 0.15);
          padding: 8px 12px;
          border-bottom: 1px solid rgba(139, 92, 246, 0.2);
        }

        .contest-calendar .fc-popover-title {
          font-weight: 600;
        }

        .contest-calendar .fc-popover-close {
          opacity: 0.7;
          transition: all 0.2s;
        }

        .contest-calendar .fc-popover-close:hover {
          opacity: 1;
          transform: scale(1.1);
        }

        /* Header styling */
        .contest-calendar .fc-toolbar-title {
          color: rgba(255, 255, 255, 0.95);
          font-size: 1.5rem !important;
          font-weight: 700;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          letter-spacing: -0.01em;
        }

        .contest-calendar .fc-col-header-cell {
          padding: 12px 0;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.85);
          background-color: rgba(139, 92, 246, 0.08);
          border-bottom: 1px solid rgba(139, 92, 246, 0.2);
        }

        .contest-calendar .fc-col-header-cell-cushion {
          padding: 8px 4px;
        }

        .contest-calendar .fc-daygrid-day-number {
          color: rgba(255, 255, 255, 0.8);
          padding: 8px;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s;
        }

        .contest-calendar .fc-daygrid-day-number:hover {
          color: rgba(255, 255, 255, 1);
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
        }

        /* Now indicator */
        .contest-calendar .fc-timegrid-now-indicator-line {
          border-width: 2px;
          border-style: solid;
          border-color: rgba(239, 68, 68, 0.7);
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
        }

        .contest-calendar .fc-timegrid-now-indicator-arrow {
          border-color: rgba(239, 68, 68, 0.7);
          box-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
        }

        /* List view */
        .contest-calendar .fc-list {
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .contest-calendar .fc-list-day-cushion {
          background-color: rgba(139, 92, 246, 0.08) !important;
          padding: 12px 16px !important;
        }

        .contest-calendar .fc-list-day-text {
          color: rgba(255, 255, 255, 0.9);
          font-weight: 600;
        }

        .contest-calendar .fc-list-day-side-text {
          color: rgba(139, 92, 246, 0.9);
          font-weight: 600;
        }

        .contest-calendar .fc-list-event {
          transition: all 0.2s;
          border-radius: 4px;
          margin: 1px 0;
        }

        .contest-calendar .fc-list-event:hover {
          background-color: rgba(139, 92, 246, 0.1) !important;
          transform: translateX(4px);
        }

        .contest-calendar .fc-list-event-dot {
          border-width: 6px;
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
        }

        .contest-calendar .fc-list-event-title a {
          color: white !important;
          font-weight: 500;
          transition: all 0.2s;
        }

        .contest-calendar .fc-list-event-title a:hover {
          text-decoration: none;
          color: rgba(139, 92, 246, 1) !important;
        }

        .contest-calendar .fc-list-event-time {
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7) !important;
        }

        /* Mobile optimization */
        @media (max-width: 768px) {
          .contest-calendar .fc-toolbar.fc-header-toolbar {
            flex-direction: column;
            gap: 12px;
            padding: 0 8px;
          }

          .contest-calendar .fc-toolbar-chunk {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 8px;
          }

          .contest-calendar .fc-toolbar-title {
            font-size: 1.2rem !important;
            text-align: center;
          }

          .contest-calendar .fc-button {
            padding: 6px 12px;
            font-size: 0.8rem;
            border-radius: 8px;
          }

          .contest-calendar .fc-daygrid-day-number {
            padding: 4px 6px;
            font-size: 0.8rem;
          }

          .contest-calendar .fc-event {
            font-size: 0.7rem;
            padding: 2px 4px;
            border-radius: 4px;
          }

          .contest-calendar .fc-col-header-cell-cushion {
            padding: 6px 2px;
          }
        }

        /* Small mobile screens */
        @media (max-width: 480px) {
          .contest-calendar .fc-toolbar-title {
            font-size: 1rem !important;
          }

          .contest-calendar .fc-button {
            padding: 4px 8px;
            font-size: 0.7rem;
          }

          .contest-calendar .fc-col-header-cell-cushion,
          .contest-calendar .fc-daygrid-day-number {
            font-size: 0.7rem;
            padding: 2px 4px;
          }

          .contest-calendar .fc-list-day-text,
          .contest-calendar .fc-list-day-side-text {
            font-size: 0.85rem;
          }

          .contest-calendar .fc-list-event-time,
          .contest-calendar .fc-list-event-title {
            font-size: 0.8rem;
          }
        }

        .contest-modal-content .modal-empty {
          text-align: center;
          padding: 20px;
          color: rgba(255, 255, 255, 0.5);
        }

        /* Loader styles */
        .calendar-spinner {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 4px solid rgba(139, 92, 246, 0.1);
          border-left-color: rgba(139, 92, 246, 0.8);
          animation: spin 1s linear infinite;
          margin: 40px auto;
        }
      `}</style>
    </div>
  );
}
