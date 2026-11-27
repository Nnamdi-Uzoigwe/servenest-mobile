import { useEffect, useState } from "react";

// Follows a value, but only after it has stopped changing for a moment
export function useDebounced<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
