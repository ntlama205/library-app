import { useState, useEffect } from "react";

// Like useState, but saved in local storage (same keys/format as the original app).
// An empty saved list falls back to the starting data, like the original init().
export default function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(key));
      if (saved === null) return initial;
      if (Array.isArray(saved) && saved.length === 0) return initial;
      return saved;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}
