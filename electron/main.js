import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import followRedirects from 'follow-redirects';
import { execFile } from 'child_process';
const https = followRedirects.https;
import { launchMinecraft } from './launcher.js';
import '../server/index.js';
import { autologin } from './auth.js';
import util from 'util';
const execFileAsync = util.promisify(execFile);

const isDev = !app.isPackaged;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fetchModsScript = path.join(__dirname, '..', 'server', 'fetchAllMods.js');

app.setAsDefaultProtocolClient('jinclient');

app.on('open-url', (event, url) => {
  event.preventDefault();
  const parsedUrl = new URL(url);
  const code = parsedUrl.searchParams.get("code");

  if (pendingAuthResolve && code) {
    pendingAuthResolve(code);
    pendingAuthResolve = null;
  }
});

// 🚀 Suorita skripti ennen ikkunan luontia
async function runFetchMods() {
  try {
    const { stdout, stderr } = await execFileAsync('node', [fetchModsScript]);
    if (stderr) console.error('⚠️ stderr:', stderr);
  } catch (error) {
    console.error('❌ Failed to run fetchAllMods.js:', error.message);
  }
}

let pendingAuthResolve;

ipcMain.handle("login-with-microsoft", async () => {
  return new Promise((resolve, reject) => {
    pendingAuthResolve = resolve;

    const isDev = !app.isPackaged;
    const clientId = "e6fd8ee6-21b5-482d-988d-b8aae6980d3a";
    const redirectUri = isDev
      ? "http://localhost:5173/auth-callback"
      : "jinclient://auth-callback";
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

    // Kehitystilassa tarkkaile will-redirect
    if (isDev) {
      authWin.webContents.on('will-redirect', (event, url) => {
        const parsedUrl = new URL(url);
        if (parsedUrl.origin === "http://localhost:5173" && parsedUrl.pathname === "/auth-callback") {
          const code = parsedUrl.searchParams.get("code");
          if (code) {
            event.preventDefault();
            authWin.close();
            resolve(code);
          }
        }
      });
    }
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
    icon: path.join(__dirname, '..', 'public', 'logo.ico'),
    webPreferences: {}
  });

  splashWindow.setMenuBarVisibility(false);
  splashWindow.removeMenu();

  if (isDev) {
    splashWindow.loadURL('http://localhost:5173/splash.html');
  } else {
    splashWindow.loadFile(path.join(__dirname, '..', 'dist', 'splash.html'));
  }
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 650,
    resizable: false,
    minimizable: true,
    useContentSize: true,
    show: false,
    icon: path.join(__dirname, '..', 'public', 'logo.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.removeMenu();

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173/index.html');
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    splashWindow.close();
    mainWindow.show();
    if (isDev) mainWindow.webContents.openDevTools();
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


ipcMain.handle('copy-mod', (event, filename) => {
  const src = path.join(__dirname, '..', 'mods_inactive', filename);
  const dest = path.join(__dirname, '..', '.minecraft', 'mods', filename);

  try {
    fs.copyFileSync(src, dest);
  } catch (err) {
    console.error(`❌ Failed to copy mod: ${filename}`, err);
  }
});

ipcMain.handle('remove-mod', (event, filename) => {
  const dest = path.join(__dirname, '..', '.minecraft', 'mods', filename);

  try {
    if (fs.existsSync(dest)) {
      fs.unlinkSync(dest);
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