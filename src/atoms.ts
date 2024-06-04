import { createStore } from 'jotai';
import { atomWithHash } from 'jotai-location';

export const store = createStore();

export const hashName = 'speaker';

export const speakerHashAtom = atomWithHash(hashName, 0);
