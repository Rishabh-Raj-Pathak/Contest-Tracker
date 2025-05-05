"use client";
import { useState, useEffect } from "react";

export default function CalendarDebugPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    codeforces: null,
    leetcode: null,
    codechef: null,
    events: [],
  });
  const [error, setError] = useState(null);

  // Fetch all contest data for debugging
  useEffect(() => {
    async function fetchAllData() {
      setLoading(true);
      try {
        // Fetch from all three sources
        const [cfResponse, lcResponse, ccResponse] = await Promise.all([
          fetch("/api/contests/codeforces"),
          fetch("/api/contests/leetcode"),
          fetch("/api/contests/codechef"),
        ]);

        // Process responses
        const cfData = await cfResponse.json();
        const lcData = await lcResponse.json();
        const ccData = await ccResponse.json();

        // Combine data for calendar events
        const allContests = [
          ...cfData.map((c) => ({ ...c, platform: "Codeforces" })),
          ...lcData.map((c) => ({ ...c, platform: "LeetCode" })),
          ...ccData.upcoming.map((c) => ({
            ...c,
            platform: "CodeChef",
            status: "upcoming",
          })),
          ...ccData.past30Days.map((c) => ({
            ...c,
            platform: "CodeChef",
            status: "past",
          })),
        ];

        // Transform to calendar events
        const events = allContests.map((contest) => {
          const platform = contest.platform.toLowerCase();
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

          return {
            id: `${contest.platform}-${contest.id || contest.title}`,
            title: contest.title || contest.name,
            start: contest.startTime,
            end: contest.endTime,
            platform: contest.platform,
            status: contest.status,
            color,
          };
        });

        // Store all data for debugging
        setData({
          codeforces: cfData,
          leetcode: lcData,
          codechef: ccData,
          events,
        });
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.toString());
      } finally {
        setLoading(false);
      }
    }

    fetchAllData();
  }, []);

  // Format date for display
  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleString();
    } catch (e) {
      return `Invalid date: ${dateStr}`;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white/90">Calendar Debug</h1>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="w-10 h-10 border-t-2 border-b-2 border-white/50 rounded-full animate-spin mr-3"></div>
          <p className="text-white/70">Loading data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-500/20 text-white p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Error Loading Data</h2>
          <p>{error}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Display event information */}
          <div className="bg-[#1a1b1e]/95 border border-white/[0.05] rounded-xl p-4">
            <h2 className="text-lg font-semibold mb-4 text-white/90">
              Calendar Events ({data.events.length})
            </h2>

            {data.events.length === 0 ? (
              <p className="text-red-400">
                No events generated! Check API responses below.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 px-4 text-white/70">
                        Platform
                      </th>
                      <th className="text-left py-2 px-4 text-white/70">
                        Title
                      </th>
                      <th className="text-left py-2 px-4 text-white/70">
                        Start Time
                      </th>
                      <th className="text-left py-2 px-4 text-white/70">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.events.map((event, i) => (
                      <tr key={i} className="border-b border-white/5">
                        <td className="py-2 px-4 text-white/90">
                          {event.platform}
                        </td>
                        <td className="py-2 px-4 text-white/90">
                          {event.title}
                        </td>
                        <td className="py-2 px-4 text-white/90">
                          {formatDate(event.start)}
                        </td>
                        <td className="py-2 px-4">
                          <span
                            className={`inline-block px-2 py-1 rounded-lg text-xs ${
                              event.status === "upcoming"
                                ? "bg-green-500/20 text-green-400"
                                : event.status === "ongoing"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }`}
                          >
                            {event.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Raw API responses */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white/90">
              Raw API Responses
            </h2>

            {/* Codeforces */}
            <div className="bg-[#1a1b1e]/95 border border-[#318CE7]/20 rounded-xl p-4">
              <h3 className="text-md font-semibold mb-2 text-[#318CE7]">
                Codeforces API ({data.codeforces?.length || 0} contests)
              </h3>
              {data.codeforces?.length > 0 ? (
                <pre className="text-xs text-white/70 bg-black/30 p-2 rounded overflow-x-auto">
                  {JSON.stringify(data.codeforces[0], null, 2)}
                </pre>
              ) : (
                <p className="text-red-400">
                  No data received from Codeforces API
                </p>
              )}
            </div>

            {/* LeetCode */}
            <div className="bg-[#1a1b1e]/95 border border-[#FFA116]/20 rounded-xl p-4">
              <h3 className="text-md font-semibold mb-2 text-[#FFA116]">
                LeetCode API ({data.leetcode?.length || 0} contests)
              </h3>
              {data.leetcode?.length > 0 ? (
                <pre className="text-xs text-white/70 bg-black/30 p-2 rounded overflow-x-auto">
                  {JSON.stringify(data.leetcode[0], null, 2)}
                </pre>
              ) : (
                <p className="text-red-400">
                  No data received from LeetCode API
                </p>
              )}
            </div>

            {/* CodeChef */}
            <div className="bg-[#1a1b1e]/95 border border-[#1FA34B]/20 rounded-xl p-4">
              <h3 className="text-md font-semibold mb-2 text-[#1FA34B]">
                CodeChef API (Upcoming: {data.codechef?.upcoming?.length || 0},
                Past: {data.codechef?.past30Days?.length || 0})
              </h3>
              {data.codechef?.upcoming?.length > 0 ? (
                <pre className="text-xs text-white/70 bg-black/30 p-2 rounded overflow-x-auto">
                  {JSON.stringify(data.codechef.upcoming[0], null, 2)}
                </pre>
              ) : (
                <p className="text-red-400">
                  No upcoming contests received from CodeChef API
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
