import { useState } from 'react';
import AppLayout from 'renderer/layouts/AppLayout';

export default function Settings() {
  const [settingsState, setSettingsState] = useState({
    openaiKey: (window.electron.store.get('settings') || {}).openaiKey || '',
  });

  function saveCredentials(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    window.electron.store.set('settings', settingsState);
  }

  return (
    <AppLayout title="Settings">
      <form onSubmit={saveCredentials} className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Credentials
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            This information will be used to connect to third-party services on your behalf.
          </p>

          <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
            <div className="pt-6 sm:flex sm:items-center">
              <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                OpenAI API Key
              </dt>
              <dd className="flex justify-between gap-x-6 mt-2 sm:mt-0 sm:flex-auto">
                <input
                  type="text"
                  name="openai-key"
                  id="openai-key"
                  autoComplete="none"
                  placeholder={"sk-..."}
                  value={settingsState.openaiKey}
                  onChange={(e) => setSettingsState({ ...settingsState, openaiKey: e.target.value })}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </dd>
            </div>
          </dl>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="mt-6 rounded-md bg-gray-900 px-2.5 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:bg-gray-800 active:bg-gray-800"
          >
            Save Changes
          </button>
        </div>
      </form>
    </AppLayout>
  );
}
