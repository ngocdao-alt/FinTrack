import express from 'express';
import { generatePDF } from '../utils/pupeteer';
import { exportReport } from '../controllers/report.controller';
import { requireAuth } from '../middlewares/requireAuth';
import { logActivity } from '../middlewares/logActivity';

const router = express.Router();
router.use(logActivity);

// router.post('/pdf', async (req, res) => {
//   const { html } = req.body;
//   if (!html) {
//     res.status(400).json({ message: 'Missing HTML content' });
//     return;
//   }

//   try {
//     const pdfBuffer = await generatePDF(html);
//     res.set({
//       'Content-Type': 'application/pdf',
//       'Content-Disposition': 'attachment; filename="report.pdf"',
//     });
//     res.send(pdfBuffer);
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to generate PDF', error: err });
//   }
// });

router.post('/export', requireAuth, exportReport);


export default router;
