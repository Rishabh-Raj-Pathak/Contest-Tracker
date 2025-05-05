/**
 * @typedef {Object} Contest
 * @property {string} id - Contest identifier (e.g., "weekly-contest-449")
 * @property {string} name - Contest name (e.g., "Weekly Contest 449")
 * @property {string} platform - Always "LeetCode"
 * @property {string} url - Full contest URL
 * @property {string} startTime - ISO formatted start time
 * @property {string} duration - Contest duration (always "1h 30m")
 * @property {string} status - Contest status: "past", "ongoing", or "upcoming"
 * @property {boolean} isBookmarked - Always false by default
 */

/**
 * Generates LeetCode contest data for the past month plus upcoming contests
 * This uses a deterministic approach based on LeetCode's contest schedule
 * @returns {Promise<Contest[]>} Array of past and upcoming contests
 */
export async function getLeetCodeContests() {
  // Hardcoded upcoming contests with their UTC timestamps
  const UPCOMING = {
    weekly: {
      id: "weekly-contest-449",
      start: new Date("2025-05-11T02:30:00Z"), // 08:00 GMT+05:30
      number: 449,
    },
    biweekly: {
      id: "biweekly-contest-156",
      start: new Date("2025-05-10T14:30:00Z"), // 20:00 GMT+05:30
      number: 156,
    },
  };

  // Get current date for accurate comparison
  const NOW = new Date();
  const CUTOFF = new Date(NOW.getTime() - 30 * 24 * 60 * 60 * 1000);

  console.log(
    "Generating LeetCode contests from",
    CUTOFF.toISOString(),
    "to now:",
    NOW.toISOString()
  );

  // Initialize contests array
  const contests = [];

  // Generate weekly contests (backwards from the upcoming one)
  let weeklyNumber = UPCOMING.weekly.number;
  let weeklyDate = new Date(UPCOMING.weekly.start);

  // Add the upcoming weekly contest
  contests.push(createContestObject("weekly", weeklyNumber, weeklyDate, NOW));

  // Generate past weekly contests
  weeklyNumber--;
  weeklyDate = new Date(weeklyDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days earlier

  while (weeklyDate >= CUTOFF) {
    contests.push(createContestObject("weekly", weeklyNumber, weeklyDate, NOW));
    weeklyNumber--;
    weeklyDate = new Date(weeklyDate.getTime() - 7 * 24 * 60 * 60 * 1000);
  }

  // Generate biweekly contests (backwards from the upcoming one)
  let biweeklyNumber = UPCOMING.biweekly.number;
  let biweeklyDate = new Date(UPCOMING.biweekly.start);

  // Add the upcoming biweekly contest
  contests.push(
    createContestObject("biweekly", biweeklyNumber, biweeklyDate, NOW)
  );

  // Generate past biweekly contests
  biweeklyNumber--;
  biweeklyDate = new Date(biweeklyDate.getTime() - 14 * 24 * 60 * 60 * 1000); // 14 days earlier

  while (biweeklyDate >= CUTOFF) {
    contests.push(
      createContestObject("biweekly", biweeklyNumber, biweeklyDate, NOW)
    );
    biweeklyNumber--;
    biweeklyDate = new Date(biweeklyDate.getTime() - 14 * 24 * 60 * 60 * 1000);
  }

  // Sort contests by startTime (ascending)
  contests.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

  // Log upcoming contests
  const upcomingContests = contests.filter((c) => c.status === "upcoming");
  console.log("Upcoming LeetCode contests:", upcomingContests);

  // Log past month contests
  const pastContests = contests.filter((c) => c.status === "past");
  console.log(`Past LeetCode contests (${pastContests.length}):`, pastContests);

  return contests;
}

/**
 * Creates a contest object with the specified properties
 * @param {string} type - "weekly" or "biweekly"
 * @param {number} number - Contest number
 * @param {Date} startDate - Contest start date
 * @param {Date} now - Current date/time for status calculation
 * @returns {Contest} - The contest object
 */
function createContestObject(type, number, startDate, now) {
  const id = `${type}-contest-${number}`;
  const name = `${
    type.charAt(0).toUpperCase() + type.slice(1)
  } Contest ${number}`;
  const url = `https://leetcode.com/contest/${id}/`;

  // End time is 90 minutes after start time
  const endDate = new Date(startDate.getTime() + 90 * 60 * 1000);

  // Compare timestamps for accurate comparison
  const nowTimestamp = now.getTime();
  const startTimestamp = startDate.getTime();
  const endTimestamp = endDate.getTime();

  // Determine status
  let status;
  if (nowTimestamp < startTimestamp) {
    status = "upcoming";
  } else if (nowTimestamp >= startTimestamp && nowTimestamp <= endTimestamp) {
    status = "ongoing";
  } else {
    status = "past";
  }

  return {
    id,
    name,
    platform: "LeetCode",
    title: name,
    url,
    startTime: startDate.toISOString(),
    endTime: endDate.toISOString(),
    duration: "1h 30m",
    status,
    isBookmarked: false,
  };
}
