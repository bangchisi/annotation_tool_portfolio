import { useCallback } from 'react';

type UseLoclStorage = () => {
  getStorageItem: <T>(key: string) => T | undefined;
  setStorageItem: (key: string, item: any) => void;
};

const useLocalStorage: UseLoclStorage = () => {
  const getStorageItem = useCallback(<T,>(key: string) => {
    if (typeof window === 'undefined') {
      throw new Error('window is undefined');
    }

    const item = window.localStorage.getItem(key);
    if (!item) {
      return undefined;
    }

    try {
      const parsedItem = JSON.parse(item) as T;
      return parsedItem;
    } catch (error) {
      console.error('Error parsing localStorage item: ', error);
    }
  }, []);

  const setStorageItem = useCallback((key: string, item: any) => {
    if (typeof window === 'undefined') {
      throw new Error('window is undefined');
    }

    window.localStorage.setItem(key, JSON.stringify(item));
  }, []);

  return {
    getStorageItem,
    setStorageItem,
  };
};

export default useLocalStorage;
