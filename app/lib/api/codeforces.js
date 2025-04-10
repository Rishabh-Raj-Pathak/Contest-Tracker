import axios from "axios";

// Function to determine contest status
function getContestStatus(contest) {
  const now = Date.now();
  const startTime = contest.startTimeSeconds * 1000;
  const endTime = startTime + contest.durationSeconds * 1000;

  if (now < startTime) return "upcoming";
  if (now >= startTime && now <= endTime) return "ongoing";
  return "past";
}

// Function to format duration
function formatDuration(durationSeconds) {
  const hours = Math.floor(durationSeconds / 3600);
  const minutes = Math.floor((durationSeconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

export async function getCodeforcesContests() {
  try {
    const response = await axios.get("https://codeforces.com/api/contest.list");

    if (response.data.status !== "OK") {
      throw new Error("Failed to fetch contests");
    }

    const oneMonthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

    const contests = response.data.result
      .filter((contest) => {
        const contestTime = contest.startTimeSeconds * 1000;
        // Filter out contests older than 1 month and non-public contests
        return (
          (contestTime > oneMonthAgo || getContestStatus(contest) !== "past") &&
          !contest.name.toLowerCase().includes("(private)")
        );
      })
      .map((contest) => ({
        platform: "Codeforces",
        title: contest.name,
        startTime: new Date(contest.startTimeSeconds * 1000).toISOString(),
        duration: formatDuration(contest.durationSeconds),
        status: getContestStatus(contest),
        url: `https://codeforces.com/contest/${contest.id}`,
        isBookmarked: false,
      }))
      .sort((a, b) => {
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

    return contests;
  } catch (error) {
    console.error("Error fetching Codeforces contests:", error);
    return [];
  }
}
