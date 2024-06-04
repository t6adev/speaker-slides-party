'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { Document, Page } from 'react-pdf';
import { Link } from 'waku';

import { hashName } from '../atoms';

import { pdfs } from '../../pdfs/loader';
import { options } from '../pdfOptions';
import { FullscreenButton } from './fullscreenButton';

const Rectangles = ({
  count,
  width,
  height,
  renderContents,
  gap = 10,
}: {
  count: number;
  width: number;
  height: number;
  renderContents: ({ width, height }: { width: number; height: number }) => ReactNode;
  gap?: number;
}) => {
  let columns = Math.ceil(width / Math.sqrt((width * height) / count));
  let rows = Math.ceil(count / columns);

  while (columns * rows < count) {
    columns++;
    rows = Math.ceil(count / columns);
  }

  const rectWidth = (width - gap * (columns - 1)) / columns;
  const rectHeight = (height - gap * (rows - 1)) / rows;

  const contents = renderContents({ width: rectWidth, height: rectHeight });

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gap,
        boxSizing: 'border-box',
      }}
    >
      {contents}
    </div>
  );
};

const RectangleGrid = ({
  count,
  renderContents,
}: {
  count: number;
  renderContents: ({ width, height }: { width: number; height: number }) => ReactNode;
}) => {
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [allViewRef, setAllViewRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef) return;
    const handleResize = () => {
      const rect = containerRef.getBoundingClientRect();
      setContainerWidth(rect.width);
      setContainerHeight(rect.height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [containerRef]);

  return (
    <div
      className="flex-1 flex flex-col"
      ref={(ref) => {
        setContainerRef(ref);
      }}
    >
      <div className="flex-1 flex" ref={(ref) => setAllViewRef(ref)}>
        <Rectangles
          count={count}
          renderContents={renderContents}
          width={containerWidth}
          height={containerHeight}
          gap={10}
        />
      </div>
      <div className="flex justify-end">
        <FullscreenButton
          onClick={async () => {
            await allViewRef?.requestFullscreen();
            setContainerWidth(window.screen.width);
            setContainerHeight(window.screen.height);
          }}
        />
      </div>
    </div>
  );
};

const Pdfs = ({ width }: { width: number }) => (
  <>
    {pdfs.map(({ file }, index) => (
      <div style={{ width }} className="flex items-center">
        <Link to={`/presentations#${hashName}=${index}`}>
          <Document
            file={file}
            options={options}
            onLoadError={() => {
              console.error('Error loading document. Refresh the page.');
            }}
          >
            <Page pageNumber={1} width={width} />
          </Document>
        </Link>
      </div>
    ))}
  </>
);

export const List = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <RectangleGrid count={pdfs.length} renderContents={({ width }) => <Pdfs width={width} />} />
  );
};
