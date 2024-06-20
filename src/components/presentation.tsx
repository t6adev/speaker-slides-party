'use client';

import { useState, useEffect, useRef, useCallback, MouseEventHandler, CSSProperties } from 'react';
import { Document, Page } from 'react-pdf';
import { useAtom, useAtomValue } from 'jotai';
import { CirclePlay, CirclePause } from 'lucide-react';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { speakerHashAtom } from '../atoms';
import { speakerModeAtom } from './setting';
import { FullscreenButton } from './fullscreenButton';
import { pdfs } from '../../pdfs/loader';
import { options } from '../pdfOptions';
import { useShortcut } from './useShortcut';

const useCountdownTimer = (defaultSec: number, stop: boolean) => {
  const [sec, setSec] = useState(defaultSec);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const manageRef = useRef({ stop, sec: defaultSec });

  useEffect(() => {
    const countdown = (next: number) => {
      if (next > 0) {
        timeoutRef.current = setTimeout(() => {
          if (manageRef.current.stop) {
            countdown(next); // keep looping
            return;
          } else {
            setSec(next - 1);
            countdown(next - 1);
          }
        }, 1000);
      }
    };
    countdown(manageRef.current.sec);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (stop) {
    manageRef.current = { stop: true, sec };
  } else {
    manageRef.current = { stop: false, sec };
  }

  return { timeStr: format(sec * 1000, 'mm:ss'), timeSec: sec };
};

const CountdownTimer = ({ trigger }: { trigger: { th: number; cb: () => void } }) => {
  const [stop, setStop] = useState(true);
  const { timeStr, timeSec } = useCountdownTimer(60 * 3, stop);
  const speakerMode = useAtomValue(speakerModeAtom);

  useShortcut(
    ['Space'],
    useCallback(() => {
      if (speakerMode) {
        setStop((s) => !s);
      }
    }, [stop, speakerMode])
  );

  if (trigger) {
    if (timeSec === trigger.th) {
      trigger.cb();
    }
  }

  return (
    <Button
      variant="outline"
      onClick={() => setStop((s) => !s)}
      className="relative group"
      disabled={timeSec === 0}
    >
      <span
        className={cn(
          'text-xl font-bold tabular-nums',
          'text-gray-700 group-hover:text-gray-700/10',
          stop && 'text-gray-500/10',
          timeSec === 0 && 'text-rose-700/60'
        )}
      >
        {timeStr}
      </span>
      <span className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
        {timeSec !== 0 &&
          (stop ? (
            <CirclePlay className="text-teal-600" />
          ) : (
            <CirclePause className="hidden group-hover:block text-gray-500" />
          ))}
      </span>
    </Button>
  );
};

export const Presentation = () => {
  const defaultWidth = 900;
  const [pageIndex, setPageIndex] = useState(1);
  const [numPages, setNumPages] = useState(1);
  const [speakerIndex, setSpeakerIndex] = useAtom(speakerHashAtom);
  const [presentationRef, setPresentationRef] = useState<HTMLDivElement | null>(null);
  const [pageRef, setPageRef] = useState<HTMLCanvasElement | null>(null);
  const [fullscreen, setFullscreen] = useState<{
    width: number;
  } | null>(null);
  const [magnifierMode, setMagnifierMode] = useState(false);
  const [magnifierStyle, setMagnifierStyle] = useState<CSSProperties | null>(null);
  const [fullscreenCanvasDataURL, setFullscreenCanvasDataURL] = useState<string | null>(null);
  const [showNextSpeaker, setShowNextSpeaker] = useState(false);

  useEffect(() => {
    if (!presentationRef) return;
    const l = () => {
      if (!document.fullscreenElement) {
        setFullscreen(null);
      }
    };
    presentationRef.addEventListener('fullscreenchange', l);
    return () => presentationRef.removeEventListener('fullscreenchange', l);
  }, [presentationRef]);

  useShortcut(
    ['CTRL-META', 'SHIFT', 'ArrowRight'],
    useCallback(() => {
      if (speakerIndex < pdfs.length - 1) {
        setSpeakerIndex((i) => i + 1);
        setShowNextSpeaker(false);
        setPageIndex(1);
      }
    }, [speakerIndex])
  );
  useShortcut(
    ['CTRL-META', 'SHIFT', 'ArrowLeft'],
    useCallback(() => {
      if (speakerIndex > 0) {
        setSpeakerIndex((i) => i - 1);
        setShowNextSpeaker(false);
        setPageIndex(1);
      }
    }, [speakerIndex])
  );
  useShortcut(
    ['ArrowRight'],
    useCallback(() => {
      if (pageIndex < numPages) {
        setPageIndex((i) => i + 1);
      }
    }, [pageIndex, numPages])
  );
  useShortcut(
    ['ArrowLeft'],
    useCallback(() => {
      if (pageIndex > 1) {
        setPageIndex((i) => i - 1);
      }
    }, [pageIndex, numPages])
  );
  useShortcut(
    ['KeyM'],
    useCallback(async () => {
      const nextMagnifierMode = !magnifierMode;
      setMagnifierMode(nextMagnifierMode);
      if (nextMagnifierMode && pageRef && document.fullscreenElement) {
        setFullscreenCanvasDataURL((await html2canvas(pageRef)).toDataURL());
      }
      if (!nextMagnifierMode) {
        setFullscreenCanvasDataURL(null);
        setMagnifierStyle(null);
      }
    }, [magnifierMode, pageRef])
  );

  const handleMouseMove: MouseEventHandler<HTMLDivElement> = useCallback(
    async (e) => {
      if (pageRef && document.fullscreenElement && magnifierMode && fullscreenCanvasDataURL) {
        const rect = pageRef.getBoundingClientRect();
        const x = e.clientX + document.fullscreenElement.scrollLeft;
        const y = e.clientY + document.fullscreenElement.scrollTop;

        setMagnifierStyle({
          backgroundImage: `url(${fullscreenCanvasDataURL})`,
          backgroundPosition: `-${x * 2 - 300}px -${y * 2 - 300}px`,
          backgroundSize: `${rect.width * 2}px ${rect.height * 2}px`,
          backgroundRepeat: 'no-repeat',
          top: `${y - 300}px`,
        });
      }
    },
    [pageRef, magnifierMode, fullscreenCanvasDataURL]
  );

  const { file, info } = pdfs[speakerIndex] || {};
  const { info: nextInfo } = pdfs[speakerIndex + 1] || {};
  if (!info || !file) return null;
  const { title, speaker, appendixLinks } = info;

  return (
    <div className="flex-1 flex flex-col">
      <h1 className="text-2xl font-bold tracking-tight mt-8">{title}</h1>
      <h2 className="text-lg tracking-tight mt-2 text-gray-700">By {speaker.name}</h2>
      <div className="mt-8 flex-1 flex">
        <div
          ref={(ref) => setPresentationRef(ref)}
          className="relative flex overflow-auto"
          onMouseMove={handleMouseMove}
        >
          <Document
            file={file}
            options={options}
            onLoadError={() => {
              console.error('Error loading document. Refresh the page.');
            }}
            onLoadSuccess={({ numPages: n }) => {
              setNumPages(n);
            }}
          >
            <Page
              pageNumber={pageIndex}
              width={fullscreen ? fullscreen.width : defaultWidth}
              canvasRef={(ref) => setPageRef(ref)}
            />
          </Document>
          <div className={cn(fullscreen ? 'fixed' : 'absolute', 'bottom-2 left-2 z-10')}>
            <CountdownTimer
              key={speakerIndex}
              trigger={{ th: 60 * 2, cb: () => setShowNextSpeaker(true) }}
            />
          </div>
          {showNextSpeaker && nextInfo && (
            <div className={cn(fullscreen ? 'fixed' : 'absolute', 'bottom-2 right-2 z-10')}>
              <div className="bg-gray-50/60 px-4 py-2">
                <p className="text-sm italic">
                  Next: {nextInfo?.title} by {nextInfo?.speaker.name}
                </p>
              </div>
            </div>
          )}
          {magnifierMode && magnifierStyle && document.fullscreenElement && (
            <div
              style={{
                position: 'absolute',
                width: '100vw',
                height: '600px',
                border: '2px solid #000',
                pointerEvents: 'none',
                ...magnifierStyle,
              }}
            />
          )}
        </div>
      </div>
      <div className="flex justify-end">
        <FullscreenButton
          onClick={async () => {
            await presentationRef?.requestFullscreen();
            setFullscreen({
              width: window.screen.width || 900,
            });
          }}
        />
      </div>
      <div className="mt-4">
        <ul>
          {appendixLinks.map((link) => (
            <li key={link} className="mt-2">
              <a
                href={link}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-800 hover:underline"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-center space-x-2 mt-4 items-center">
        <Button
          variant="ghost"
          onClick={() => {
            setSpeakerIndex((c) => c - 1);
            setShowNextSpeaker(false);
          }}
          disabled={speakerIndex === 0}
        >
          {`<`}
        </Button>
        <p>
          {speakerIndex + 1} of {pdfs.length}
        </p>
        <Button
          variant="ghost"
          onClick={() => {
            setSpeakerIndex((c) => c + 1);
            setShowNextSpeaker(false);
          }}
          disabled={speakerIndex === pdfs.length - 1}
        >
          {`>`}
        </Button>
      </div>
    </div>
  );
};
