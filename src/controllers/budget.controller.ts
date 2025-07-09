// src/controllers/budget.controller.ts
import { Request, Response } from "express";
import Budget from "../models/Budget";
import Transaction from "../models/Transaction";
import { AuthRequest } from "../middlewares/requireAuth";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import mongoose from "mongoose";

dayjs.extend(utc);

// POST /api/budget
export const setOrUpdateBudget = async (req: AuthRequest, res: Response) => {
  try {
    const { month, year, totalAmount, categories } = req.body;

    if (!month || !year || !totalAmount) {
      res.status(400).json({ message: 'Vui lòng nhập tháng, năm và ngân sách tổng.' });
      return;
    }

    const existing = await Budget.findOne({ user: req.userId, month, year });

    if (existing) {
      existing.totalAmount = totalAmount;
      existing.categories = categories || [];
      await existing.save();

      res.json({ message: 'Cập nhật ngân sách thành công.', budget: existing });
      return;
    }

    const newBudget = await Budget.create({
      user: req.userId,
      month,
      year,
      totalAmount,
      categories: categories || [],
    });

    res.status(201).json({ message: 'Tạo ngân sách thành công.', budget: newBudget });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi tạo/cập nhật ngân sách.', error: err });
  }
};

export const getMonthlyBudget = async (req: AuthRequest, res: Response) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      res.status(400).json({ message: "Thiếu tháng hoặc năm." });
      return;
    }

    const budget = await Budget.findOne({
      user: new mongoose.Types.ObjectId(req.userId),
      month: +month,
      year: +year,
    });

    if (!budget) {
     res.status(404).json({ message: "Chưa thiết lập ngân sách cho tháng này." });
     return;
    }

    const start = dayjs.utc(`${year}-${month}-01`).startOf('month').toDate();
    const end = dayjs.utc(`${year}-${month}-01`).endOf('month').toDate();

    // 👉 Lấy tất cả giao dịch chi tiêu trong tháng
    const transactions = await Transaction.find({
      user: new mongoose.Types.ObjectId(req.userId),
      type: 'expense',
      date: { $gte: start, $lte: end },
    });

    // 👉 Tính tổng chi
    const totalSpent = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    const percentUsed = Math.round((totalSpent / budget.totalAmount) * 100);

    // 👉 Tính chi theo từng danh mục
    const spentPerCategory: Record<string, number> = {};
    transactions.forEach(tx => {
      if (!spentPerCategory[tx.category]) spentPerCategory[tx.category] = 0;
      spentPerCategory[tx.category] += tx.amount;
    });

    // 👉 Ghép vào ngân sách danh mục
    const categoryStats = budget.categories.map(cat => {
      const spent = spentPerCategory[cat.category] || 0;
      const catPercentUsed = Math.round((spent / cat.amount) * 100);
      return {
        category: cat.category,
        budgetedAmount: cat.amount,
        spentAmount: spent,
        percentUsed: catPercentUsed > 100 ? 100 : catPercentUsed,
      };
    });

    res.json({
      month: budget.month,
      year: budget.year,
      totalBudget: budget.totalAmount,
      totalSpent,
      totalPercentUsed: percentUsed > 100 ? 100 : percentUsed,
      categoryStats,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Không thể lấy ngân sách.", error: err });
  }
};
