// This is a script that can be run directly with Node.js to test our scraper
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { load } = require("cheerio");

// Path for storing scraped data
const DATA_FILE_PATH = path.join(
  process.cwd(),
  "app/lib/data/codechef-contests.json"
);

// Ensure the data directory exists
const ensureDataDirExists = () => {
  const dir = path.dirname(DATA_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
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

// Save contests to file
const saveContestsToFile = (contests) => {
  try {
    ensureDataDirExists();
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(contests, null, 2));
    console.log("CodeChef contests saved to file:", DATA_FILE_PATH);
  } catch (error) {
    console.error("Error saving CodeChef contests to file:", error);
  }
};

// Parse upcoming contests using cheerio
const parseUpcomingContests = (html) => {
  try {
    console.log("Parsing upcoming contests with cheerio...");
    const $ = load(html);
    const results = [];

    // Log the html length to verify we have data
    console.log(`HTML length: ${html.length} characters`);

    // Look for contest containers
    $('div[class*="flex__container"]').each((i, element) => {
      try {
        const linkElement = $(element).find("a");
        const url = linkElement.attr("href");
        if (!url) {
          console.log(`No URL found in element ${i}`);
          return;
        }

        const name = linkElement.text().trim();
        console.log(`Found contest: ${name} (${url})`);

        // Try to find timer container
        const timerContainer = $(element).find('div[class*="timer"]');
        const timerValues = timerContainer.find("p");
        const daysText = $(timerValues[0]).text() || "0 Days";
        const hoursText = $(timerValues[1]).text() || "0 Hrs";
        console.log(`Timer values: ${daysText}, ${hoursText}`);

        const startTime = computeStartTime(daysText, hoursText);

        results.push({
          id: extractContestId(url),
          name,
          url,
          startTime: startTime.toISOString(),
          status: "upcoming",
        });
      } catch (err) {
        console.error(`Error parsing contest element ${i}:`, err);
      }
    });

    console.log(`Parsed ${results.length} upcoming contests`);
    return results;
  } catch (error) {
    console.error("Error parsing upcoming contests:", error);
    return [];
  }
};

// Parse past contests using cheerio
const parsePastContests = (html) => {
  try {
    console.log("Parsing past contests with cheerio...");
    const $ = load(html);
    const results = [];

    // Look for contest containers
    $('div[class*="flex__container"]').each((i, element) => {
      try {
        const linkElement = $(element).find("a");
        const url = linkElement.attr("href");
        if (!url) return;

        const name = linkElement.text().trim();
        console.log(`Found past contest: ${name} (${url})`);

        // Try to find subtitle container
        const subtitleElement = $(element).find('div[class*="subtitle"]');
        const participantsText = subtitleElement.text() || "";
        let participants = 0;
        const match = participantsText.match(/Participants: (\d+)/);
        if (match) {
          participants = parseInt(match[1]);
          console.log(`Participants: ${participants}`);
        }

        // For now, we can't extract start time directly
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
        console.error(`Error parsing past contest element ${i}:`, err);
      }
    });

    console.log(`Parsed ${results.length} past contests`);
    return results;
  } catch (error) {
    console.error("Error parsing past contests:", error);
    return [];
  }
};

// Main function to run the test
async function main() {
  try {
    console.log("Testing CodeChef contest scraping...");

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
    } catch (fileError) {
      console.error("Error reading local HTML files:", fileError.message);
      console.log("Attempting to fetch from CodeChef website...");

      try {
        const response = await axios.get("https://www.codechef.com/contests", {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          },
        });

        upcomingHtml = response.data;
        pastHtml = response.data; // Same page contains both
        console.log("Successfully fetched data from CodeChef");
      } catch (fetchError) {
        console.error("Error fetching from CodeChef:", fetchError.message);
        process.exit(1);
      }
    }

    // Parse contests
    const upcoming = parseUpcomingContests(upcomingHtml);
    const past = parsePastContests(pastHtml);

    // Save results
    const contests = { upcoming, past30Days: past };
    saveContestsToFile(contests);

    console.log("Test completed successfully");
  } catch (error) {
    console.error("Test failed:", error);
  }
}

// Run the test
main();
