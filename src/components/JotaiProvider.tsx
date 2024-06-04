'use client';

import type { ReactNode } from 'react';
import { Provider } from 'jotai';

import { store } from '../atoms';

export const JotaiProvider = ({ children }: { children: ReactNode }) => (
  <Provider store={store}>{children}</Provider>
);
