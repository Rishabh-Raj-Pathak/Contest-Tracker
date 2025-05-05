// Test file for CodeChef scraper
import { fetchLatestContests } from "./api/codechef";

async function testScraper() {
  console.log("Testing CodeChef scraper...");
  try {
    const contests = await fetchLatestContests();
    console.log("Scraped contests:", JSON.stringify(contests, null, 2));
    console.log("Upcoming contests:", contests.upcoming.length);
    console.log("Past contests:", contests.past30Days.length);
  } catch (error) {
    console.error("Error testing scraper:", error);
  }
}

// Export the test function so it can be called from another file
export { testScraper };
