import { useAtom } from 'jotai';
import { atomWithHash } from 'jotai-location';

export const hashName = 'speaker'

export const speakerHashAtom = atomWithHash(hashName, 0);
