// global.d.ts
export {};

declare global {
  interface Window {
    electronAPI: {
      launchGame: () => void;
      copyMod: (filename: string) => void;
      removeMod: (filename: string) => void;
      checkInstalledMods: (filenames: string[]) => Promise<boolean[]>;
    };
  }
}
