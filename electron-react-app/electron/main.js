import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { Client } from 'minecraft-launcher-core';
import fs from 'fs';
import followRedirects from 'follow-redirects';
import { execFile } from 'child_process';
const https = followRedirects.https;
import { launchMinecraft } from './launcher.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fetchModsScript = path.join(__dirname, '..', '..', 'server', 'fetchAllMods.js');

// 🚀 Suorita skripti ennen ikkunan luontia
execFile('node', [fetchModsScript], (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Failed to run fetchAllMods.js:', error.message);
    return;
  }
  console.log('📦 fetchAllMods.js output:\n', stdout);
  if (stderr) console.error('⚠️ stderr:', stderr);
});

ipcMain.handle("login-with-microsoft", async () => {
  return new Promise((resolve, reject) => {
    const clientId = "e6fd8ee6-21b5-482d-988d-b8aae6980d3a";
    const redirectUri = "http://localhost:5173/auth-callback";
    const scope = "XboxLive.signin offline_access";

    const authUrl = `https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&response_mode=query&scope=${encodeURIComponent(scope)}&state=123`;

    const authWin = new BrowserWindow({
      width: 600,
      height: 700,
      webPreferences: {
        nodeIntegration: false
      }
    });

    authWin.loadURL(authUrl);

    // Tarkkaile URLia
    authWin.webContents.on('will-redirect', (event, url) => {
      const parsedUrl = new URL(url);
      if (parsedUrl.origin === "http://localhost:5173" && parsedUrl.pathname === "/auth-callback") {
        const code = parsedUrl.searchParams.get("code");
        if (code) {
          event.preventDefault(); // estä uudelleenlataus
          authWin.close();
          resolve(code); // lähetä code takaisin render-prosessille
        }
      }
    });
  });
});

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
    launchMinecraft();
  });
});

ipcMain.handle('copy-mod', (event, filename) => {
  const src = path.join(__dirname, '..', 'mods_inactive', filename);
  const dest = path.join(__dirname, '..', '.minecraft', 'mods', filename);

  try {
    fs.copyFileSync(src, dest);
    console.log(`✅ Copied mod: ${filename}`);
  } catch (err) {
    console.error(`❌ Failed to copy mod: ${filename}`, err);
  }
});

ipcMain.handle('remove-mod', (event, filename) => {
  const dest = path.join(__dirname, '..', '.minecraft', 'mods', filename);

  try {
    if (fs.existsSync(dest)) {
      fs.unlinkSync(dest);
      console.log(`🗑️ Removed mod: ${filename}`);
    }
  } catch (err) {
    console.error(`❌ Failed to remove mod: ${filename}`, err);
  }
});

ipcMain.handle('check-installed-mods', async (event, filenames) => {
  const modsPath = path.join(__dirname, '..', '.minecraft', 'mods');

  return filenames.map(filename => {
    const filePath = path.join(modsPath, filename);
    return fs.existsSync(filePath);
  });
});