import React, { useState, useCallback, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import type { BaseComponentProps } from './types';

export interface SearchProps extends BaseComponentProps {
  onSearch: (value: string) => void;
  placeholder?: string;
  initialValue?: string;
  debounceMs?: number;
}

export const Search: React.FC<SearchProps> = ({
  onSearch,
  placeholder = 'Search...',
  initialValue = '',
  debounceMs = 300,
  className = ''
}) => {
  const [value, setValue] = useState(initialValue);
  const debouncedValue = useDebounce(value, debounceMs);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  // Effect to call onSearch when debounced value changes
  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  return (
    <div className={`relative ${className}`}>
      <input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="
          w-full px-4 py-2 text-sm
          border border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
          placeholder-gray-400
        "
      />
      <svg
        className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
};
