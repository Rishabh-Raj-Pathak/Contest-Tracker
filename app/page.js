"use client";

import { useEffect, useState } from "react";
import FilterSection from "./components/FilterSection";
import ContestCard from "./components/ContestCard";
import { getCodeforcesContests } from "./lib/api/codeforces";

export default function Home() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);

  useEffect(() => {
    fetchContests();
  }, []);

  async function fetchContests() {
    try {
      const codeforcesContests = await getCodeforcesContests();
      setContests(codeforcesContests);
    } catch (error) {
      console.error("Error fetching contests:", error);
    } finally {
      setLoading(false);
    }
  }

  // Filter contests based on selected filters
  const filteredContests = contests.filter((contest) => {
    // Platform filter
    if (
      selectedPlatforms.length > 0 &&
      !selectedPlatforms.includes(contest.platform)
    ) {
      return false;
    }

    // Status filter
    if (selectedStatus !== "all" && contest.status !== selectedStatus) {
      return false;
    }

    // Bookmark filter
    if (bookmarkedOnly && !contest.isBookmarked) {
      return false;
    }

    return true;
  });

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
        />
      </aside>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white/90">
            {getStatusText()}
          </h1>
          <span className="text-sm text-white/60">
            {filteredContests.length} contests found
          </span>
        </div>

        {loading ? (
          // Loading skeleton
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="h-48 rounded-2xl bg-[#1a1b1e]/50 animate-pulse"
              />
            ))}
          </div>
        ) : (
          // Contest Cards Grid
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredContests.map((contest, index) => (
              <ContestCard key={index} {...contest} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
