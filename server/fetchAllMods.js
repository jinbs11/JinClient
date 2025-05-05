const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const https = require('follow-redirects').https;
require('dotenv').config({ path: path.join(__dirname, '.env') });

// 📁 Mihin .jarit menee
const modsFolderPath = path.join(__dirname, '..', 'electron-react-app', 'mods_inactive');
// 📁 Mihin kirjoitetaan mods.json
const modsJsonPath = path.join(__dirname, '..', 'electron-react-app', 'public', 'mods.json');

// 🔧 Varmista että kansio on olemassa
if (!fs.existsSync(modsFolderPath)) {
  fs.mkdirSync(modsFolderPath, { recursive: true });
}

// 🔧 Modilistat
const modsList = [
  {
    name: "Skytils",
    repo: "Skytils/SkytilsMod"
  },
];

async function fetchLatestRelease(repo) {
  const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
      'User-Agent': 'ModUpdater'
    }
  });

  if (!res.ok) throw new Error(`GitHub API error ${res.status}`);
  const data = await res.json();
  const asset = data.assets?.find(a => a.name.endsWith('.jar'));
  if (!asset) return null;

  return {
    name: repo.split('/')[1],
    filename: asset.name,
    url: asset.browser_download_url
  };
}

async function removeOldVersions(modName) {
  const files = fs.readdirSync(modsFolderPath);
  const pattern = new RegExp(`^${modName}.*\\.jar$`, 'i');

  files.forEach(file => {
    if (pattern.test(file)) {
      const fullPath = path.join(modsFolderPath, file);
      fs.unlinkSync(fullPath);
      console.log(`🗑️ Removed old version: ${file}`);
    }
  });
}

async function downloadMod(mod) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(modsFolderPath, mod.filename);

    const file = fs.createWriteStream(filePath);
    https.get(mod.url, response => {
      if (response.statusCode !== 200) {
        console.error(`❌ Failed to download ${mod.name}, status ${response.statusCode}`);
        fs.unlink(filePath, () => {});
        return reject(new Error(`Download failed with status ${response.statusCode}`));
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          console.log(`⬇️ Downloaded ${mod.filename}`);
          resolve();
        });
      });
    }).on('error', err => {
      fs.unlink(filePath, () => {});
      reject(err);
    });
  });
}

async function run() {
  if (!process.env.GITHUB_TOKEN) {
    console.error("❌ GITHUB_TOKEN missing in .env");
    process.exit(1);
  }

  const mods = [];

  for (const entry of modsList) {
    try {
      const mod = await fetchLatestRelease(entry.repo);
      if (mod) {
        mod.name = entry.name;
        await removeOldVersions(mod.name);
        await downloadMod(mod);
        mods.push(mod);
      } else {
        console.warn(`⚠️ No .jar found for ${entry.name}`);
      }
    } catch (err) {
      console.error(`❌ Failed to process ${entry.name}:`, err.message);
    }
  }

  fs.writeFileSync(modsJsonPath, JSON.stringify(mods, null, 2));
  console.log("✅ All mods updated.");
}

run();
