// This is a server component that initializes the scheduler
"use server";

import { startScheduler } from "../lib/scheduler";

// Initialize the scheduler on server side
let isInitialized = false;

export default async function SchedulerInitializer() {
  // Only initialize once to prevent multiple scheduler instances
  if (typeof window === "undefined" && !isInitialized) {
    isInitialized = true;
    
    // Start the scheduler
    startScheduler();
  }

  // Return null as this component doesn't render anything
  return null;
}
