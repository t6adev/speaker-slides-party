import { Link } from 'waku';

import { Presentation } from '../components/presentation';
import { Party } from '../components/party';
import { SettingsInHeader } from '../components/setting';

export default async function PresentationsPage() {
  return (
    <Party>
      <div className="max-w-6xl m-6 md:m-auto flex flex-col flex-1">
        <div className="flex mt-8 justify-between items-center">
          <Link to="/">{`<`} Home</Link>
          <SettingsInHeader />
        </div>
        <Presentation />
      </div>
    </Party>
  );
}

export const getConfig = async () => {
  return {
    render: 'static',
  };
};
