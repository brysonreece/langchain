import { Link } from 'react-router-dom';
import AgentsList from 'renderer/components/AgentsList';
import AppLayout from 'renderer/layouts/AppLayout';

export default function Home() {
  return (
    <AppLayout title="Home">
      <AgentsList agents={[
        {
          id: 1,
          name: 'Agent 1',
          imageUrl: 'https://tailwindui.com/img/logos/48x48/savvycal.svg',
        },
        {
          id: 2,
          name: 'Agent 2',
          imageUrl: 'https://tailwindui.com/img/logos/48x48/savvycal.svg',
        },
        {
          id: 3,
          name: 'Agent 3',
          imageUrl: 'https://tailwindui.com/img/logos/48x48/savvycal.svg',
        },
      ]} />
    </AppLayout>
  );
}
