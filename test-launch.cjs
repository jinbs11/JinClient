const path = require("path");
const { Client } = require("minecraft-launcher-core");
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
  forge: './.minecraft/versions/forge-1.8.9.jar',
};

console.log("Käynnistetään Forge-versio:", opts.version.number);
console.log("Java-polku:");
console.log("Käytetään assetIndex:", opts.assets);

launcher.launch(opts);

launcher.on('debug', (e) => console.log("[DEBUG]", e));
launcher.on('data', (e) => console.log("[DATA]", e.toString()));
launcher.on('error', (e) => console.error("[ERROR]", e));
launcher.on('close', () => console.log("[INFO] Minecraft sulkeutui."));
