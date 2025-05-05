// Utility functions for managing bookmarked contests in localStorage

const STORAGE_KEY = "bookmarked-contests";

// Get all bookmarked contests from localStorage
export const getBookmarkedContests = () => {
  if (typeof window === "undefined") return [];

  try {
    const bookmarksJson = localStorage.getItem(STORAGE_KEY);
    return bookmarksJson ? JSON.parse(bookmarksJson) : [];
  } catch (error) {
    console.error("Error loading bookmarks from localStorage:", error);
    return [];
  }
};

// Add a contest to bookmarks
export const addBookmark = (contest) => {
  if (typeof window === "undefined") return;

  try {
    const bookmarks = getBookmarkedContests();

    // Check if contest is already bookmarked (avoid duplicates)
    const isAlreadyBookmarked = bookmarks.some(
      (item) =>
        item.platform === contest.platform &&
        item.title === contest.title &&
        item.startTime === contest.startTime
    );

    if (!isAlreadyBookmarked) {
      bookmarks.push({
        platform: contest.platform,
        title: contest.title,
        startTime: contest.startTime,
        duration: contest.duration,
        status: contest.status,
        url: contest.url,
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    }
  } catch (error) {
    console.error("Error adding bookmark to localStorage:", error);
  }
};

// Remove a contest from bookmarks
export const removeBookmark = (contest) => {
  if (typeof window === "undefined") return;

  try {
    let bookmarks = getBookmarkedContests();

    bookmarks = bookmarks.filter(
      (item) =>
        !(
          item.platform === contest.platform &&
          item.title === contest.title &&
          item.startTime === contest.startTime
        )
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  } catch (error) {
    console.error("Error removing bookmark from localStorage:", error);
  }
};

// Check if a contest is bookmarked
export const isContestBookmarked = (contest) => {
  if (typeof window === "undefined") return false;

  try {
    const bookmarks = getBookmarkedContests();

    return bookmarks.some(
      (item) =>
        item.platform === contest.platform &&
        item.title === contest.title &&
        item.startTime === contest.startTime
    );
  } catch (error) {
    console.error("Error checking bookmark status:", error);
    return false;
  }
};
