// Server-side route handler for LeetCode contests API
import { NextResponse } from "next/server";

// Utility function to create sample LeetCode contest data
const generateSampleLeetCodeContests = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const contests = [
    // Past contests
    {
      id: "weekly-360",
      title: "Weekly Contest 360",
      url: "https://leetcode.com/contest/weekly-contest-360",
      startTime: new Date(
        today.getTime() - 7 * 24 * 60 * 60 * 1000
      ).toISOString(), // 1 week ago
      duration: "1h 30m",
      status: "past",
    },
    {
      id: "biweekly-105",
      title: "Biweekly Contest 105",
      url: "https://leetcode.com/contest/biweekly-contest-105",
      startTime: new Date(
        today.getTime() - 14 * 24 * 60 * 60 * 1000
      ).toISOString(), // 2 weeks ago
      duration: "1h 30m",
      status: "past",
    },

    // Upcoming contests
    {
      id: "weekly-361",
      title: "Weekly Contest 361",
      url: "https://leetcode.com/contest/weekly-contest-361",
      startTime: new Date(
        today.getTime() + 4 * 24 * 60 * 60 * 1000
      ).toISOString(), // 4 days from now (Saturday)
      duration: "1h 30m",
      status: "upcoming",
    },
    {
      id: "biweekly-106",
      title: "Biweekly Contest 106",
      url: "https://leetcode.com/contest/biweekly-contest-106",
      startTime: new Date(
        today.getTime() + 11 * 24 * 60 * 60 * 1000
      ).toISOString(), // 11 days from now
      duration: "1h 30m",
      status: "upcoming",
    },
    {
      id: "weekly-362",
      title: "Weekly Contest 362",
      url: "https://leetcode.com/contest/weekly-contest-362",
      startTime: new Date(
        today.getTime() + 11 * 24 * 60 * 60 * 1000
      ).toISOString(), // 11 days from now (next Saturday)
      duration: "1h 30m",
      status: "upcoming",
    },
  ];

  return contests;
};

export async function GET(request) {
  try {
    // In a real application, you would fetch this data from LeetCode API
    // or scrape their website. For now, we'll use sample data.
    const contests = generateSampleLeetCodeContests();

    return NextResponse.json(contests, {
      status: 200,
      headers: {
        "Cache-Control": "max-age=300", // Cache for 5 minutes
      },
    });
  } catch (error) {
    console.error("Error in LeetCode contests API:", error);
    return NextResponse.json(
      { error: "Failed to fetch LeetCode contests" },
      { status: 500 }
    );
  }
}
