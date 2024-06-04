import { useEffect } from 'react';

export const useShortcut = (keys: (string | 'SHIFT' | 'CTRL-META')[], cb: () => void) => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        keys.every(
          (k) =>
            (k === 'SHIFT' && e.shiftKey) ||
            (k === 'CTRL-META' && (e.metaKey || e.ctrlKey)) ||
            e.code === k
        )
      ) {
        cb();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [keys, cb]);
};
