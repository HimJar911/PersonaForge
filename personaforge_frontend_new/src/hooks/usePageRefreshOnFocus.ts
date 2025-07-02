"use client";

import { useEffect } from "react";

/**
 * Triggers the callback whenever the user refocuses the tab or navigates back to this page.
 */
export default function usePageRefreshOnFocus(callback: () => void) {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        callback();
      }
    };

    window.addEventListener("focus", callback); // catches back button + focus
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", callback);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [callback]);
}
