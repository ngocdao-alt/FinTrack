import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

export const generatePDF = async (htmlBody: string) => {
  const cssPath = path.join(__dirname, '../../tailwind.css');
  const tailwindCSS = fs.readFileSync(cssPath, 'utf8');

  const fullHtml = `
    <!DOCTYPE html>
    <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <title>Báo cáo tài chính</title>
        <style>${tailwindCSS}</style>
        <style>body { font-family: 'Arial', sans-serif; }</style>
      </head>
      <body>
        ${htmlBody}
      </body>
    </html>
  `;

  const browser = await puppeteer.launch({ headless: 'new' as any });
  const page = await browser.newPage();
  await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
  await browser.close();

  return pdfBuffer;
};
