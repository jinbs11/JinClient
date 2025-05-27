// db.js
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { app } from 'electron';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tarkista kehitysvaihe
const isDev = !app.isPackaged;

// Määrittele data-hakemisto
const dataDir = isDev
  ? path.join(__dirname, 'data')
  : path.join(app.getPath('userData'), 'data');

// Luo kansio jos puuttuu
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Määrittele polku tietokantaan
const dbPath = isDev
  ? path.join(__dirname, 'data', 'users.db') // Kehitysympäristössä
  : path.join(process.resourcesPath, 'app.asar.unpacked', 'data', 'users.db'); // Tuotantoversiossa


// ✅ Nyt on turvallista luoda tietokanta
const db = new Database(dbPath);

// Luo taulu, jos ei ole vielä olemassa
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    access_token TEXT NOT NULL,
    uuid TEXT NOT NULL,
    name TEXT NOT NULL,
    user_properties TEXT,
    refresh_token TEXT
  )
`).run();

// Lisää uusi käyttäjä
export function addUser({ access_token, uuid, name, user_properties, refresh_token }) {
  const stmt = db.prepare(`
    INSERT INTO users (access_token, uuid, name, user_properties, refresh_token)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(access_token, uuid, name, user_properties, refresh_token);
}

// Hae kaikki käyttäjät
export function getAllUsers() {
  const stmt = db.prepare(`SELECT * FROM users ORDER BY id DESC`);
  return stmt.all();
}

// Hae käyttäjä UUID:n perusteella
export function getUserByUUID(uuid) {
  const stmt = db.prepare(`SELECT * FROM users WHERE uuid = ?`);
  return stmt.get(uuid);
}
