import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { Client } from 'minecraft-launcher-core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const version = '1.8.9-forge1.8.9-11.15.1.2318-1.8.9';

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
          name: 'test-user1',
          uuid: '1234',
          user_properties: '{}',
          meta: { type: 'mojang' },
        },
        root: './.minecraft',
        version: { number: "1.8.9-forge1.8.9-11.15.1.2318-1.8.9", type: 'custom' },
        memory: { max: '4G', min: '1G' },
        assets: '1.8'
      });
    } catch (err) {
      console.error('Minecraft launch failed:', err);
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
