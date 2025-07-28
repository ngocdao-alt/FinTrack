import User from "../../models/User";
import Transaction from "../../models/Transaction";
import { Request, Response } from "express";

export const getAdminDashboardStats = async (req: Request, res: Response) => {
  const userCount = await User.countDocuments();
  const transactionCount = await Transaction.countDocuments();
  const totalIncome = await Transaction.aggregate([
    { $match: { type: "income" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const totalExpense = await Transaction.aggregate([
    { $match: { type: "expense" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  res.json({
    userCount,
    transactionCount,
    totalIncome: totalIncome[0]?.total || 0,
    totalExpense: totalExpense[0]?.total || 0,
  });
};
