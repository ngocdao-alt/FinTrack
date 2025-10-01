// routes/pdf.ts
import express from "express";
import { generatePDF } from "../utils/pupeteer";
import { Request, Response } from "express";
import { logActivity } from "../middlewares/logActivity";

const router = express.Router();
router.use(logActivity);

router.post("/generate", async (req: Request, res: Response) => {
  try {
    const htmlBody = req.body.htmlBody;
    if (!htmlBody) {
        res.status(400).json({ message: "Missing htmlBody in request body" });
        return;
    }

    const pdfBuffer = await generatePDF(htmlBody);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=baocao.pdf',
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.error("PDF Generation Error:", error);
    res.status(500).json({ message: "Failed to generate PDF" });
  }
});

export default router;
