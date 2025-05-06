import { memoizeWithTTL } from "../utils";

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
 * LeetCode contest patterns - these define when contests happen and how to calculate them
 * The base dates are confirmed contest dates that we use as reference points
 */
const CONTEST_PATTERNS = {
  weekly: {
    id: "weekly-contest",
    name: "Weekly Contest",
    intervalDays: 7,
    baseDate: new Date("2025-05-11T02:30:00Z"), // Known date: 08:00 IST
    baseNumber: 449, // The contest number for the base date
    durationMinutes: 90,
  },
  biweekly: {
    id: "biweekly-contest",
    name: "Biweekly Contest",
    intervalDays: 14,
    baseDate: new Date("2025-05-10T14:30:00Z"), // Known date: 20:00 IST
    baseNumber: 156, // The contest number for the base date
    durationMinutes: 90,
  },
};

/**
 * Generates LeetCode contest data for past, ongoing, and future contests
 * @returns {Promise<Contest[]>} Array of contest objects
 */
async function _getLeetCodeContests() {
  try {
    // Current time for status calculation
    const NOW = new Date();

    // How many contests to show in the past (per contest type)
    const PAST_CONTESTS_COUNT = 4;

    // Calculate cutoff for past contests (30 days ago)
    const CUTOFF = new Date(NOW.getTime() - 30 * 24 * 60 * 60 * 1000);

    console.log(
      "Generating LeetCode contests from",
      CUTOFF.toISOString(),
      "to now:",
      NOW.toISOString()
    );

    // Initialize contests array
    let contests = [];

    // Process each contest type to get past and current contests
    Object.entries(CONTEST_PATTERNS).forEach(([type, pattern]) => {
      // Generate past and current contests for this pattern
      const typeContests = generatePastContests(
        type,
        pattern,
        NOW,
        CUTOFF,
        PAST_CONTESTS_COUNT
      );

      // Add to our contests array
      contests.push(...typeContests);
    });

    // Now generate exactly the next 2 upcoming contests
    const upcomingContests = generateUpcomingContests(NOW);
    contests = [...contests, ...upcomingContests];

    // Sort all contests by startTime
    contests.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

    // Log contest counts by status
    const upcomingCount = contests.filter(
      (c) => c.status === "upcoming"
    ).length;
    const ongoingCount = contests.filter((c) => c.status === "ongoing").length;
    const pastCount = contests.filter((c) => c.status === "past").length;

    console.log(`Generated LeetCode contests:
      - Upcoming: ${upcomingCount}
      - Ongoing: ${ongoingCount}
      - Past: ${pastCount}`);

    return contests;
  } catch (error) {
    console.error("Error fetching LeetCode contests:", error);
    return [];
  }
}

/**
 * Memoized version with 5 minute cache
 */
export const getLeetCodeContests = memoizeWithTTL(
  _getLeetCodeContests,
  5 * 60 * 1000
);

/**
 * Generates past contests of a specific type based on the pattern
 * @param {string} type - The contest type (weekly/biweekly)
 * @param {Object} pattern - The contest pattern object
 * @param {Date} now - Current date/time
 * @param {Date} cutoff - The cutoff date for past contests
 * @param {number} pastCount - Number of past contests to generate
 * @returns {Array<Contest>} - Array of contest objects
 */
function generatePastContests(type, pattern, now, cutoff, pastCount) {
  const contests = [];
  const nowTime = now.getTime();

  // Find the most recent contest that has already started (or is about to start)
  let contestDate = new Date(pattern.baseDate);
  let contestNumber = pattern.baseNumber;

  // Move base contest forward or backward to find the nearest contest to now
  if (contestDate.getTime() < nowTime) {
    // Base date is in the past, move forward toward present
    while (contestDate.getTime() < nowTime) {
      const nextDate = new Date(contestDate);
      nextDate.setDate(nextDate.getDate() + pattern.intervalDays);

      // If going to the next contest would overshoot current date, we've found the most recent past contest
      if (nextDate.getTime() > nowTime) {
        break;
      }

      contestDate = nextDate;
      contestNumber++;
    }
  } else {
    // Base date is in the future, move backward toward present
    while (contestDate.getTime() > nowTime) {
      contestDate.setDate(contestDate.getDate() - pattern.intervalDays);
      contestNumber--;
    }
  }

  // Now we have the most recent contest before or at the current time
  // First, add the current/most recent contest
  contests.push(
    createContestObject(type, pattern, contestNumber, contestDate, now)
  );

  // Then generate past contests (going backwards)
  let currentDate = new Date(contestDate);
  let currentNumber = contestNumber;

  for (let i = 0; i < pastCount; i++) {
    currentDate = new Date(currentDate);
    currentDate.setDate(currentDate.getDate() - pattern.intervalDays);
    currentNumber--;

    // Only include contests after the cutoff date
    if (currentDate.getTime() >= cutoff.getTime()) {
      contests.push(
        createContestObject(type, pattern, currentNumber, currentDate, now)
      );
    }
  }

  return contests;
}

/**
 * Generates exactly the next 2 upcoming contests
 * LeetCode alternates between weekly and biweekly contests:
 * - Weekly contests happen every Saturday
 * - Biweekly contests happen every other Friday
 * @param {Date} now - Current date/time
 * @returns {Array<Contest>} - The next 2 upcoming contests
 */
function generateUpcomingContests(now) {
  const nowTime = now.getTime();
  const upcomingContests = [];

  // Find next weekly contest
  let weeklyDate = findNextContestDate(
    CONTEST_PATTERNS.weekly.baseDate,
    CONTEST_PATTERNS.weekly.intervalDays,
    nowTime
  );

  let weeklyNumber = calculateContestNumber(
    CONTEST_PATTERNS.weekly.baseDate,
    CONTEST_PATTERNS.weekly.baseNumber,
    CONTEST_PATTERNS.weekly.intervalDays,
    weeklyDate
  );

  // Find next biweekly contest
  let biweeklyDate = findNextContestDate(
    CONTEST_PATTERNS.biweekly.baseDate,
    CONTEST_PATTERNS.biweekly.intervalDays,
    nowTime
  );

  let biweeklyNumber = calculateContestNumber(
    CONTEST_PATTERNS.biweekly.baseDate,
    CONTEST_PATTERNS.biweekly.baseNumber,
    CONTEST_PATTERNS.biweekly.intervalDays,
    biweeklyDate
  );

  // Add both upcoming contests
  upcomingContests.push(
    createContestObject(
      "weekly",
      CONTEST_PATTERNS.weekly,
      weeklyNumber,
      weeklyDate,
      now
    )
  );

  upcomingContests.push(
    createContestObject(
      "biweekly",
      CONTEST_PATTERNS.biweekly,
      biweeklyNumber,
      biweeklyDate,
      now
    )
  );

  // Sort them by date and only return the next 2
  upcomingContests.sort(
    (a, b) => new Date(a.startTime) - new Date(b.startTime)
  );

  // Only return the nearest 2 upcoming contests
  return upcomingContests
    .filter((contest) => contest.status === "upcoming")
    .slice(0, 2);
}

/**
 * Finds the next contest date based on a pattern
 * @param {Date} baseDate - The known contest date
 * @param {number} intervalDays - The interval between contests in days
 * @param {number} nowTime - Current timestamp
 * @returns {Date} - Date of the next contest
 */
function findNextContestDate(baseDate, intervalDays, nowTime) {
  let contestDate = new Date(baseDate);

  // If base date is in the past, move forward until we find a future contest
  if (contestDate.getTime() <= nowTime) {
    while (contestDate.getTime() <= nowTime) {
      contestDate.setDate(contestDate.getDate() + intervalDays);
    }
  }
  // If base date is in the future, it's already our next contest

  return contestDate;
}

/**
 * Calculates contest number based on date difference from base
 * @param {Date} baseDate - Reference contest date
 * @param {number} baseNumber - Reference contest number
 * @param {number} intervalDays - Days between contests
 * @param {Date} targetDate - Date to calculate number for
 * @returns {number} - Calculated contest number
 */
function calculateContestNumber(
  baseDate,
  baseNumber,
  intervalDays,
  targetDate
) {
  const diffTime = targetDate.getTime() - baseDate.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  const diffContests = Math.round(diffDays / intervalDays);

  return baseNumber + diffContests;
}

/**
 * Creates a contest object with the specified properties
 * @param {string} type - "weekly" or "biweekly"
 * @param {Object} pattern - The contest pattern object
 * @param {number} number - Contest number
 * @param {Date} startDate - Contest start date
 * @param {Date} now - Current date/time for status calculation
 * @returns {Contest} - The contest object
 */
function createContestObject(type, pattern, number, startDate, now) {
  const id = `${pattern.id}-${number}`;
  const name = `${pattern.name} ${number}`;
  const url = `https://leetcode.com/contest/${id}/`;

  // End time is 90 minutes after start time
  const endDate = new Date(
    startDate.getTime() + pattern.durationMinutes * 60 * 1000
  );

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

  // Format duration as a string (e.g., "1h 30m")
  const hours = Math.floor(pattern.durationMinutes / 60);
  const minutes = pattern.durationMinutes % 60;
  const durationStr = `${hours}h ${minutes}m`;

  return {
    id,
    name,
    platform: "LeetCode",
    title: name,
    url,
    startTime: startDate.toISOString(),
    endTime: endDate.toISOString(),
    duration: durationStr,
    status,
    isBookmarked: false,
  };
}
