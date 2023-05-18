import { IpcContext, ServicesContext } from 'main/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    ipc: IpcContext;
    services: ServicesContext;
  }
}

export {};
