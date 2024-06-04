import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

export const SpeakerDrawer = ({
  name,
  description,
  imageUrl,
  links,
  open,
  onOpenChange,
}: {
  name: string;
  description: string;
  imageUrl: string;
  links: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => (
  <Drawer open={open} onOpenChange={onOpenChange}>
    <DrawerContent>
      <div className="mx-auto w-full max-w-lg py-4">
        <div className="flex space-x-2 flex-col md:flex-row justify-center items-center">
          {imageUrl && <img src={imageUrl} alt={name} className="rounded-full w-28 h-28" />}
          <DrawerHeader>
            <DrawerTitle>{name}</DrawerTitle>
            {description && <DrawerDescription>{description}</DrawerDescription>}
          </DrawerHeader>
        </div>
        <ul className="mt-4 ml-8 md:ml-0">
          {links.map((link) => (
            <li key={link} className="mt-2">
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-800 hover:underline"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </DrawerContent>
  </Drawer>
);
