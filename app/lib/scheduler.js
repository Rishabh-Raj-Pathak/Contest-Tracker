// scheduler.js - Handles scheduled tasks for contest scraping
import { fetchLatestContests } from "./api/codechef";

// Simple in-memory store for last run time
let lastRunTime = null;

// Wednesday contest times are around 8 PM IST (2:30 PM UTC)
// We'll schedule runs before and after the contests:
// - Tuesday 10:00 PM UTC (before contest)
// - Thursday 6:00 AM UTC (after contest)

// Check if it's time to run based on day of week and hour
const shouldRunScraper = () => {
  const now = new Date();
  const day = now.getUTCDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const hour = now.getUTCHours();

  // If we've run in the last 6 hours, don't run again
  if (lastRunTime && now - lastRunTime < 6 * 60 * 60 * 1000) {
    return false;
  }

  // Tuesday at 10 PM UTC (2 = Tuesday, 22 = 10 PM)
  if (day === 2 && hour === 22) {
    return true;
  }

  // Thursday at 6 AM UTC (4 = Thursday, 6 = 6 AM)
  if (day === 4 && hour === 6) {
    return true;
  }

  return false;
};

// Run the scraper if it's time
export const runScheduledTasks = async () => {
  if (shouldRunScraper()) {
    // console.log("Running scheduled CodeChef contest scraper...");
    await fetchLatestContests();
    lastRunTime = new Date();
    // console.log("Scheduled task completed at", lastRunTime.toISOString());
  }
};

// Periodically check if it's time to run scheduled tasks (every hour)
let schedulerInterval = null;

export const startScheduler = () => {
  if (schedulerInterval) {
    return; // Already running
  }

  // Run immediately on startup to ensure we have data
  runScheduledTasks();

  // Check every hour
  schedulerInterval = setInterval(runScheduledTasks, 60 * 60 * 1000);
  // console.log("Contest scheduler started");
};

export const stopScheduler = () => {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
    // console.log("Contest scheduler stopped");
  }
};
