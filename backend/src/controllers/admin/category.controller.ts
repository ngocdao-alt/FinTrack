// CategoryController.ts
import { Request, Response } from "express";
import Transaction from "../../models/Transaction";
export const getCategorySummary = async (_req: Request, res: Response) => {
  try {
    const summary = await Transaction.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 }, total: { $sum: "$amount" } } },
      { $sort: { count: -1 } }
    ]);

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: "Lỗi thống kê danh mục", error });
  }
};
