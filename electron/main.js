import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { Client } from 'minecraft-launcher-core';
import fs from 'fs';
import followRedirects from 'follow-redirects';
import { execFile } from 'child_process';
const https = followRedirects.https;
import { launchMinecraft } from './launcher.js';
import { ConfidentialClientApplication } from '@azure/msal-node';
import '../server/index.js';
import { getLastUsedUser } from '../server/userHandler.js';
import fetch from 'node-fetch';
import { autologin } from './auth.js';
import util from 'util';
const execFileAsync = util.promisify(execFile);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fetchModsScript = path.join(__dirname, '..', 'server', 'fetchAllMods.js');

// 🚀 Suorita skripti ennen ikkunan luontia
async function runFetchMods() {
  try {
    const { stdout, stderr } = await execFileAsync('node', [fetchModsScript]);
    console.log('📦 fetchAllMods.js output:\n', stdout);
    if (stderr) console.error('⚠️ stderr:', stderr);
  } catch (error) {
    console.error('❌ Failed to run fetchAllMods.js:', error.message);
  }
}

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

let splashWindow;
let mainWindow;

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 400,
    height: 120,
    frame: true,
    title: "JinClient",
    alwaysOnTop: true,
    resizable: false,
    show: true,
    center: true,
    webPreferences: {
      
    }
  });

  splashWindow.setMenuBarVisibility(false);
  splashWindow.removeMenu();

  splashWindow.loadURL('http://localhost:5173/splash.html');
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 650,
    resizable: false,
    minimizable: true,
    useContentSize: true,
    show: false, // älä näytä heti
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.removeMenu();
  mainWindow.loadURL('http://localhost:5173/index.html');

  // Kun pääikkuna on valmis, näytä se ja sulje splash
  mainWindow.once('ready-to-show', () => {
    splashWindow.close();
    mainWindow.show();
    mainWindow.webContents.openDevTools(); // poista tämä jos et halua devtoolsia
  });
}

app.whenReady().then(async () => {
  createSplashWindow();
  await runFetchMods();
  createMainWindow();

  ipcMain.handle('launch-minecraft', async () => {
    launchMinecraft();
  });
});
console.log("Using preload:", path.join(__dirname, 'preload.mjs'));


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

ipcMain.handle('auth-autologin', async () => {
  return await autologin();
});