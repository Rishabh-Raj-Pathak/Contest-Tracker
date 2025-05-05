// codechef.js - CodeChef contest data scraper
import fs from "fs";
import path from "path";
import { parse } from "node-html-parser";
import axios from "axios";
import * as cheerio from "cheerio";

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
export const loadContestsFromFile = () => {
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
export const saveContestsToFile = (contests) => {
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
  // Example URL: https://www.codechef.com/START185D
  const parts = url.split("/");
  return parts[parts.length - 1];
};

// Parse timer values to compute start time
const computeStartTime = (daysText, hoursText) => {
  const days = parseInt(daysText.replace("Days", "").trim()) || 0;
  const hours = parseInt(hoursText.replace("Hrs", "").trim()) || 0;

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

// Parse upcoming contests from HTML
const parseUpcomingContests = (html) => {
  try {
    // Try first with node-html-parser
    const root = parse(html);

    // Look for flexible class patterns
    const flexContainers = root.querySelectorAll(
      'div[class*="flex__container"]'
    );

    if (flexContainers && flexContainers.length > 0) {
      return flexContainers.map((element) => {
        const linkElement = element.querySelector("a");
        const url = linkElement.getAttribute("href");
        const name = linkElement.textContent.trim();

        // Extract timer values - looking for containers with timer in class name
        const timerContainer = element.querySelector('div[class*="timer"]');
        const timerValues = timerContainer
          ? timerContainer.querySelectorAll("p")
          : [];
        const daysText = timerValues[0]?.textContent || "0 Days";
        const hoursText = timerValues[1]?.textContent || "0 Hrs";

        const startTime = computeStartTime(daysText, hoursText);

        return {
          id: extractContestId(url),
          name,
          url,
          startTime: startTime.toISOString(),
          status: "upcoming",
        };
      });
    }

    // Fallback to cheerio
    console.log("Falling back to cheerio for parsing upcoming contests");
    const $ = cheerio.load(html);
    const results = [];

    // Use more flexible selector
    $('div[class*="flex__container"]').each((i, element) => {
      try {
        const linkElement = $(element).find("a");
        const url = linkElement.attr("href");
        const name = linkElement.text().trim();

        // Try to find timer container with multiple methods
        const timerContainer = $(element).find('div[class*="timer"]');
        const timerValues = timerContainer.find("p");
        const daysText = $(timerValues[0]).text() || "0 Days";
        const hoursText = $(timerValues[1]).text() || "0 Hrs";

        const startTime = computeStartTime(daysText, hoursText);

        results.push({
          id: extractContestId(url),
          name,
          url,
          startTime: startTime.toISOString(),
          status: "upcoming",
        });
      } catch (err) {
        console.error("Error parsing contest element:", err);
      }
    });

    return results;
  } catch (error) {
    console.error("Error parsing upcoming contests:", error);
    return [];
  }
};

// Parse past contests from HTML
const parsePastContests = (html) => {
  try {
    // Try first with node-html-parser
    const root = parse(html);

    // Look for flexible class patterns
    const flexContainers = root.querySelectorAll(
      'div[class*="flex__container"]'
    );

    if (flexContainers && flexContainers.length > 0) {
      return flexContainers
        .map((element) => {
          const linkElement = element.querySelector("a");
          if (!linkElement) return null;

          const url = linkElement.getAttribute("href");
          const name = linkElement.textContent.trim();

          // Extract participants count - looking for subtitle in class name
          const subtitleElement = element.querySelector(
            'div[class*="subtitle"]'
          );
          const participantsText = subtitleElement?.textContent || "";
          const participants = parseParticipants(participantsText);

          // For now, we can't extract start time directly from this HTML
          const startTime = new Date();
          startTime.setDate(startTime.getDate() - 7); // Default to 7 days ago

          return {
            id: extractContestId(url),
            name,
            url,
            startTime: startTime.toISOString(),
            participants,
            status: "past",
          };
        })
        .filter((item) => item !== null)
        .filter((contest) => isWithinLast30Days(contest.startTime));
    }

    // Fallback to cheerio
    console.log("Falling back to cheerio for parsing past contests");
    const $ = cheerio.load(html);
    const results = [];

    // Use more flexible selector
    $('div[class*="flex__container"]').each((i, element) => {
      try {
        const linkElement = $(element).find("a");
        const url = linkElement.attr("href");
        if (!url) return;

        const name = linkElement.text().trim();

        // Try to find subtitle container
        const subtitleElement = $(element).find('div[class*="subtitle"]');
        const participantsText = subtitleElement.text() || "";
        const participants = parseParticipants(participantsText);

        // For now, we can't extract start time directly from this HTML
        const startTime = new Date();
        startTime.setDate(startTime.getDate() - 7); // Default to 7 days ago

        results.push({
          id: extractContestId(url),
          name,
          url,
          startTime: startTime.toISOString(),
          participants,
          status: "past",
        });
      } catch (err) {
        console.error("Error parsing contest element:", err);
      }
    });

    return results.filter((contest) => isWithinLast30Days(contest.startTime));
  } catch (error) {
    console.error("Error parsing past contests:", error);
    return [];
  }
};

// Fetch latest contests from CodeChef
export const fetchLatestContests = async () => {
  try {
    // In a real implementation, we would use axios to fetch the actual pages
    let upcomingHtml, pastHtml;

    try {
      console.log("Attempting to fetch live data from CodeChef");
      // Try to fetch from actual CodeChef API/page
      const upcomingResponse = await axios.get(
        "https://www.codechef.com/contests",
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          },
        }
      );

      // Store response HTML
      upcomingHtml = upcomingResponse.data;
      pastHtml = upcomingResponse.data; // Same page has both upcoming and past contests

      console.log("Successfully fetched contest data from CodeChef");
    } catch (fetchError) {
      console.log("Error fetching from CodeChef API:", fetchError.message);
      console.log("Falling back to local HTML files...");

      // Fallback to local files if fetch fails
      try {
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
        console.log("Successfully loaded local HTML files");
      } catch (fileError) {
        console.error("Error reading local HTML files:", fileError);
        throw new Error(
          "Failed to fetch contest data from both API and local files"
        );
      }
    }

    console.log("Parsing upcoming contests...");
    const upcoming = parseUpcomingContests(upcomingHtml);
    console.log(`Found ${upcoming.length} upcoming contests`);

    console.log("Parsing past contests...");
    const past30Days = parsePastContests(pastHtml);
    console.log(`Found ${past30Days.length} past contests within 30 days`);

    const contests = { upcoming, past30Days };
    saveContestsToFile(contests);

    return contests;
  } catch (error) {
    console.error("Error fetching CodeChef contests:", error);
    console.log("Attempting to load from cached file");
    return loadContestsFromFile(); // Fallback to file if fetch fails
  }
};

// Get all contests (from file or fetch fresh if needed)
export const getAllContests = async (forceFetch = false) => {
  if (forceFetch) {
    return await fetchLatestContests();
  }

  const fileData = loadContestsFromFile();
  if (!fileData.upcoming.length && !fileData.past30Days.length) {
    return await fetchLatestContests();
  }

  return fileData;
};

// For production use with actual scraping
export const scrapeCodeChefContests = async () => {
  try {
    // For now, we'll use the fetchLatestContests function
    return await fetchLatestContests();
  } catch (error) {
    console.error("Error scraping CodeChef contests:", error);
    return loadContestsFromFile();
  }
};
