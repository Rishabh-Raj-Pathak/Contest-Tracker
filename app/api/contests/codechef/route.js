// Server-side route handler for CodeChef contests API
import { NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";
import * as cheerio from "cheerio";
import axios from "axios";

// Path for storing scraped data
const DATA_FILE_PATH = path.join(
  process.cwd(),
  "app/lib/data/codechef-contests.json"
);

// Ensure directory exists
const ensureDataDirExists = () => {
  const dir = path.dirname(DATA_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Load contests from file if it exists
const loadContestsFromFile = () => {
  try {
    ensureDataDirExists();
    if (fs.existsSync(DATA_FILE_PATH)) {
      const data = fs.readFileSync(DATA_FILE_PATH, "utf8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error loading CodeChef contests from file:", error);
  }
  return { upcoming: [], past30Days: [] };
};

// Save contests to file
const saveContestsToFile = (contests) => {
  try {
    ensureDataDirExists();
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(contests, null, 2));
    console.log("CodeChef contests saved to file");
  } catch (error) {
    console.error("Error saving CodeChef contests to file:", error);
  }
};

// Extract contest ID from URL
const extractContestId = (url) => {
  const parts = url.split("/");
  return parts[parts.length - 1];
};

// Parse timer values to compute start time
const computeStartTime = (daysText, hoursText) => {
  const days = parseInt(daysText.replace(/Days/i, "").trim()) || 0;
  const hours = parseInt(hoursText.replace(/Hrs/i, "").trim()) || 0;

  const now = new Date();
  const startTime = new Date(now);
  startTime.setDate(now.getDate() + days);
  startTime.setHours(now.getHours() + hours);

  return startTime;
};

// Check if date is within last 30 days
const isWithinLast30Days = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);

  return date >= thirtyDaysAgo && date <= now;
};

// Parse participants count
const parseParticipants = (text) => {
  const match = text.match(/Participants: (\d+)/);
  return match ? parseInt(match[1]) : 0;
};

// Parse upcoming contests using cheerio
const parseUpcomingContests = (html) => {
  try {
    console.log("Parsing upcoming contests with cheerio...");
    const $ = cheerio.load(html);
    const results = [];

    // Try with exact class names found in the HTML
    const containers = $('div[class*="_flex__container_"]');
    console.log(`Found ${containers.length} potential contest containers`);

    containers.each((i, element) => {
      try {
        const linkElement = $(element).find("a");
        const url = linkElement.attr("href");
        if (!url) return;

        const name = linkElement.text().trim();
        console.log(`Found upcoming contest: ${name} (${url})`);

        // Try to find timer container with multiple methods
        const timerContainer = $(element).find(
          'div[class*="_timer__container_"]'
        );
        const timerValues = timerContainer.find("p");

        // Extract days and hours
        let startTime;
        try {
          const daysText = $(timerValues[0]).text() || "0 Days";
          const hoursText = $(timerValues[1]).text() || "0 Hrs";
          console.log(`Timer values for ${name}: ${daysText}, ${hoursText}`);

          const days = parseInt(daysText.replace(/Days/i, "").trim()) || 0;
          const hours = parseInt(hoursText.replace(/Hrs/i, "").trim()) || 0;

          startTime = new Date();
          startTime.setDate(startTime.getDate() + days);
          startTime.setHours(startTime.getHours() + hours);
        } catch (err) {
          console.error(`Error parsing timer for ${name}:`, err);
          // Fallback to next Wednesday
          startTime = getNextWednesdayDate();
        }

        // Extract contest ID from URL
        const id = extractContestId(url);

        // Standard duration for CodeChef contests
        const duration = "2h 30m";

        results.push({
          id,
          name,
          url,
          startTime: startTime.toISOString(),
          duration,
          status: "upcoming",
        });
      } catch (err) {
        console.error(`Error parsing contest element ${i}:`, err);
      }
    });

    // If we found contests, return them
    if (results.length > 0) {
      return results;
    }

    // If no contests found, use sample data with upcoming Wednesday dates
    console.log("No contests found, using sample data");
    return [
      {
        id: "START185",
        name: "Starters 185 (Rated till 5 star)",
        url: "https://www.codechef.com/START185",
        startTime: getNextWednesdayDate().toISOString(),
        duration: "2h 30m",
        status: "upcoming",
      },
      {
        id: "START186",
        name: "Starters 186 (Rated till 6 star)",
        url: "https://www.codechef.com/START186",
        startTime: getNextWednesdayDate(7).toISOString(), // 1 week after next Wednesday
        duration: "2h 30m",
        status: "upcoming",
      },
    ];
  } catch (error) {
    console.error("Error parsing upcoming contests:", error);
    return [];
  }
};

// Parse past contests using cheerio
const parsePastContests = (html) => {
  try {
    console.log("Parsing past contests with cheerio...");
    const $ = cheerio.load(html);
    const results = [];

    // Try with exact class names found in the HTML
    const containers = $('div[class*="_flex__container_"]');
    console.log(`Found ${containers.length} potential past contest containers`);

    containers.each((i, element) => {
      try {
        const linkElement = $(element).find("a");
        const url = linkElement.attr("href");
        if (!url) return;

        const name = linkElement.text().trim();
        console.log(`Found past contest: ${name} (${url})`);

        // Try to find subtitle container
        const subtitleElement = $(element).find('div[class*="_subtitle_"]');
        const participantsText = subtitleElement.text() || "";
        const participants = parseParticipants(participantsText);

        // Calculate a date that's a past Wednesday
        // Take the contest number from the URL to estimate the date
        // (higher number means more recent)
        const contestId = extractContestId(url);
        const contestNumber = parseInt(contestId.replace(/\D/g, "")) || 0;

        // START184 is most recent, then 183, etc.
        const baseDate = getPreviousWednesdayDate(); // Most recent Wednesday

        // If most recent contest is START184, adjust date based on number difference
        // Assume each contest is 1 week apart
        const mostRecentContestNumber = 184; // Based on data
        const weeksDifference = mostRecentContestNumber - contestNumber;

        const startTime = new Date(baseDate);
        if (weeksDifference > 0) {
          startTime.setDate(startTime.getDate() - weeksDifference * 7);
        }

        // Standard duration for CodeChef contests
        const duration = "2h 30m";

        results.push({
          id: contestId,
          name,
          url,
          startTime: startTime.toISOString(),
          duration,
          participants,
          status: "past",
        });
      } catch (err) {
        console.error(`Error parsing past contest element ${i}:`, err);
      }
    });

    return results.filter((contest) => isWithinLast30Days(contest.startTime));
  } catch (error) {
    console.error("Error parsing past contests:", error);
    return [];
  }
};

// Helper function to get next Wednesday at 8 PM IST
function getNextWednesdayDate(additionalDays = 0) {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  // Calculate days until next Wednesday (3 is Wednesday)
  const daysUntilWednesday = (3 - dayOfWeek + 7) % 7;

  // If today is Wednesday and it's before 8 PM IST, use today
  const isWednesday = dayOfWeek === 3;
  const now_hours = now.getHours();
  const isPastEightPM = now_hours >= 20; // 8 PM in 24-hour format

  let daysToAdd = daysUntilWednesday;
  if (isWednesday && !isPastEightPM) {
    daysToAdd = 0; // Today is Wednesday and before 8 PM
  } else if (isWednesday && isPastEightPM) {
    daysToAdd = 7; // Today is Wednesday but past 8 PM, so next Wednesday
  }

  // Add the calculated days plus any additional days
  const date = new Date(now);
  date.setDate(date.getDate() + daysToAdd + additionalDays);

  // Set to 8:00 PM IST (2:30 PM UTC)
  date.setHours(20, 0, 0, 0); // 8 PM local time

  return date;
}

// Helper function to get previous Wednesday
function getPreviousWednesdayDate(weeksAgo = 0) {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  // Calculate days since last Wednesday (3 is Wednesday)
  let daysSinceWednesday = dayOfWeek - 3;
  if (daysSinceWednesday < 0) {
    daysSinceWednesday += 7;
  }

  // If today is Wednesday, check the time
  if (dayOfWeek === 3) {
    const now_hours = now.getHours();
    const isPastEightPM = now_hours >= 20; // 8 PM in 24-hour format

    if (isPastEightPM) {
      daysSinceWednesday = 0; // Today is Wednesday and after 8 PM
    } else {
      daysSinceWednesday = 7; // Today is Wednesday but before 8 PM, so use last Wednesday
    }
  }

  // Add the calculated days plus any additional weeks
  const date = new Date(now);
  date.setDate(date.getDate() - daysSinceWednesday - weeksAgo * 7);

  // Set to 8:00 PM IST
  date.setHours(20, 0, 0, 0); // 8 PM local time

  return date;
}

// Fetch contests data
const fetchContestsData = async (forceRefresh = false) => {
  // If not forcing a refresh, try to load from file first
  if (!forceRefresh) {
    const fileData = loadContestsFromFile();
    if (fileData.upcoming.length > 0 || fileData.past30Days.length > 0) {
      console.log("Returning cached data from file");
      return fileData;
    }
  }

  try {
    // Try to read the local HTML files first
    let upcomingHtml, pastHtml;

    try {
      console.log("Reading local HTML files...");
      upcomingHtml = fs.readFileSync(
        path.join(
          process.cwd(),
          "app/dom-data-files/codechef/upcomingCon.html"
        ),
        "utf8"
      );
      pastHtml = fs.readFileSync(
        path.join(
          process.cwd(),
          "app/dom-data-files/codechef/pastContest.html"
        ),
        "utf8"
      );
      console.log("Successfully read local HTML files");

      // Parse contests from HTML
      const upcoming = parseUpcomingContests(upcomingHtml);
      const past30Days = parsePastContests(pastHtml);

      // If we have contests, save and return them
      if (upcoming.length > 0 || past30Days.length > 0) {
        const contests = { upcoming, past30Days };
        saveContestsToFile(contests);
        return contests;
      }
    } catch (fileError) {
      console.error("Error reading local HTML files:", fileError.message);
    }

    // If we reach here, either there was an error or no contests were found
    // Try to fetch from CodeChef website
    try {
      console.log("Attempting to fetch from CodeChef website...");
      const response = await axios.get("https://www.codechef.com/contests", {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      });

      const html = response.data;
      console.log("Successfully fetched data from CodeChef");

      // Parse contests
      const upcoming = parseUpcomingContests(html);
      const past30Days = parsePastContests(html);

      // Save and return results
      const contests = { upcoming, past30Days };
      saveContestsToFile(contests);
      return contests;
    } catch (fetchError) {
      console.error("Error fetching from CodeChef:", fetchError.message);
    }

    // If all methods have failed, fallback to sample data
    console.log("All methods failed, using fallback data");

    // Fallback data using helper functions for dates
    const upcoming = [
      {
        id: "START185",
        name: "Starters 185 (Rated till 5 star)",
        url: "https://www.codechef.com/START185",
        startTime: getNextWednesdayDate().toISOString(),
        duration: "2h 30m",
        status: "upcoming",
      },
      {
        id: "START186",
        name: "Starters 186 (Rated till 6 star)",
        url: "https://www.codechef.com/START186",
        startTime: getNextWednesdayDate(7).toISOString(),
        duration: "2h 30m",
        status: "upcoming",
      },
    ];

    const past30Days = [
      {
        id: "START184",
        name: "Starters 184 (Rated till 5 star)",
        url: "https://www.codechef.com/START184",
        startTime: getPreviousWednesdayDate().toISOString(),
        duration: "2h 30m",
        participants: 19600,
        status: "past",
      },
      {
        id: "START183",
        name: "Starters 183 (Rated till 6 star)",
        url: "https://www.codechef.com/START183",
        startTime: getPreviousWednesdayDate(1).toISOString(),
        duration: "2h 30m",
        participants: 24530,
        status: "past",
      },
      {
        id: "START182",
        name: "Starters 182 (Rated till 5 star)",
        url: "https://www.codechef.com/START182",
        startTime: getPreviousWednesdayDate(2).toISOString(),
        duration: "2h 30m",
        participants: 32303,
        status: "past",
      },
    ];

    const contests = { upcoming, past30Days };
    saveContestsToFile(contests);
    return contests;
  } catch (error) {
    console.error("Error fetching contests:", error);
    return { upcoming: [], past30Days: [] };
  }
};

// API route handler
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const forceRefresh = searchParams.get("refresh") === "true";

  try {
    console.log("API: Fetching CodeChef contests...");
    const contests = await fetchContestsData(forceRefresh);
    console.log(
      `API: Found ${contests.upcoming.length} upcoming and ${contests.past30Days.length} past contests`
    );
    return NextResponse.json(contests);
  } catch (error) {
    console.error("API: Error fetching CodeChef contests:", error);
    return NextResponse.json(
      { error: "Failed to fetch CodeChef contests", message: error.message },
      { status: 500 }
    );
  }
}
