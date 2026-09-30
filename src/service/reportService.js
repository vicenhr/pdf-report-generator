import { db } from '../db/db.js';
import { getAllBooks } from '../db/db.js';
import { getReportData } from './getReportData.js';
import { buildHtml } from '../render/buildHtml.js';
import { htmlToPdf } from '../render/htmlToPdf.js';
import {
    findById,
    findReportCreatedToday
} from '../repository/reportRepository.js';
import fs from 'fs/promises';

async function createPdf(id) {
    await fs.mkdir('./reports', { recursive: true });
    const reportData = getReportData();
    const books = getAllBooks();
    const html = buildHtml(reportData, books);
    const pdf = await htmlToPdf(html);
    await fs.writeFile(`reports/${id}.pdf`, pdf);
}

export async function createReport() {
    const insert = db.prepare(`INSERT INTO reports (path) VALUES (?)`);
    const result = insert.run('temp');
    const id = result.lastInsertRowid;
    try {
        await createPdf(id);
        db.prepare(`UPDATE reports SET path = ? WHERE id = ?`).run(`reports/${id}.pdf`, id);
    } catch (error) {
        db.prepare(`DELETE FROM reports WHERE id = ?`).run(id);
        throw error;
    }
    return {
        id: id,
        file: `/reports/${id}/file`
    };
}

export function getReportById(id) {
    return findById(id);
}

export function getReportCreatedToday() {
    return findReportCreatedToday();
}