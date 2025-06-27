// src/controllers/budget.controller.ts
import { Request, Response } from "express";
import Budget from "../models/Budget";
import Transaction from "../models/Transaction";
import { AuthRequest } from "../middlewares/requireAuth";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import mongoose from "mongoose";

dayjs.extend(utc);

export const setOrUpdateBudget = async (req: AuthRequest, res: Response) => {
  try {
    const { month, year, amount } = req.body;

    const budget = await Budget.findOneAndUpdate(
      { user: req.userId, month, year },
      { amount },
      { upsert: true, new: true }
    );

    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: "Không thể tạo/cập nhật ngân sách", error: err });
  }
};

export const getMonthlyBudget = async (req: AuthRequest, res: Response) => {
  try {
    const { month, year } = req.query;

    if (!month || !year){
      res.status(400).json({ message: "Thiếu tháng hoặc năm" });
      return;
    }

    const budget = await Budget.findOne({
      user: new mongoose.Types.ObjectId(req.userId),
      month: +month,
      year: +year,
    });

    if (!budget){
      res.status(404).json({ message: "Chưa thiết lập ngân sách" });
      return;
    }

    const start = dayjs.utc((`${year}-${month}-01`)).toDate();
    const end = dayjs.utc((`${year}-${+month + 1}-01`)).toDate();

    console.log("Match user:", req.userId);
    console.log("Date range:", start, end);

    const transactions = await Transaction.find({
        user: new mongoose.Types.ObjectId(req.userId),
        type: "expense",
        date: { $gte: start, $lt: end },
    });

    console.log("Matched tx count:", transactions.length);

    const totalExpense = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.userId),
          type: "expense",
          date: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const spent = totalExpense[0]?.total || 0;
    const percentUsed = Math.round((spent / budget.amount) * 100);

    res.json({
      month: budget.month,
      year: budget.year,
      amount: budget.amount,
      spent,
      percentUsed: percentUsed > 100 ? 100 : percentUsed,
    });
  } catch (err) {
    res.status(500).json({ message: "Không thể lấy ngân sách", error: err });
  }
};
