import { useCallback, useEffect, useState } from "react";

// Counts down once per second, used for "resend code" cooldowns
export function useCountdown(initial = 0) {
  const [seconds, setSeconds] = useState(initial);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);

  const restart = useCallback((from = 60) => setSeconds(from), []);

  return { seconds, restart };
}
