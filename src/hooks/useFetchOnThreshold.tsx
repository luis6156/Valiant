import { useEffect, useRef } from 'react';

interface Props {
  threshold: number;
  fetchFunction: () => void;
  lastFetchTime: number;
}

const useFetchOnThreshold = ({
  threshold,
  fetchFunction,
  lastFetchTime,
}: Props) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkThreshold = () => {
      const currentTime = Date.now();

      if (!lastFetchTime || currentTime - lastFetchTime > threshold) {
        fetchFunction();
      }
    };

    checkThreshold(); // Run immediately on mount

    // Set up the interval to check the threshold periodically
    timerRef.current = setInterval(checkThreshold, threshold);

    // Clean up the interval on unmount
    return () => {
      clearInterval(timerRef.current!);
    };
  }, [threshold, fetchFunction]);
};

export default useFetchOnThreshold;
