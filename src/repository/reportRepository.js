import { db } from '../db/db.js';

export function findById(id) {
    const statement = db.prepare(`
        SELECT *
        FROM reports
        WHERE id = ?
    `);

    return statement.get(id) ?? null;
}