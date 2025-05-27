// global.d.ts
export {};

export interface IElectronAPI {
  invoke: (channel: string, ...args: any[]) => Promise<any>;
  launchGame: () => void;
  copyMod: (filename: string) => void;
  removeMod: (filename: string) => void;
  checkInstalledMods: (filenames: string[]) => Promise<boolean[]>;
  openFolder: (path: string) => Promise<string>;
  authAPI: {
    autologin: () => Promise<{ access_token: string }>;
  };
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
    accessToken?: string;
  }
}