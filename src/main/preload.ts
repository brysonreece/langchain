// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { ChatMessage } from 'renderer/interfaces';

export type Channels = 'language' | 'settings';

const ipc = {
  sendMessage(channel: Channels, args: unknown[]) {
    ipcRenderer.send(channel, args);
  },
  on(channel: Channels, func: (...args: unknown[]) => void) {
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      func(...args);
    ipcRenderer.on(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },
  once(channel: Channels, func: (...args: unknown[]) => void) {
    ipcRenderer.once(channel, (_event, ...args) => func(...args));
  },
};

const services = {
  language: {
    prompt(prompt: string) {
      return ipcRenderer.invoke('language', 'prompt', prompt);
    },
    getHistory() {
      return ipcRenderer.invoke('language', 'getHistory');
    },
    getHistoryLimit() {
      return ipcRenderer.invoke('language', 'getHistoryLimit');
    },
    clearHistory() {
      ipcRenderer.send('language', 'clearHistory');
    },
    pushHistory(msg: ChatMessage) {
      ipcRenderer.send('language', 'pushHistory', msg);
    },
    getTemperature() {
      return ipcRenderer.invoke('language', 'getTemperature');
    },
    setTemperature(temperature: number) {
      ipcRenderer.send('language', 'setTemperature', temperature);
    },
  },
  settings: {
    all() {
      return ipcRenderer.invoke('settings', 'all');
    },
    get(key: string, defaultValue?: any) {
      return ipcRenderer.invoke('settings', 'get', key) || defaultValue;
    },
    set(key: string, value: any) {
      ipcRenderer.send('settings', 'set', key, value);
    },
  },
};

contextBridge.exposeInMainWorld('ipc', ipc);
contextBridge.exposeInMainWorld('services', services);

export type ServicesContext = typeof services;
export type IpcContext = typeof ipc;
