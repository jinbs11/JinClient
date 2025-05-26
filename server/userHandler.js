import { addUser, getAllUsers } from '../db.js';

export function saveUserToDB(profile) {
  addUser({
    uuid: profile.uuid,
    name: profile.name,
    access_token: profile.access_token,
    refresh_token: profile.refresh_token,
    user_properties: JSON.stringify(profile.user_properties ?? {}),
    refresh_token: profile.refresh_token
  });
}

export function getLastUsedUser() {
  const users = getAllUsers();
  return users[0]; // palauttaa viimeksi lisätyn käyttäjän
}