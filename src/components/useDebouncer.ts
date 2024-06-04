import { useRef } from 'react';

export const useDebouncer = (defaultDelay = 10) => {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debounced = (cb: () => void, delay = defaultDelay) => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      cb();
    }, delay);
  };
  return debounced;
};
