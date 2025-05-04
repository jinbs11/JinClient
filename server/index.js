const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const PORT = 5174;

app.use(cors());

// Palauta resourcepacks.json
app.get('/resourcepacks', (req, res) => {
  const data = fs.readFileSync(path.join(__dirname, 'resourcepacks.json'));
  res.json(JSON.parse(data));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

app.get('/mods', async (req, res) => {
    try {
      const localModsData = fs.readFileSync(path.join(__dirname, 'mods.json'), 'utf-8');
      const localMods = JSON.parse(localModsData);
  
      const githubRes = await fetch('https://api.github.com/repos/Skytils/SkytilsMod/releases/latest');
      const githubData = await githubRes.json();
  
      const skytilsAsset = githubData.assets.find(a => a.name.endsWith('.jar'));
  
      if (skytilsAsset) {
        localMods.push({
          name: skytilsAsset.name,
          url: skytilsAsset.browser_download_url
        });
      }
  
      res.json(localMods);
    } catch (err) {
      console.error("Virhe modien yhdistämisessä:", err.message);
      res.status(500).json({ error: "Modien lataus epäonnistui." });
    }
});