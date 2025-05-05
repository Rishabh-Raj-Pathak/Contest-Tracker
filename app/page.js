"use client";

import { useEffect, useState } from "react";
import FilterSection from "./components/FilterSection";
import ContestCard from "./components/ContestCard";
import { getCodeforcesContests } from "./lib/api/codeforces";
import { getLeetCodeContests } from "./lib/api/leetcode";
import {
  getBookmarkedContests,
  isContestBookmarked,
} from "./lib/bookmarkStorage";

export default function Home() {
  const [codeforcesContests, setCodeforcesContests] = useState([]);
  const [leetcodeContests, setLeetcodeContests] = useState([]);
  const [loadingCodeforces, setLoadingCodeforces] = useState(true);
  const [loadingLeetcode, setLoadingLeetcode] = useState(true);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [bookmarkedContests, setBookmarkedContests] = useState([]);

  useEffect(() => {
    // Load bookmarked contests from localStorage
    const loadBookmarkedContests = () => {
      if (typeof window !== "undefined") {
        const bookmarked = getBookmarkedContests();
        setBookmarkedContests(bookmarked);
      }
    };

    loadBookmarkedContests();
    fetchContests();

    // Listen for storage events to update bookmarks when changed in another tab
    const handleStorageChange = (e) => {
      if (e.key === "bookmarked-contests") {
        loadBookmarkedContests();
      }
    };

    // Listen for bookmark change events from ContestCard
    const handleBookmarkChange = () => {
      loadBookmarkedContests();

      // Update isBookmarked property for Codeforces contests
      setCodeforcesContests((prevContests) =>
        prevContests.map((contest) => ({
          ...contest,
          isBookmarked: isContestBookmarked(contest),
        }))
      );

      // Update isBookmarked property for LeetCode contests
      setLeetcodeContests((prevContests) =>
        prevContests.map((contest) => ({
          ...contest,
          isBookmarked: isContestBookmarked(contest),
        }))
      );
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("bookmarkChange", handleBookmarkChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("bookmarkChange", handleBookmarkChange);
    };
  }, []);

  async function fetchContests() {
    // Fetch Codeforces contests first (usually faster)
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

    // Fetch LeetCode contests separately
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
  }

  // Filter and sort all contests
  const filteredContests = () => {
    // Start with all bookmarked contests if bookmarkedOnly is true
    if (bookmarkedOnly) {
      let bookmarkedFilteredByPlatform = bookmarkedContests;

      // Apply platform filter if needed
      if (selectedPlatforms.length > 0) {
        bookmarkedFilteredByPlatform = bookmarkedContests.filter((contest) =>
          selectedPlatforms.includes(contest.platform)
        );
      }

      // Apply status filter if needed
      if (selectedStatus !== "all") {
        bookmarkedFilteredByPlatform = bookmarkedFilteredByPlatform.filter(
          (contest) => contest.status === selectedStatus
        );
      }

      return bookmarkedFilteredByPlatform.sort((a, b) => {
        // Sort by status first (ongoing -> upcoming -> past)
        const statusOrder = { ongoing: 0, upcoming: 1, past: 2 };
        if (statusOrder[a.status] !== statusOrder[b.status]) {
          return statusOrder[a.status] - statusOrder[b.status];
        }

        // For upcoming contests, sort by start time (ascending)
        if (a.status === "upcoming") {
          return new Date(a.startTime) - new Date(b.startTime);
        }

        // For past contests, sort by start time (descending)
        return new Date(b.startTime) - new Date(a.startTime);
      });
    }

    // Otherwise, combine contests from both platforms
    let allContests = [
      ...codeforcesContests.filter(
        (contest) =>
          selectedPlatforms.length === 0 ||
          selectedPlatforms.includes(contest.platform)
      ),
      ...leetcodeContests.filter(
        (contest) =>
          selectedPlatforms.length === 0 ||
          selectedPlatforms.includes(contest.platform)
      ),
    ];

    // Apply status filter
    if (selectedStatus !== "all") {
      allContests = allContests.filter(
        (contest) => contest.status === selectedStatus
      );
    }

    // Apply bookmark filter if needed
    if (bookmarkedOnly) {
      allContests = allContests.filter((contest) => contest.isBookmarked);
    }

    // Sort by status and time
    return allContests.sort((a, b) => {
      // Sort by status first (ongoing -> upcoming -> past)
      const statusOrder = { ongoing: 0, upcoming: 1, past: 2 };
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }

      // For upcoming contests, sort by start time (ascending)
      if (a.status === "upcoming") {
        return new Date(a.startTime) - new Date(b.startTime);
      }

      // For past contests, sort by start time (descending)
      return new Date(b.startTime) - new Date(a.startTime);
    });
  };

  // Get the combined filtered contests
  const allFilteredContests = filteredContests();

  // Determine if we're still loading
  const isLoading = loadingCodeforces || loadingLeetcode;

  // Get status text for heading
  const getStatusText = () => {
    switch (selectedStatus) {
      case "ongoing":
        return "Live Contests";
      case "upcoming":
        return "Upcoming Contests";
      case "past":
        return "Past Contests";
      default:
        return "All Contests";
    }
  };

  return (
    <div className="flex gap-8">
      {/* Left Sidebar - Filter Section */}
      <aside className="hidden lg:block sticky top-24 h-fit">
        <FilterSection
          selectedPlatforms={selectedPlatforms}
          setSelectedPlatforms={setSelectedPlatforms}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          bookmarkedOnly={bookmarkedOnly}
          setBookmarkedOnly={setBookmarkedOnly}
          showDisclaimer={true}
        />
      </aside>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white/90">
            {getStatusText()}
          </h1>
          <span className="text-sm text-white/60">
            {allFilteredContests.length} contests found
          </span>
        </div>

        {/* Mobile Disclaimer */}
        <div className="lg:hidden p-3 bg-white/5 rounded-lg mb-4">
          <p className="text-xs text-white/50 leading-tight">
            Note: This platform shows upcoming contests and past contests from
            the last 30 days only.
          </p>
        </div>

        {/* Contest Grid */}
        {isLoading ? (
          // Loading skeleton
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="h-48 rounded-2xl bg-[#1a1b1e]/50 animate-pulse"
              />
            ))}
          </div>
        ) : allFilteredContests.length > 0 ? (
          // Contest Cards Grid
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {allFilteredContests.map((contest, index) => (
              <ContestCard key={`contest-${index}`} {...contest} />
            ))}
          </div>
        ) : (
          // No contests found
          <p className="text-white/60 py-10 text-center">
            No contests found matching your filters.
          </p>
        )}
      </div>
    </div>
  );
}
