import { Button } from '@/components/ui/button';
import { Expand } from 'lucide-react';

export const FullscreenButton = ({ onClick }: { onClick: () => Promise<void> }) => (
  <Button variant="outline" className="mt-4" onClick={onClick}>
    <div className="px-4 flex items-center">
      <div className="text-lg">Full Screen</div>
      <Expand size={16} className="ml-2" />
    </div>
  </Button>
);
