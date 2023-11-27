import { useEffect } from 'react';

const useKeyEvent = (key: string, callback: () => void) => {
  useEffect(() => {
    const handleKeyEvent = (event: KeyboardEvent) => {
      if (event.code === key) {
        event.preventDefault();
        callback();
      }
    };

    document.addEventListener('keydown', handleKeyEvent);

    return () => {
      document.removeEventListener('keydown', handleKeyEvent);
    };
  }, [key, callback]);
};

export default useKeyEvent;
