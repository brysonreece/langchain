import { TrashIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { OpenAI } from 'langchain/llms/openai';
import { nextTick } from 'process';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from 'renderer/layouts/AppLayout';
import { ChatMessage, PlaygroundState, SettingsState } from 'renderer/interfaces';


export default function Playground() {
  const historyEl = useRef<HTMLDivElement>(null);
  const [model, setModel] = useState<OpenAI | null>(null);
  const [usingDefaultState] = useState<boolean>(! window.electron.store.has('playground'));
  const [settingsState] = useState<SettingsState>(window.electron.store.get('settings') || { openaiKey: "" });
  const [state, setState] = useState<PlaygroundState>(
    usingDefaultState ? {
      history: [],
      loading: false,
      prompt: "",
      temperature: 0.5,
    } : window.electron.store.get('playground')
  );

  if (! usingDefaultState) {
    window.electron.store.set('playground', state);
  }

  if (!! settingsState.openaiKey && ! model) {
    initModel(state.temperature);
  }

  function initModel(temperature: number): OpenAI {
    let model = new OpenAI({ openAIApiKey: settingsState.openaiKey, temperature: temperature });

    setModel(model);

    return model;
  }

  function submit(): void {
    if (! model) {
      return;
    }

    setState((prev: PlaygroundState) => {
      let history = (prev!.history as Array<ChatMessage>);
      history.push({ actor: 'user', msg: prev.prompt });

      if (history.length > 100) {
        history.slice(history.length - 101, 99);
      }

      return {
        ...prev,
        loading: true,
        prompt: "",
        history: history,
      } as PlaygroundState;
    });

    window.electron.store.set('playground', state);

    nextTick(async () => {
      historyEl.current?.scrollTo({
        top: historyEl.current.scrollHeight,
        behavior: 'smooth',
      });

      const res = await model.call(state.prompt);

      setState((prev: PlaygroundState) => {
        let history = (prev.history as Array<ChatMessage>);
        history.push({ actor: 'system', msg: res });

        if (history.length > 100) {
          history.slice(history.length - 101, 99);
        }

        return {
          ...prev,
          loading: false,
          history: history,
        } as PlaygroundState;
      });

      window.electron.store.set('playground', state);

      nextTick(() => {
        historyEl.current?.scrollTo({
          top: historyEl.current.scrollHeight,
          behavior: 'smooth',
        });
      });
    });
  }

  function updateState(key: string, value: any): void {
    setState((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  }

  return (
    <AppLayout title="Playground">
      <div className="h-full flex flex-col">
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
            <div ref={historyEl} className={clsx("flex-grow flex flex-col space-y-3 rounded-lg overflow-y-auto scroll-smooth px-4", {
              'opacity-50': state.loading,
            })}>
              {state.history.map((chat: ChatMessage, idx: number) => (
                <>
                  <div key={idx} className={clsx("chat", {
                    'chat-start': chat.actor === 'system',
                    'chat-end': chat.actor === 'user',
                  })}>
                    <div className={clsx("chat-bubble max-w-xl", {
                      'bg-blue-500 text-white': chat.actor === 'user',
                    })}>
                      {chat.msg}
                    </div>
                  </div>
                </>
              ))}
            </div>
            <div className="flex items-center justify-center gap-x-4 mt-4">
              <input
                type="text"
                name="prompt"
                id="prompt"
                autoComplete="none"
                placeholder={"Enter prompt here..."}
                value={state.prompt}
                onChange={(e) => updateState('prompt', e.target.value)}
                onKeyDown={(e) => (e.key === 'Enter') && submit()}
                disabled={state.loading}
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
                value={state.temperature}
                onChange={(e) => {
                  updateState('temperature', parseFloat(e.target.value));
                  initModel(state.temperature);
                }}
                disabled={state.loading}
                className="block w-16 rounded-md border-0 py-1.5 text-gray-900 disabled:text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />

              <button
                onClick={submit}
                disabled={state.loading || ! state.prompt}
                className="h-full disabled:bg-gray-600 rounded-md bg-gray-900 px-2.5 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:bg-gray-800 active:bg-gray-800"
              >
                Submit
              </button>

              <button
                onClick={() => updateState('history', [])}
                disabled={state.loading}
                className="h-full disabled:bg-gray-600 rounded-md bg-red-600 px-2.5 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:bg-red-800 active:bg-red-800"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
