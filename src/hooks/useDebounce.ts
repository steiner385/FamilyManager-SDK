import { useState, useEffect } from 'react';

/**
 * A hook that returns a debounced value that only updates after a specified delay.
 * @param value The value to debounce
 * @param delay The delay in milliseconds before updating the value
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
