const { Client } = require('minecraft-launcher-core');
const launcher = new Client();

let opts = {
  authorization: {
    access_token: '123456789',
    client_token: 'abcdefg',
    uuid: 'test-uuid',
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
  }
};

launcher.launch(opts);
