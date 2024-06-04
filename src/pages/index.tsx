import { Link } from 'waku';

import { buttonVariants } from '@/components/ui/button';
import { Presentation } from 'lucide-react';

import { title } from '../presentationConfig';
import { PresentationListItem as Item } from '../components/home/presentationListItem';
import { pdfs } from '../../pdfs/loader';

export default async function HomePage() {
  return (
    <div className="max-w-6xl m-6 md:m-auto flex flex-col flex-1">
      <title>{title}</title>
      <h1 className="text-4xl font-bold tracking-tight mt-8">{title}</h1>
      <div className="mt-8">
        <p>Total {pdfs.length} presentations 🎙️ Thank you speakers!!</p>
      </div>
      <div className="flex justify-center mt-8">
        <Link
          to="/presentations"
          className={buttonVariants({
            variant: 'outline',
          })}
        >
          <div className="px-8 flex items-center">
            <div className="text-lg">Start</div>
            <Presentation size={16} className="ml-2" />
          </div>
        </Link>
      </div>
      <div className="flex flex-col space-y-4 mt-8">
        {pdfs.map(({ info }, index) => (
          <Item
            title={info.title}
            index={index}
            key={`${info.title}${info.speaker.name}`}
            {...{
              name: info.speaker.name,
              description: info.speaker.description,
              imageUrl: info.speaker.imageUrl,
              links: info.speaker.links,
            }}
          />
        ))}
      </div>
      <div className="mt-8 flex justify-end">
        <Link to="/all" className="underline">
          View all
        </Link>
      </div>
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: 'static',
  };
};
