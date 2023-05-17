import { useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from 'renderer/layouts/AppLayout';

export default function Home() {
  const [settingsState] = useState(window.electron.store.get('settings') || {});

  return (
    <AppLayout title="Playground">
      {(! settingsState.openaiKey) ? (
        <div className="flex items-center justify-center gap-x-6 bg-red-600 px-6 py-4 sm:px-3.5">
          <p className="text-sm leading-6 text-white">
            <strong className="font-semibold">Warning:{' '}</strong>
            You have not registered an OpenAI API key.{' '}
            <Link to="/settings" className="underline underline-offset-8">Visit your settings to get started&nbsp;<span aria-hidden="true">&rarr;</span></Link>
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-x-6 bg-green-600 px-6 py-4 sm:px-3.5">
          <p className="text-sm leading-6 text-white">
            <strong className="font-semibold">Success:{' '}</strong>
            You have registered an OpenAI API key.{' '}
          </p>
        </div>
      )}
    </AppLayout>
  );
}
