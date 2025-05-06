/**
 * Creates a debounced function that delays invoking func until after wait milliseconds have elapsed
 * since the last time the debounced function was invoked.
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Simple in-memory cache for API responses
 */
const cache = new Map();

/**
 * Memoize an async function with a TTL (time to live)
 * @param {Function} fn The async function to memoize
 * @param {number} ttl Time to live in milliseconds
 * @returns The memoized function
 */
export function memoizeWithTTL(fn, ttl = 5 * 60 * 1000) {
  // Default 5 minutes
  return async function (...args) {
    const key = JSON.stringify(args);
    const cached = cache.get(key);

    if (cached && Date.now() - cached.timestamp < ttl) {
      // console.log("Using cached data for", args);
      return cached.value;
    }

    const result = await fn(...args);
    cache.set(key, {
      timestamp: Date.now(),
      value: result,
    });
    return result;
  };
}

/**
 * Clear the memoization cache
 */
export function clearMemoizationCache() {
  cache.clear();
}
