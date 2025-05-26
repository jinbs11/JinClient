// seed.js
import { addUser, getAllUsers } from './db.js';

// Luo dummy käyttäjiä
addUser({
  access_token: 'dummy-access-token-1',
  uuid: 'uuid-1',
  name: 'TestUser1',
  user_properties: '{}'
});

addUser({
  access_token: 'dummy-access-token-2',
  uuid: 'uuid-2',
  name: 'TestUser2',
  user_properties: '{"skin":"default"}'
});

const all = getAllUsers();