"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A wrapper component that lazy loads its children when they enter the viewport
 */
export default function LazyLoadWrapper({
  children,
  placeholder = null,
  rootMargin = "100px",
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the element becomes visible, update state and disconnect
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin, // Load elements when they are 100px from entering the viewport
        threshold: 0.01, // Trigger when at least 1% of the element is visible
      }
    );

    // Start observing the container
    if (ref.current) {
      observer.observe(ref.current);
    }

    // Clean up the observer when component unmounts
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [rootMargin]);

  return (
    <div ref={ref} className="min-h-[100px]">
      {isVisible ? children : placeholder}
    </div>
  );
}
