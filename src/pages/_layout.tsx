import '../styles.css';

import type { ReactNode } from 'react';

import { PdfWrapper } from '../components/pdfwrapper';
import { Confetti } from '../components/confetti';

type RootLayoutProps = { children: ReactNode };

export default async function RootLayout({ children }: RootLayoutProps) {
  const data = await getData();

  return (
    <>
      <div className="min-h-screen">
        <meta property="description" content={data.description} />
        <link rel="icon" type="image/png" href={data.icon} />
        <main className="min-h-screen flex flex-col">
          <PdfWrapper>{children}</PdfWrapper>
        </main>
      </div>
      <Confetti />
    </>
  );
}

const getData = async () => {
  const data = {
    description: 'An internet website!',
    icon: '/images/favicon.png',
  };

  return data;
};

export const getConfig = async () => {
  return {
    render: 'static',
  };
};
