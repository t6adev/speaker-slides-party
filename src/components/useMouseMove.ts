import { useEffect } from 'react';

export const useMouseMove = (onMouseMoved: (x: number, y: number) => void) => {
  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = (e.clientY + 20) / window.innerHeight;
      onMouseMoved(x, y);
    };
    document.addEventListener('mousemove', mouseMove);
    return () => {
      document.removeEventListener('mousemove', mouseMove);
    };
  }, [onMouseMoved]);
};
