"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function SearchParamsHandler({
  setSelectedPlatforms,
  setHighlightedContest,
}) {
  const searchParams = useSearchParams();

  // Handle URL parameters when navigating from calendar
  useEffect(() => {
    const platform = searchParams.get("platform");
    const highlight = searchParams.get("highlight");

    if (platform) {
      setSelectedPlatforms([platform]);
    }

    if (highlight) {
      setHighlightedContest(decodeURIComponent(highlight));
    }
  }, [searchParams, setSelectedPlatforms, setHighlightedContest]);

  return null; // This component doesn't render anything
}
