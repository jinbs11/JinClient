import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { Client } from 'minecraft-launcher-core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 650,
    resizable: false,
    minimizable: true,
    useContentSize: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadURL('http://localhost:5173');
}

app.whenReady().then(() => {
  createWindow();

  ipcMain.handle('launch-minecraft', async () => {
    const launcher = new Client();
    try {
      await launcher.launch({
        authorization: {
          access_token: '123',
          name: 'OfflineUser',
          uuid: '1234',
          user_properties: '{}',
          meta: { type: 'mojang' },
        },
        root: './.minecraft',
        version: { number: '1.8.9', type: 'release' },
        memory: { max: '4G', min: '1G' },
      });
    } catch (err) {
      console.error('Minecraft launch failed:', err);
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
