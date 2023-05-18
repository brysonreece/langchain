export interface Agent {
  id: number;
  name: string;
  imageUrl: string;
}

export interface ChatMessage {
  actor: 'user' | 'system';
  msg: string;
}

export interface SettingsState {
  openaiKey: string;
}

export interface PlaygroundState {
  history: Array<ChatMessage>;
  loading: boolean;
  prompt: string;
  temperature: number;
}
