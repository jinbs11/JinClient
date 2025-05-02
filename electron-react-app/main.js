import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 650,
    resizable: false,
    minimizable: true,
  });

  // Menu.setApplicationMenu(false);

  win.loadURL('http://localhost:5173');
}

app.whenReady().then(createWindow);
