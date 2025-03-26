import FilterSection from "./components/FilterSection";
import ContestCard from "./components/ContestCard";

export default function Home() {
  // Sample data - this would come from your API
  const sampleContests = [
    {
      platform: "LeetCode",
      title: "Biweekly Contest 152",
      startTime: new Date("2024-03-15T20:00:00"),
      duration: "1h 30m",
      isUpcoming: true,
    },
    {
      platform: "Codeforces",
      title: "Codeforces Round 1010 (Div. 1, Unrated)",
      startTime: new Date("2024-03-15T20:05:00"),
      duration: "3h",
      isUpcoming: true,
    },
    {
      platform: "CodeChef",
      title: "Starters 178",
      startTime: new Date("2024-03-19T20:00:00"),
      duration: "2h",
      isUpcoming: true,
    },
  ];

  return (
    <div className="flex gap-6">
      {/* Left Sidebar - Filter Section */}
      <aside className="hidden md:block">
        <FilterSection />
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">All Contests</h1>
          </div>

          {/* Contest Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {sampleContests.map((contest, index) => (
              <ContestCard key={index} {...contest} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
