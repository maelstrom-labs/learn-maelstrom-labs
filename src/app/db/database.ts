import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

// Resolve the path to the database
const dbDirectory = path.resolve(process.cwd(), 'db');
const dbPath = path.join(dbDirectory, 'app.db');

// Ensure the `db` directory exists
if (!fs.existsSync(dbDirectory)) {
  fs.mkdirSync(dbDirectory, { recursive: true });
}

// Initialize the database
const db = new Database(dbPath, { verbose: console.log });

// Create schema if it does not exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
  )
`);

export default db;
