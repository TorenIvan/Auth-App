import { useCallback, useState } from 'react';

export function useLocalStorage<T>(
  key: string,
  value: T
): readonly [storedValue: T, updateStoredValue: (value: T) => void] {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) return JSON.parse(item) as T;
      return value;
    } catch (error) {
      console.error(error);
      return value;
    }
  });

  const updateStoredValue = useCallback((value: T) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      setStoredValue(value);
    } catch (error) {
      console.error(`Failed to Update Local Storage Value with key: ${key} error: ${error}`);
    }
  }, []);

  return [storedValue, updateStoredValue] as const;
}
