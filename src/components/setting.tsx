'use client';

import { useState } from 'react';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerPortal,
  DrawerOverlay,
  DrawerPrimitiveContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useShortcut } from './useShortcut';

import { confettiEmojis } from '../presentationConfig';

export const speakerModeAtom = atom(false);

const SpeakerMode = () => {
  const [speakerMode, setSpeakerMode] = useAtom(speakerModeAtom);
  return (
    <div className="mt-2">
      <h2 className="text-lg text-gray-700">Speaker Mode 🎙️</h2>
      <div className="ml-1 mt-2">
        <div className="flex items-center space-x-2">
          <Label htmlFor="speaker-mode">
            <span className={speakerMode ? 'text-gray-400' : 'text-red-400'}>Off</span>
          </Label>
          <Switch
            id="speaker-mode"
            checked={speakerMode}
            onCheckedChange={setSpeakerMode}
            className={speakerMode ? '!bg-teal-600' : '!bg-gray-400'}
          />
          <Label htmlFor="speaker-mode">
            <span className={speakerMode ? 'text-teal-600' : 'text-gray-400'}>On</span>
          </Label>
        </div>
      </div>
    </div>
  );
};

export const partyModeAtom = atom(true);
export const confettiTriggerTypeAtom = atom<'AUTO' | 'KeyC'>('AUTO');
const confettiTypes = ['🎉', ...confettiEmojis] as const;
export const confettiTypeAtom = atom<(typeof confettiTypes)[number]>(confettiTypes[0]);

const usePartyModeShortcut = () => {
  const setPartyMode = useSetAtom(partyModeAtom);
  useShortcut(['CTRL-META', 'SHIFT', 'KeyP'], () => setPartyMode((s) => !s));
};

const PartyMode = () => {
  const [partyMode, setPartyMode] = useAtom(partyModeAtom);
  const [confettiType, setConfettiType] = useAtom(confettiTypeAtom);
  const [confettiTriggerType, setConfettiTriggerType] = useAtom(confettiTriggerTypeAtom);
  usePartyModeShortcut();
  return (
    <div className="mt-6">
      <h2 className="text-lg text-gray-700">Party Mode 🎈</h2>
      <div className="ml-1">
        <div className="flex items-center space-x-2 mt-2">
          <Label htmlFor="party-mode">
            <span className={partyMode ? 'text-gray-400' : 'text-red-400'}>Off</span>
          </Label>
          <Switch
            id="party-mode"
            checked={partyMode}
            onCheckedChange={setPartyMode}
            className={partyMode ? '!bg-teal-600' : '!bg-gray-400'}
          />
          <Label htmlFor="party-mode">
            <span className={partyMode ? 'text-teal-600' : 'text-gray-400'}>On</span>
          </Label>
        </div>
        <p className="text-gray-400 text-xs m-2">Cmd(Ctrl) + Shift + P</p>
        <div className="mt-2">
          <label className="text-sm text-gray-600">Confetti Type</label>
          <div className="mt-2">
            <Select
              defaultValue={confettiType}
              onValueChange={(v) => setConfettiType(v as typeof confettiType)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a confetti type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Confetti Types</SelectLabel>
                  {confettiTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-2">
          <label className="text-sm text-gray-600">Confetti Trigger Type</label>
          <RadioGroup
            className="mt-2"
            defaultValue={confettiTriggerType}
            onValueChange={(v) => setConfettiTriggerType(v as typeof confettiTriggerType)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="AUTO" id="r1" />
              <Label htmlFor="r1">Auto</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="KeyC" id="r2" />
              <Label htmlFor="r2">Press "c" Key</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

const PartyModeToggle = () => {
  const [partyMode, setPartyMode] = useAtom(partyModeAtom);
  usePartyModeShortcut();
  return (
    <div className="relative mt-2 w-11">
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Switch
              id="party-mode"
              checked={partyMode}
              onCheckedChange={setPartyMode}
              className="!bg-gray-200/30 shadow-inner"
            />
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm text-gray-400">Party Mode</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {partyMode ? (
        <Label htmlFor="party-mode" className="absolute top-[7px] left-[7px]">
          <span>🎈</span>
        </Label>
      ) : (
        <Label htmlFor="party-mode" className="absolute top-[7px] right-[5px]">
          <span>🤫</span>
        </Label>
      )}
    </div>
  );
};

const ConfettiTypeSelect = () => {
  const [confettiType, setConfettiType] = useAtom(confettiTypeAtom);
  const partyMode = useAtomValue(partyModeAtom);
  useShortcut(['Digit1'], () => {
    setConfettiType('🎉');
  });
  useShortcut(['Digit2'], () => setConfettiType(confettiEmojis[0] as string));
  useShortcut(['Digit3'], () => setConfettiType(confettiEmojis[1] as string));
  useShortcut(['Digit4'], () => setConfettiType(confettiEmojis[2] as string));
  useShortcut(['Digit5'], () => setConfettiType(confettiEmojis[3] as string));
  useShortcut(['Digit6'], () => setConfettiType(confettiEmojis[4] as string));
  useShortcut(['Digit7'], () => setConfettiType(confettiEmojis[5] as string));
  useShortcut(['Digit8'], () => setConfettiType(confettiEmojis[6] as string));
  useShortcut(['Digit9'], () => setConfettiType(confettiEmojis[7] as string));
  useShortcut(['Digit0'], () => setConfettiType(confettiEmojis[8] as string));
  if (!partyMode) return null;
  return (
    <div className="flex items-center space-x-1">
      {confettiTypes.map((type, index) => (
        <TooltipProvider key={type} delayDuration={100}>
          <Tooltip>
            <TooltipTrigger
              onClick={() => setConfettiType(type)}
              className={cn(
                'rounded-full',
                confettiType === type ? 'text-lg w-10 h-10 bg-gray-300/50' : 'text-sm w-5 h-5'
              )}
            >
              <span>{type}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm text-gray-400">
                {type} [ Key {index === confettiTypes.length - 1 ? 0 : index + 1} ]
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};

const Setting = () => {
  const [open, setOpen] = useState(false);
  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm">
          Setting
        </Button>
      </DrawerTrigger>
      <DrawerPortal>
        <DrawerOverlay className="z-20" />
        <DrawerPrimitiveContent className="bg-white flex flex-col rounded-t-[10px] h-full w-[400px] mt-24 fixed bottom-0 right-0 z-50">
          <div className="p-4 bg-white flex-1 h-full">
            <div className="max-w-md mx-auto">
              <DrawerHeader className="text-left">
                <DrawerTitle>Setting</DrawerTitle>
              </DrawerHeader>
              <div className="p-4">
                <SpeakerMode />
                <PartyMode />
              </div>
            </div>
          </div>
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerPrimitiveContent>
      </DrawerPortal>
    </Drawer>
  );
};

export const SettingsInHeader = () => (
  <div className="flex items-center space-x-2">
    <PartyModeToggle />
    <ConfettiTypeSelect />
    <Setting />
  </div>
);
