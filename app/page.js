"use client";

import { useEffect, useState, Suspense, lazy } from "react";
import FilterSection from "./components/FilterSection";
import ContestCard from "./components/ContestCard";
import LoadingScreen from "./components/LoadingScreen";
import SearchParamsHandler from "./components/SearchParamsHandler";
import { getCodeforcesContests } from "./lib/api/codeforces";
import { getLeetCodeContests } from "./lib/api/leetcode";
import {
  getBookmarkedContests,
  isContestBookmarked,
} from "./lib/bookmarkStorage";
import LazyLoadWrapper from "./components/LazyLoadWrapper";
import { useAppState } from "./lib/StateContext";

export default function Home() {
  // Get state from context
  const { contestsData, saveContestsData, contestsNeedRefresh } = useAppState();

  const [codeforcesContests, setCodeforcesContests] = useState(
    contestsData?.codeforcesContests || []
  );
  const [leetcodeContests, setLeetcodeContests] = useState(
    contestsData?.leetcodeContests || []
  );
  const [codechefContests, setCodechefContests] = useState(
    contestsData?.codechefContests || []
  );
  const [loadingCodeforces, setLoadingCodeforces] = useState(!contestsData);
  const [loadingLeetcode, setLoadingLeetcode] = useState(!contestsData);
  const [loadingCodechef, setLoadingCodechef] = useState(!contestsData);
  const [selectedPlatforms, setSelectedPlatforms] = useState(
    contestsData?.selectedPlatforms || []
  );
  const [selectedStatus, setSelectedStatus] = useState(
    contestsData?.selectedStatus || "all"
  );
  const [bookmarkedOnly, setBookmarkedOnly] = useState(
    contestsData?.bookmarkedOnly || false
  );
  const [bookmarkedContests, setBookmarkedContests] = useState(
    contestsData?.bookmarkedContests || []
  );
  const [highlightedContest, setHighlightedContest] = useState(null);
  const [showLoadingScreen, setShowLoadingScreen] = useState(!contestsData);

  // Save state to context on changes
  useEffect(() => {
    // Only save if we have valid data to save and aren't in the loading state
    if (
      !loadingCodeforces &&
      !loadingLeetcode &&
      !loadingCodechef &&
      (codeforcesContests.length > 0 ||
        leetcodeContests.length > 0 ||
        codechefContests.length > 0)
    ) {
      // Create a clean object with only the essential data we need
      const stateToSave = {
        // Only save limited data for each platform to reduce localStorage size
        codeforcesContests: codeforcesContests.slice(0, 20).map((c) => ({
          title: c.title,
          platform: c.platform,
          startTime: c.startTime,
          duration: c.duration,
          status: c.status,
          url: c.url,
        })),
        leetcodeContests: leetcodeContests.slice(0, 20).map((c) => ({
          title: c.title,
          platform: c.platform,
          startTime: c.startTime,
          duration: c.duration,
          status: c.status,
          url: c.url,
        })),
        codechefContests: codechefContests.slice(0, 20).map((c) => ({
          title: c.title,
          platform: c.platform,
          startTime: c.startTime,
          duration: c.duration,
          status: c.status,
          url: c.url,
        })),
        selectedPlatforms,
        selectedStatus,
        bookmarkedOnly,
        // Only include essential bookmark data
        bookmarkedContests: bookmarkedContests.slice(0, 20).map((c) => ({
          title: c.title,
          platform: c.platform,
          startTime: c.startTime,
          duration: c.duration,
          status: c.status,
          url: c.url,
        })),
      };

      saveContestsData(stateToSave);
    }
  }, [
    codeforcesContests,
    leetcodeContests,
    codechefContests,
    selectedPlatforms,
    selectedStatus,
    bookmarkedOnly,
    bookmarkedContests,
    loadingCodeforces,
    loadingLeetcode,
    loadingCodechef,
    saveContestsData,
  ]);

  useEffect(() => {
    // Load bookmarked contests from localStorage
    const loadBookmarkedContests = () => {
      if (typeof window !== "undefined") {
        const bookmarked = getBookmarkedContests();
        setBookmarkedContests(bookmarked);
      }
    };

    // If we have cached data and don't need to refresh, skip loading
    const needsRefresh = contestsNeedRefresh();

    if (needsRefresh) {
      loadBookmarkedContests();
      fetchContests();
    } else {
      // We already have cached data, so we don't need to show loading screen
      setShowLoadingScreen(false);
    }

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

      // Update isBookmarked property for CodeChef contests
      setCodechefContests((prevContests) =>
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
  }, [contestsNeedRefresh, contestsData]);

  // Always show the loading screen for the full animation duration
  useEffect(() => {
    // Only set timer if we need to show loading screen
    if (showLoadingScreen) {
      const timer = setTimeout(() => {
        setShowLoadingScreen(false);
      }, 3000); // Exactly 3 seconds to match the LoadingScreen component

      return () => clearTimeout(timer);
    }
  }, [showLoadingScreen]);

  // Remove the effect that checks if data is loaded
  // This ensures the full animation plays regardless of data loading speed

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

    // Fetch CodeChef contests separately
    await fetchCodeChefContests();
  }

  async function fetchCodeChefContests(refresh = false) {
    try {
      setLoadingCodechef(true);
      const url = refresh
        ? "/api/contests/codechef?refresh=true"
        : "/api/contests/codechef";

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch CodeChef contests");
      }

      const data = await response.json();
      console.log("CodeChef data:", data);

      // Combine and format contests
      const ccContests = [
        ...data.upcoming.map((contest) => ({
          ...contest,
          platform: "CodeChef",
          title: contest.name,
          duration: contest.duration || "2h 30m",
          status: "upcoming",
        })),
        ...data.past30Days.map((contest) => ({
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

    // Otherwise, combine contests from all platforms
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
      ...codechefContests.filter(
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
  const isLoading = loadingCodeforces || loadingLeetcode || loadingCodechef;

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
    <>
      {/* Wrap the SearchParamsHandler in a Suspense boundary */}
      <Suspense fallback={null}>
        <SearchParamsHandler
          setSelectedPlatforms={setSelectedPlatforms}
          setHighlightedContest={setHighlightedContest}
        />
      </Suspense>

      {showLoadingScreen && <LoadingScreen />}
      <div
        className={`flex flex-col lg:flex-row gap-8 ${
          showLoadingScreen ? "opacity-0 invisible" : "opacity-100 visible"
        } transition-opacity duration-500`}
      >
        {/* Left Sidebar - Filter Section (Desktop) */}
        <aside className="hidden lg:block sticky top-24 h-fit">
          <FilterSection
            selectedPlatforms={selectedPlatforms}
            setSelectedPlatforms={setSelectedPlatforms}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            bookmarkedOnly={bookmarkedOnly}
            setBookmarkedOnly={setBookmarkedOnly}
            showDisclaimer={true}
            isCompact={false}
          />
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Mobile Filter Section */}
          <div className="lg:hidden mb-6">
            <FilterSection
              selectedPlatforms={selectedPlatforms}
              setSelectedPlatforms={setSelectedPlatforms}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              bookmarkedOnly={bookmarkedOnly}
              setBookmarkedOnly={setBookmarkedOnly}
              showDisclaimer={true}
              isCompact={true}
            />
          </div>

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
                <LazyLoadWrapper
                  key={`contest-${index}`}
                  placeholder={
                    <div className="h-48 rounded-2xl bg-[#1a1b1e]/50 animate-pulse" />
                  }
                >
                  <ContestCard
                    {...contest}
                    isHighlighted={highlightedContest === contest.title}
                  />
                </LazyLoadWrapper>
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
    </>
  );
}
