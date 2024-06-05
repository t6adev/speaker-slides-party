'use client';

import confetti from 'canvas-confetti';
import { atom, useSetAtom } from 'jotai';
import { useEffect, useRef } from 'react';

const getShape = (text: string) =>
  confetti.shapeFromText({
    text,
    scalar: 3,
  });

const confettiAtom = atom<{ confetti: ReturnType<typeof confetti.create> | null }>({
  confetti: null,
});

export type Prticle = { type: 'color' } | { type: 'shape'; texts: string[] };

export const runConfettiAtom = atom(
  null,
  async (get, set, origin: { x: number; y: number }, particle: Prticle) => {
    const c = get(confettiAtom);
    if (c.confetti) {
      if (particle.type === 'color') {
        c.confetti({
          particleCount: 4,
          spread: 70,
          scalar: 2,
          origin,
        });
      }
      if (particle.type === 'shape') {
        c.confetti({
          particleCount: particle.texts.length,
          shapes: particle.texts.map(getShape),
          spread: 70,
          scalar: 3,
          origin,
        });
      }
    }
  }
);

export const Confetti = () => {
  const setConfetti = useSetAtom(confettiAtom);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const fullscreenchangeListener = (e: Event) => {
      if (document.fullscreenElement) {
        const ele = document.createElement('canvas');
        ele.id = 'appendedCanvas';
        ele.style.position = 'fixed';
        ele.style.top = '0';
        ele.style.left = '0';
        ele.style.width = '100vw';
        ele.style.height = '100vh';
        ele.style.pointerEvents = 'none';
        document.fullscreenElement.appendChild(ele);
        setConfetti({ confetti: confetti.create(ele, { resize: true }) });
      } else if (canvasRef.current) {
        document.getElementById('appendedCanvas')?.remove();
        setConfetti({ confetti: confetti.create(canvasRef.current, { resize: true }) });
      }
    };
    addEventListener('fullscreenchange', fullscreenchangeListener);
    return () => {
      removeEventListener('fullscreenchange', fullscreenchangeListener);
    };
  });
  return (
    <canvas
      ref={(ref) => {
        if (!ref) return;
        canvasRef.current = ref;
        setConfetti({ confetti: confetti.create(ref, { resize: true }) });
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
      }}
    />
  );
};
