import {ReportModel} from "../../models/Report"
import { Request, Response } from "express";

export const getAllReports = async (req: Request, res: Response) => {
  const reports = await ReportModel.find().populate("userId", "name email");
  res.json(reports);
};

export const getReportById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const report = await ReportModel.findById(id);
    if (!report) {
        res.status(404).json({ message: "Không tìm thấy báo cáo." });
        return;
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

export const deleteReport = async (req: Request, res: Response) => {
  const report = await ReportModel.findByIdAndDelete(req.params.id);
  if (!report) {
    res.status(404).json({ message: "Không tìm thấy báo cáo" });
  }
  res.json({ message: "Đã xoá báo cáo" });
};
