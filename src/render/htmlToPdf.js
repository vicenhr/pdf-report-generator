import { chromium } from "playwright";

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

// export async function main (reportData, allBooks) {
//     await fs.mkdir('./cache', { recursive: true });
//     const pdf = await htmlToPdf(buildHtml(reportData, allBooks));
//     await fs.writeFile('output/output.pdf', pdf);
// }