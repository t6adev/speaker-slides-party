import { Link } from 'waku';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { Presentation } from 'lucide-react';

import { hashName } from '../../atoms';
import { Speaker } from './speaker';

export const PresentationListItem = ({
  title,
  name,
  index,
  description,
  imageUrl,
  links,
}: {
  title: string;
  name: string;
  index: number;
  description: string;
  imageUrl: string;
  links: string[];
}) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex">
        <div className="flex-1">
          <CardTitle>{title}</CardTitle>
          <CardDescription className="mt-4">{name}</CardDescription>
        </div>
        <div className="pl-8 flex space-x-2 items-center">
          <Link
            to={`/presentations#${hashName}=${index}`}
            className={buttonVariants({
              variant: 'outline',
              size: 'icon',
              className: 'rounded-full',
            })}
          >
            <Presentation size={20} />
          </Link>
          <Speaker {...{ name, description, imageUrl, links }} />
        </div>
      </div>
    </CardContent>
  </Card>
);
