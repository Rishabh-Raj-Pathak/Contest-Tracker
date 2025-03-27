import FilterSection from "./components/FilterSection";
import ContestCard from "./components/ContestCard";
import { sampleContests } from "./lib/sampleData";

export default function Home() {
  return (
    <div className="flex gap-8">
      {/* Left Sidebar - Filter Section */}
      <aside className="hidden lg:block sticky top-24 h-fit">
        <FilterSection />
      </aside>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white/90">All Contests</h1>
          <span className="text-sm text-white/60">
            {sampleContests.length} contests found
          </span>
        </div>

        {/* Contest Cards Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {sampleContests.map((contest, index) => (
            <ContestCard key={index} {...contest} />
          ))}
        </div>
      </div>
    </div>
  );
}
