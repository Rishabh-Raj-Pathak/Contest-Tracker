"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * This component helps prevent navigation issues by cleaning up localStorage operations
 * when navigating between pages
 */
export default function NavigationSafeguard() {
  const pathname = usePathname();

  // When pathname changes, ensure any pending localStorage operations complete
  useEffect(() => {
    // Create a cleanup function to ensure localStorage operations complete
    let isSyncing = false;

    const syncStorage = () => {
      if (isSyncing) return;

      isSyncing = true;

      // Force localStorage to sync by making a small read/write
      try {
        const tempKey = `__nav_sync_${Date.now()}`;
        localStorage.setItem(tempKey, "1");
        localStorage.removeItem(tempKey);
      } catch (err) {
        console.error("Failed to sync localStorage:", err);
      } finally {
        isSyncing = false;
      }
    };

    // Sync on page change
    syncStorage();

    // Sync before unload (page navigation)
    const handleBeforeUnload = () => {
      syncStorage();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [pathname]);

  return null; // This component doesn't render anything
}
