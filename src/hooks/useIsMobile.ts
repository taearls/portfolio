import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 640; // Matches Tailwind's sm breakpoint

/**
 * Hook to detect if the viewport is mobile-sized (below sm breakpoint).
 * Uses matchMedia for efficient viewport detection with automatic updates on resize.
 */
export default function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT - 1}px)`,
    );

    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    // Listen for changes
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return isMobile;
}
