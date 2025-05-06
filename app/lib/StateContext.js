"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

// Create the context
const StateContext = createContext(undefined);

// Current state version - increment this when making changes to state structure
const STATE_VERSION = 1;

// Time when data should be refreshed (default: 5 minutes)
const REFRESH_INTERVAL = 5 * 60 * 1000;

// Helper function to safely serialize data
const safeStringify = (data) => {
  try {
    // Create a clean copy of the data without circular references or functions
    const seen = new WeakSet();
    const replacer = (key, value) => {
      // Handle special types that can't be serialized
      if (typeof value === "function") {
        return undefined; // Skip functions
      }
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return "[Circular]"; // Replace circular references
        }
        seen.add(value);
      }
      return value;
    };

    return JSON.stringify(data, replacer);
  } catch (error) {
    console.error("Error serializing state:", error);
    return null;
  }
};

// Helper function to safely parse stored data
const safeParse = (str) => {
  if (!str) return null;
  try {
    return JSON.parse(str);
  } catch (error) {
    console.error("Error parsing stored state:", error);
    return null;
  }
};

export function StateProvider({ children }) {
  const [state, setState] = useState({
    version: STATE_VERSION,
    contestsData: null,
    contestsDataTimestamp: null,
    calendarData: null,
    calendarDataTimestamp: null,
  });

  // Load state from localStorage on initial mount
  useEffect(() => {
    if (typeof window === "undefined") return; // Skip on server

    // Use setTimeout to defer localStorage reading to avoid blocking navigation
    const timer = setTimeout(() => {
      try {
        const savedState = localStorage.getItem("appState");
        if (savedState) {
          const parsedState = safeParse(savedState);
          // Only use saved state if version matches
          if (parsedState && parsedState.version === STATE_VERSION) {
            setState(parsedState);
          } else {
            // console.log("Resetting state due to version mismatch");
            localStorage.removeItem("appState");
          }
        }
      } catch (error) {
        console.error("Error loading state from localStorage:", error);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Save state to localStorage when it changes, but debounced
  useEffect(() => {
    if (typeof window === "undefined") return; // Skip on server
    if (!state.contestsData && !state.calendarData) return; // Skip if empty

    // Use setTimeout to defer localStorage writing to avoid blocking navigation
    const timer = setTimeout(() => {
      try {
        const serialized = safeStringify(state);
        if (serialized) {
          localStorage.setItem("appState", serialized);
        }
      } catch (error) {
        console.error("Error saving state to localStorage:", error);
      }
    }, 100); // Small delay to avoid blocking UI

    return () => clearTimeout(timer);
  }, [state]);

  // Function to store contests data with timestamp - using useCallback to avoid recreating function
  const saveContestsData = useCallback((data) => {
    // Clean data before storing to prevent circular references
    const cleanData = {
      codeforcesContests: data.codeforcesContests || [],
      leetcodeContests: data.leetcodeContests || [],
      codechefContests: data.codechefContests || [],
      selectedPlatforms: data.selectedPlatforms || [],
      selectedStatus: data.selectedStatus || "all",
      bookmarkedOnly: !!data.bookmarkedOnly,
      bookmarkedContests: data.bookmarkedContests || [],
    };

    setState((prevState) => ({
      ...prevState,
      version: STATE_VERSION, // Always ensure version is current
      contestsData: cleanData,
      contestsDataTimestamp: Date.now(),
    }));
  }, []);

  // Function to store calendar data with timestamp - using useCallback to avoid recreating function
  const saveCalendarData = useCallback((data) => {
    // Clean data before storing to prevent circular references
    const cleanData = {
      allContests: data.allContests || [],
      debugInfo: data.debugInfo || { loaded: false, count: 0 },
      codeforcesContests: data.codeforcesContests || [],
      leetcodeContests: data.leetcodeContests || [],
      codechefContests: data.codechefContests || [],
    };

    setState((prevState) => ({
      ...prevState,
      version: STATE_VERSION, // Always ensure version is current
      calendarData: cleanData,
      calendarDataTimestamp: Date.now(),
    }));
  }, []);

  // Check if contests data needs refresh - using useCallback to avoid recreating function
  const contestsNeedRefresh = useCallback(() => {
    if (!state.contestsData || !state.contestsDataTimestamp) return true;
    return Date.now() - state.contestsDataTimestamp > REFRESH_INTERVAL;
  }, [state.contestsData, state.contestsDataTimestamp]);

  // Check if calendar data needs refresh - using useCallback to avoid recreating function
  const calendarNeedRefresh = useCallback(() => {
    if (!state.calendarData || !state.calendarDataTimestamp) return true;
    return Date.now() - state.calendarDataTimestamp > REFRESH_INTERVAL;
  }, [state.calendarData, state.calendarDataTimestamp]);

  // Function to clear all cached data - using useCallback to avoid recreating function
  const clearAllData = useCallback(() => {
    setState({
      version: STATE_VERSION,
      contestsData: null,
      contestsDataTimestamp: null,
      calendarData: null,
      calendarDataTimestamp: null,
    });

    // Use setTimeout to defer localStorage clearing to avoid blocking navigation
    setTimeout(() => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("appState");
      }
    }, 0);
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = {
    contestsData: state.contestsData,
    calendarData: state.calendarData,
    saveContestsData,
    saveCalendarData,
    contestsNeedRefresh,
    calendarNeedRefresh,
    clearAllData,
  };

  return (
    <StateContext.Provider value={contextValue}>
      {children}
    </StateContext.Provider>
  );
}

// Custom hook to use the state context
export function useAppState() {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error("useAppState must be used within a StateProvider");
  }
  return context;
}
