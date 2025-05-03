// global.d.ts
export {};

declare global {
  interface Window {
    electronAPI: {
      launchGame: () => void;
    };
  }
}
