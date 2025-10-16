"use client";

interface UseStorage {
  setItem(key: string, value: unknown): boolean;
  getItem<T>(key: string): T | null;
  removeItem(key: string): boolean;
  clearStorage(): boolean;
}

const isBrowser = typeof window !== "undefined";

const useStorage: UseStorage = {
  setItem(key: string, value: unknown): boolean {
    if (!isBrowser) return false;
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);

      return true;
    } catch (error) {
      return false;
    }
  },

  getItem<T>(key: string): T | null {
    if (!isBrowser) return null;
    try {
      const serializedValue = localStorage.getItem(key);
      if (serializedValue === null) return null;

      return JSON.parse(serializedValue) as T;
    } catch (error) {
      return null;
    }
  },

  removeItem(key: string): boolean {
    if (!isBrowser) return false;
    try {
      localStorage.removeItem(key);

      return true;
    } catch (error) {
      return false;
    }
  },

  clearStorage(): boolean {
    if (!isBrowser) return false;
    try {
      localStorage.clear();

      return true;
    } catch (error) {
      return false;
    }
  },
};

export default useStorage;
