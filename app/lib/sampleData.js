const baseDate = "2024-03-27T12:00:00Z";

export const sampleContests = [
  {
    platform: "LeetCode",
    title: "Weekly Contest 389",
    startTime: baseDate, // Use as reference time
    duration: "1h 30m",
    status: "upcoming",
  },
  {
    platform: "Codeforces",
    title: "Codeforces Round #925 (Div. 3)",
    startTime: "2024-03-27T11:30:00Z", // 30 minutes before base
    duration: "2h 15m",
    status: "ongoing",
  },
  {
    platform: "CodeChef",
    title: "Starters 124 (Rated for All)",
    startTime: "2024-03-27T17:00:00Z", // 5 hours after base
    duration: "2h",
    status: "upcoming",
    isBookmarked: true,
  },
  {
    platform: "LeetCode",
    title: "Biweekly Contest 126",
    startTime: "2024-03-27T10:00:00Z", // 2 hours before base
    duration: "1h 30m",
    status: "past",
  },
  {
    platform: "Codeforces",
    title: "Educational Codeforces Round #162 (Rated for Div. 2)",
    startTime: "2024-03-28T12:00:00Z", // 24 hours after base
    duration: "2h",
    status: "upcoming",
  },
  {
    platform: "CodeChef",
    title: "March Long Challenge 2024",
    startTime: "2024-03-30T12:00:00Z", // 3 days after base
    duration: "10 days",
    status: "upcoming",
  },
  {
    platform: "LeetCode",
    title: "Weekly Contest 388",
    startTime: "2024-03-22T12:00:00Z", // 5 days before base
    duration: "1h 30m",
    status: "past",
  },
  {
    platform: "Codeforces",
    title: "Codeforces Round #924 (Div. 2)",
    startTime: "2024-03-27T12:45:00Z", // 45 minutes after base
    duration: "2h 15m",
    status: "upcoming",
    isBookmarked: true,
  },
];
