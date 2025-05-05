import { fileURLToPath } from 'url';
import path from 'path';
import { Client } from 'minecraft-launcher-core';

export function launchMinecraft() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const forgePath = path.join(__dirname, '..', '.minecraft', 'versions', 'forge-1.8.9.jar');
  const launcher = new Client();

  const opts = {
    authorization: {
      access_token: '123456789',
      client_token: 'abcdefg',
      uuid: 'offline-user',
      name: 'OfflineUser',
      user_properties: '{}',
      meta: {
        type: 'mojang'
      }
    },
    root: './.minecraft',
    version: {
      number: '1.8.9',
      type: 'release'
    },
    memory: {
      max: '4G',
      min: '1G'
    },
    forge: forgePath,
  };

  console.log("🔧 Käynnistetään Forge-versio:", opts.version.number);

  launcher.launch(opts);

  launcher.on('debug', (e) => console.log("[DEBUG]", e));
  launcher.on('data', (e) => console.log("[DATA]", e.toString()));
  launcher.on('error', (e) => console.error("[ERROR]", e));
  launcher.on('close', () => console.log("[INFO] Minecraft sulkeutui."));
}