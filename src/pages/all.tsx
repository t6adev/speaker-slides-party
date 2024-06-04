import { Link } from 'waku';

import { List } from '../components/list';

export default async function AllPage() {
  return (
    <div className="m-6 flex flex-col flex-1">
      <div className="mt-8">
        <Link to="/">{`<`} Home</Link>
      </div>
      <List />
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: 'static',
  };
};
