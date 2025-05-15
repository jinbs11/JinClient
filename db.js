// db.js
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// __dirname ESM-yhteensopivasti
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Luo 'data' kansio, jos sitä ei ole
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Luo tai avaa tietokanta data-kansion sisällä
const dbPath = path.join(dataDir, 'users.db');
const db = new Database(dbPath);

// Luo taulu, jos ei ole vielä olemassa
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    access_token TEXT NOT NULL,
    uuid TEXT NOT NULL,
    name TEXT NOT NULL,
    user_properties TEXT
  )
`).run();

// Lisää uusi käyttäjä
export function addUser({ access_token, uuid, name, user_properties }) {
  const stmt = db.prepare(`
    INSERT INTO users (access_token, uuid, name, user_properties)
    VALUES (?, ?, ?, ?)
  `);
  stmt.run(access_token, uuid, name, user_properties);
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
