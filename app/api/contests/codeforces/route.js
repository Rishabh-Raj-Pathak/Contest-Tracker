// Server-side route handler for Codeforces contests API
import { NextResponse } from "next/server";

// Utility function to create sample Codeforces contest data
const generateSampleCodeforcesContests = () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const contests = [
    // Past contest (yesterday)
    {
      id: "1234",
      title: "Codeforces Round #999 (Div. 2)",
      url: "https://codeforces.com/contests/1234",
      startTime: new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
      duration: "2h 15m",
      status: "past",
    },
    // Ongoing contest (today)
    {
      id: "1235",
      title: "Codeforces Educational Round 200",
      url: "https://codeforces.com/contests/1235",
      startTime: new Date(today.getTime() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from today
      duration: "2h",
      status: "ongoing",
    },
    // Upcoming contests
    {
      id: "1236",
      title: "Codeforces Round #1000 (Div. 1)",
      url: "https://codeforces.com/contests/1236",
      startTime: new Date(
        today.getTime() + 2 * 24 * 60 * 60 * 1000
      ).toISOString(), // 2 days from now
      duration: "2h 30m",
      status: "upcoming",
    },
    {
      id: "1237",
      title: "Codeforces Round #1001 (Div. 3)",
      url: "https://codeforces.com/contests/1237",
      startTime: new Date(
        today.getTime() + 5 * 24 * 60 * 60 * 1000
      ).toISOString(), // 5 days from now
      duration: "2h",
      status: "upcoming",
    },
    {
      id: "1238",
      title: "Codeforces Global Round 30",
      url: "https://codeforces.com/contests/1238",
      startTime: new Date(
        today.getTime() + 10 * 24 * 60 * 60 * 1000
      ).toISOString(), // 10 days from now
      duration: "3h",
      status: "upcoming",
    },
    // Past contest (30 days ago)
    {
      id: "1239",
      title: "Codeforces Round #998 (Div. 1 + Div. 2)",
      url: "https://codeforces.com/contests/1239",
      startTime: new Date(
        today.getTime() - 30 * 24 * 60 * 60 * 1000
      ).toISOString(), // 30 days ago
      duration: "2h 15m",
      status: "past",
    },
  ];

  return contests;
};

export async function GET(request) {
  try {
    // In a real application, you would fetch this data from Codeforces API
    // or scrape their website. For now, we'll use sample data.
    const contests = generateSampleCodeforcesContests();

    return NextResponse.json(contests, {
      status: 200,
      headers: {
        "Cache-Control": "max-age=300", // Cache for 5 minutes
      },
    });
  } catch (error) {
    console.error("Error in Codeforces contests API:", error);
    return NextResponse.json(
      { error: "Failed to fetch Codeforces contests" },
      { status: 500 }
    );
  }
}
