import puppeteer from "puppeteer";
import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/requireAuth";

export const generatePDF = async (req: AuthRequest, res: Response) => {
  const { htmlContent, filename } = req.body;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(htmlContent, {
    waitUntil: "networkidle0",
  });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="${filename || 'report'}.pdf"`,
    "Content-Length": pdfBuffer.length,
  });

  res.send(pdfBuffer);
};
