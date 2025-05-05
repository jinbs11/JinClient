// electron/preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  launchGame: () => ipcRenderer.invoke('launch-minecraft'),
  copyMod: (filename) => ipcRenderer.invoke('copy-mod', filename),
  removeMod: (filename) => ipcRenderer.invoke('remove-mod', filename),
  checkInstalledMods: (filenames) => ipcRenderer.invoke('check-installed-mods', filenames)
});