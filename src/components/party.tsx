'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import usePartySocket from 'partysocket/react';
import { useAtomValue, useSetAtom } from 'jotai';

import { speakerHashAtom } from '../atoms';
import { Prticle, runConfettiAtom } from './confetti';
import {
  speakerModeAtom,
  partyModeAtom,
  confettiTriggerTypeAtom,
  confettiTypeAtom,
  confettiColorAtom,
} from './setting';
import { useMouseMove } from './useMouseMove';
import { useDebouncer } from './useDebouncer';
import { useShortcut } from './useShortcut';

export const Party = ({ children }: { children: React.ReactNode }) => {
  const speakerIndex = useAtomValue(speakerHashAtom);
  const runConfetti = useSetAtom(runConfettiAtom);
  const speakerMode = useAtomValue(speakerModeAtom);
  const partyMode = useAtomValue(partyModeAtom);
  const confettiType = useAtomValue(confettiTypeAtom);
  const confettiTriggerType = useAtomValue(confettiTriggerTypeAtom);
  const [spaceKeyDown, setSpaceKeyDown] = useState(false);
  const currentPointerRef = useRef({ x: 0, y: 0 });
  const debouncer = useDebouncer();
  const myColor = useAtomValue(confettiColorAtom);
  const colors = [myColor];
  const particle =
    confettiType === 'Any Color'
      ? { type: 'color' as const, colors }
      : { type: 'shape' as const, texts: [confettiType] };
  const socket = usePartySocket({
    room: `speaker${speakerIndex}`,
    onMessage: useCallback(
      (event) => {
        const { x, y, particle } = JSON.parse(event.data) as {
          x: number;
          y: number;
          particle: Prticle;
        };
        if (partyMode) {
          runConfetti({ x, y }, particle);
        }
      },
      [partyMode]
    ),
  });
  useShortcut(
    ['KeyC'],
    useCallback(() => {
      if (confettiTriggerType === 'KeyC') {
        setSpaceKeyDown(true);
        runConfetti(currentPointerRef.current, particle);
      }
    }, [particle, runConfetti, confettiTriggerType])
  );
  useEffect(() => {
    const onKeyUp = () => {
      if (confettiTriggerType === 'KeyC') {
        setSpaceKeyDown(false);
      }
    };
    document.addEventListener('keyup', onKeyUp);
    return () => {
      document.removeEventListener('keyup', onKeyUp);
    };
  }, [particle, runConfetti, confettiTriggerType]);
  useMouseMove(
    useCallback(
      (x, y) => {
        if (
          !speakerMode &&
          partyMode &&
          (confettiTriggerType === 'AUTO' || (confettiTriggerType === 'KeyC' && spaceKeyDown))
        ) {
          debouncer(() => {
            socket.send(JSON.stringify({ x, y, particle }));
            runConfetti({ x, y }, particle);
          });
        }
        currentPointerRef.current = { x, y };
      },
      [partyMode, particle, spaceKeyDown, confettiTriggerType, speakerMode, socket, runConfetti]
    )
  );
  return <>{children}</>;
};
