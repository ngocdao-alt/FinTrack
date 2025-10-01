import path from 'path';
import fs from 'fs';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ReportModel } from '../models/Report';
import { AuthRequest } from '../middlewares/requireAuth';
import { generatePDF } from '../utils/pupeteer';
import { logAction } from '../utils/logAction';

export const exportReport = async (req: AuthRequest, res: Response) => {
  const { html, month } = req.body;
  const userId = req.userId;

  if (!html || !month) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  try {
    // ✅ Tìm xem đã có báo cáo chưa
    const existingReport = await ReportModel.findOne({ userId, month });

    if (existingReport) {
      // 🔁 Nếu đã có → trả về luôn
      await logAction(req, {
        action: 'Export Report',
        statusCode: 200,
        description: `Lấy lại báo cáo tháng ${month} - ID: ${existingReport.reportId}`,
      });

      return res.status(200).json({ report: existingReport });
    }

    // 🚀 Nếu chưa có → tạo mới
    const reportId = uuidv4();
    const pdfBuffer = await generatePDF(html);
    const fileName = `${reportId}.pdf`;
    const dirPath = path.join(__dirname, '../../public/reports');

    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

    const filePath = path.join(dirPath, fileName);
    fs.writeFileSync(filePath, pdfBuffer);

    const report = await ReportModel.create({
      reportId,
      userId,
      month,
      filePath: `static/reports/${fileName}`,
    });

    await logAction(req, {
      action: 'Export Report',
      statusCode: 200,
      description: `Xuất báo cáo mới tháng ${month} - ID: ${reportId}`,
    });

    res.status(200).json({ report });
  } catch (err) {
    console.error('Export report error:', err);

    await logAction(req, {
      action: 'Export Report',
      statusCode: 500,
      description: 'Lỗi khi xuất báo cáo',
      level: 'error',
    });

    res.status(500).json({ message: 'Export failed', error: err });
  }
};

