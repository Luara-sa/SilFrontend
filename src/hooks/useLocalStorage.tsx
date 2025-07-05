import { useState, useEffect } from "react";

interface LocalStorageState<T> {
  value: T;
  setValue: (newValue: T | ((prevValue: T) => T)) => void;
  clear: () => void;
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): LocalStorageState<T> {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(storedValue));
  }, [key, storedValue]);

  const setValue = (value: T | ((prevValue: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
    } catch (error) {
      console.error(error);
    }
  };

  const clear = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(error);
    }
  };

  return { value: storedValue, setValue, clear };
}
