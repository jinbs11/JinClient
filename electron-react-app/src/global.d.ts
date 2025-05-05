// global.d.ts
export {};

export interface IElectronAPI {
  invoke: (channel: string, ...args: any[]) => Promise<any>;
  launchGame: () => void;
  copyMod: (filename: string) => void;
  removeMod: (filename: string) => void;
  checkInstalledMods: (filenames: string[]) => Promise<boolean[]>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}