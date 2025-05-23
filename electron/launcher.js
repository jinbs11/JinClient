import { fileURLToPath } from 'url';
import path from 'path';
import { Client } from 'minecraft-launcher-core';
import { randomUUID } from 'crypto';
import { getLastUsedUser } from '../server/userHandler.js';

export async function launchMinecraft() {
  const user = getLastUsedUser();
  const access_token = global.accessToken || user.access_token;

  if (!user || !access_token) {
    console.error("❌ Ei käyttäjää tai tokenia!");
    return;
  }

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const forgePath = path.join(__dirname, '..', '.minecraft', 'versions', 'forge-1.8.9.jar');
  const client_token = randomUUID();

  const opts = {
    authorization: {
      access_token,
      client_token,
      uuid: user.uuid,
      name: user.name,
      user_properties: user.user_properties || '{}',
      meta: { type: 'mojang' }
    },
    root: './.minecraft',
    version: { number: '1.8.9', type: 'release' },
    memory: { max: '4G', min: '1G' },
    forge: forgePath,
  };

  const launcher = new Client();
  launcher.launch(opts);

  launcher.on('debug', (e) => console.log("[DEBUG]", e));
  launcher.on('data', (e) => console.log("[DATA]", e.toString()));
  launcher.on('error', (e) => console.error("[ERROR]", e));
  launcher.on('close', () => console.log("[INFO] Minecraft sulkeutui."));
}