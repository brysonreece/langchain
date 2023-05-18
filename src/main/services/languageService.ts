import { OpenAI } from 'langchain/llms/openai';
import { ChatMessage } from 'renderer/interfaces';
import Store from 'electron-store';
import { IpcMain, IpcMainEvent } from 'electron';

export default class LanguageService {
  protected openAI: OpenAI;

  protected store: Store;

  protected apiKey: string;

  protected history: ChatMessage[];

  protected historyLimit: number;

  protected temperature: number;

  constructor({
    apiKey,
    history = [],
    historyLimit = 100,
    temperature = 0.5,
  }: {
    apiKey: string;
    history?: ChatMessage[];
    historyLimit?: number;
    temperature?: number;
  }) {
    this.apiKey = apiKey;
    this.history = history.slice(0 - historyLimit);
    this.historyLimit = historyLimit;
    this.temperature = temperature;

    this.store = new Store();
    this.openAI = new OpenAI({
      openAIApiKey: this.apiKey,
      temperature,
    });
  }

  initModel({
    apiKey,
    temperature,
  }: {
    apiKey?: string;
    temperature?: number;
  }) {
    this.openAI = new OpenAI({
      openAIApiKey: apiKey || this.apiKey,
      temperature: temperature || this.temperature,
    });
  }

  async prompt(prompt: string) {
    this.pushHistory({
      actor: 'user',
      msg: prompt,
    } as ChatMessage);

    const response = await this.openAI.call(prompt);

    this.pushHistory({
      actor: 'system',
      msg: response,
    } as ChatMessage);

    return response;
  }

  getTemperature() {
    return this.temperature;
  }

  setTemperature(temperature: number) {
    this.openAI = new OpenAI({
      openAIApiKey: this.apiKey,
      temperature,
    });

    this.store.set('temperature', this.temperature);
  }

  getHistory() {
    return this.history;
  }

  pushHistory(msg: ChatMessage) {
    this.history.push(msg);
    this.setHistory(this.history.slice(0 - this.historyLimit));
  }

  clearHistory() {
    this.setHistory([]);
  }

  setHistory(history: ChatMessage[]) {
    this.history = history;
    this.store.set('history', this.history);
  }

  registerIpcListeners(ipcMain: IpcMain) {
    ipcMain.on('language', async (event, action, ...args) => {
      type methodName = keyof LanguageService;
      const callableFunc = this[action as methodName];

      event.reply(
        'language',
        // eslint-disable-next-line prefer-spread
        callableFunc.apply(
          this as LanguageService,
          [...args] as Parameters<typeof callableFunc>
        )
      );
    });

    ipcMain.on('lang.history.get', async (event) => {
      event.reply('llm-history', this.history);
    });

    ipcMain.on('lang.history.limit', async (event) => {
      event.reply('llm-history', this.history);
    });

    ipcMain.on('lang.history.push', async (event, val) => {
      this.pushHistory(val);
    });

    ipcMain.on('lang.history.clear', async () => {
      this.clearHistory();
    });

    ipcMain.on('lang.temperature.get', async (event) => {
      event.reply('lang.temperature.get', this.getTemperature());
    });

    ipcMain.on('lang.temperature.set', async (event, val) => {
      this.setTemperature(val);
    });
  }
}
