'use client';

import { useState, Fragment } from 'react';
import { Button } from '@/components/ui/button';
import { SquareUserRound } from 'lucide-react';
import { SpeakerDrawer } from '../speakerDrawer';

export const Speaker = ({
  name,
  description,
  imageUrl,
  links,
}: {
  name: string;
  description: string;
  imageUrl: string;
  links: string[];
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Fragment>
      <Button variant="outline" size="icon" className="rounded-full" onClick={() => setOpen(true)}>
        <SquareUserRound size={20} />
      </Button>
      <SpeakerDrawer
        open={open}
        onOpenChange={setOpen}
        {...{ name, description, imageUrl, links }}
      />
    </Fragment>
  );
};
