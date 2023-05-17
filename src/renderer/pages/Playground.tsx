import { useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from 'renderer/layouts/AppLayout';
import { OpenAI } from 'langchain/llms/openai';
import { nextTick } from 'process';

function createModel(apiKey: string, temperature: number): OpenAI {
  return new OpenAI({ openAIApiKey: apiKey, temperature: temperature });
}

export default function Playground() {
  const [settingsState] = useState(window.electron.store.get('settings') || {});
  const [temperature, setTemperature] = useState(0.9);
  const [model, setModel] = useState((!! settingsState.openaiKey) ? createModel(settingsState.openaiKey, temperature) : null);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (! model) {
      return;
    }

    const res = await model.call(prompt);

    setLoading(false);
    setResponse(res);
  }

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
        <>
          <div className="flex items-center justify-center gap-x-6">
            <input
              type="text"
              name="prompt"
              id="prompt"
              autoComplete="none"
              placeholder={"Enter prompt here..."}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value )}
              disabled={loading}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 disabled:text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />

            <input
              type="number"
              step={0.1}
              min={0.1}
              max={1.0}
              name="temperature"
              id="temperature"
              autoComplete="none"
              placeholder={"0.0"}
              value={temperature}
              onChange={(e) => {
                setTemperature(parseFloat(e.target.value));
                setLoading(true);

                //nextTick(() => {
                  setModel(createModel(settingsState.openaiKey, temperature));
                  setLoading(false);
                //});
              }}
              disabled={loading}
              className="block w-16 rounded-md border-0 py-1.5 text-gray-900 disabled:text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />

          <button
            onClick={() => {
              setLoading(true);
              setResponse("");
              submit();
            }}
            disabled={loading}
            className="disabled:bg-gray-600 rounded-md bg-gray-900 px-2.5 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:bg-gray-800 active:bg-gray-800"
          >
            Submit
          </button>
          </div>

          { response && (
            <div className="rounded-lg text-sm italic mt-6 px-4 py-3 bg-gray-200">
              <p>{response}</p>
            </div>
          )}
        </>
      )}
    </AppLayout>
  );
}
