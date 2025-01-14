import { useState, useEffect } from 'react';
/**
 * A hook that returns a debounced value that only updates after a specified delay.
 * @param value The value to debounce
 * @param delay The delay in milliseconds before updating the value
 * @returns The debounced value
 */
export function useDebounce(value, delay = 300) {
    const [debouncedValue, setDebouncedValue] = useState(value);
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
//# sourceMappingURL=useDebounce.js.map