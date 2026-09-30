import { DatabaseSync } from "node:sqlite";
import path from "node:path";

const dbPath = path.join(import.meta.dirname, "..", "..", "report.db");
export const db = new DatabaseSync(dbPath);

db.exec(`
    CREATE TABLE IF NOT EXISTS books(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        price REAL NOT NULL CHECK (price >= 0),
        rating REAL NOT NULL CHECK (rating >= 0 AND rating <= 5),
        url TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        path TEXT NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`);

export function getAllBooks() {
    const books = db.prepare('SELECT * FROM books ORDER BY id').all().map(book => ({...book}));
    return books;
}

export function insertBook({ title, price, rating, url }) {
    const insert = db.prepare(`
        INSERT INTO books (title, price, rating, url) 
        VALUES (?, ?, ?, ?)
    `);
    const result = insert.run(title, price, rating, url);
    return {
        id: result.lastInsertRowid,
        title,
        price,
        rating,
        url
    };
}