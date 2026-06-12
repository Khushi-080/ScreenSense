import { useEffect, useState } from "react";

export const useScreenData = () => {
  const [history, setHistory] = useState([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Example structure from localStorage
    const stored = JSON.parse(localStorage.getItem("screenHistory")) || [];

    setHistory(stored);

    // Calculate streak (consecutive underLimit days from latest)
    let count = 0;

    for (let i = stored.length - 1; i >= 0; i--) {
      if (stored[i].underLimit) {
        count++;
      } else {
        break;
      }
    }

    setStreak(count);
    setLoading(false);
  }, []);

  return { history, streak, loading };
};