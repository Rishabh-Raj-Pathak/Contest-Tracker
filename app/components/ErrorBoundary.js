"use client";

import { useState, useEffect } from "react";

export default function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Handler for unhandled promise rejections
    const errorHandler = (event) => {
      // Check if it's a chunk load error
      if (
        event.reason &&
        (event.reason.toString().includes("ChunkLoadError") ||
          event.reason.message?.includes("ChunkLoadError"))
      ) {
        console.error("Chunk load error detected:", event.reason);
        setHasError(true);

        // Clear localStorage to reset app state
        try {
          localStorage.removeItem("appState");
        } catch (e) {
          console.error("Failed to clear localStorage:", e);
        }
      }
    };

    // Add event listener
    window.addEventListener("unhandledrejection", errorHandler);

    // Cleanup
    return () => {
      window.removeEventListener("unhandledrejection", errorHandler);
    };
  }, []);

  if (hasError) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#0f1115] text-white p-6 z-50">
        <div className="bg-[#1a1b1e] p-6 rounded-xl max-w-lg text-center border border-white/10 shadow-xl">
          <h2 className="text-xl font-semibold mb-4">Something went wrong</h2>
          <p className="mb-6 text-white/70">
            The application encountered an error while loading resources.
          </p>
          <button
            onClick={() => {
              // Hard reload the page
              window.location.reload();
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }

  return children;
}
