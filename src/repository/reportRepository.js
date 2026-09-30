import { db } from '../db/db.js';

function getAllReports(){
    return db.prepare(`SELECT * FROM reports`).all();
}

export function findById(id) {
    const statement = db.prepare(`
        SELECT *
        FROM reports
        WHERE id = ?
    `);

    return statement.get(id) ?? null;
}

export function findReportCreatedToday(){
    const statement = db.prepare(`
        SELECT id 
        FROM reports
        WHERE date (created_at) =  date('now', 'localtime')
    `);
    return statement.get() ?? null;
}