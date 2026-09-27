import { chromium } from "playwright";
import { buildHtml } from './buildHtml.js';

import { getReportData } from '../reports/getReportData.js';
import { getAllBooks } from '../db/db.js';
import fs from 'fs/promises';

export async function htmlToPdf(html) {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'networkidle' });
    
    const pdf = await page.pdf({
        format: 'A4',
        margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
        printBackground: true,
    });

    await browser.close();
    return pdf; // Buffer
}

const pdf = await htmlToPdf(buildHtml(getReportData(), getAllBooks()));
await fs.writeFile('output/output.pdf', pdf);