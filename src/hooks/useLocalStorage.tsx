import { useState } from 'react';

export function useLocalStorage<T>(key: string, defaultValue: T): [T, (newValue: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) as T : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setLocalStorageValue = (newValue: T) => {
    try {
      localStorage.setItem(key, JSON.stringify(newValue));
    } catch {
    }
    setValue(newValue);
  };

  return [value, setLocalStorageValue];
}
