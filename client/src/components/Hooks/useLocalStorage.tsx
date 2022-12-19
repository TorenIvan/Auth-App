import { Dispatch, SetStateAction, useEffect, useState } from "react";

/* "function" keyword due to eslint problem with generic <T> */
function useLocalStorage<T>(
  key: string,
  value: T
): [storedValue: T, setStoredValue: Dispatch<SetStateAction<T>>] {
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

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      setStoredValue(value);
    } catch (error) {
      console.error(`Failed to Update Local Storage Value with key: ${key} error: ${error}`);
    }
  }, [key, value]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
