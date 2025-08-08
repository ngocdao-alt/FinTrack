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

export const getMonthlyIncomeExpenseStats = async (req: Request, res: Response) => {
  const year = parseInt(req.query.year as string) || new Date().getFullYear();

  const startOfYear = new Date(year, 0, 1);   // 1 Jan
  const endOfYear = new Date(year, 11, 31, 23, 59, 59); // 31 Dec

  const stats = await Transaction.aggregate([
    {
      $match: {
        date: { $gte: startOfYear, $lte: endOfYear }, // 👉 lọc theo "date"
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$date" }, // 👉 nhóm theo tháng của "date"
          type: "$type",              // "income" hoặc "expense"
        },
        total: { $sum: "$amount" },
      },
    },
    {
      $group: {
        _id: "$_id.month", // gom lại theo tháng
        income: {
          $sum: {
            $cond: [{ $eq: ["$_id.type", "income"] }, "$total", 0],
          },
        },
        expense: {
          $sum: {
            $cond: [{ $eq: ["$_id.type", "expense"] }, "$total", 0],
          },
        },
      },
    },
    {
      $sort: { _id: 1 }, // sắp xếp theo tháng
    },
  ]);

  // Đảm bảo có đủ 12 tháng
  const result = Array.from({ length: 12 }, (_, i) => {
    const found = stats.find((s) => s._id === i + 1);
    return {
      month: i + 1,
      income: found?.income || 0,
      expense: found?.expense || 0,
    };
  });

  res.json(result);
};

export const getMonthlyTransactionCount = async (req: Request, res: Response) => {
  try {
    const year = parseInt(req.query.year as string) || new Date().getFullYear();

    const startOfYear = new Date(year, 0, 1);   // 01/01/yyyy
    const endOfYear = new Date(year, 11, 31, 23, 59, 59); // 31/12/yyyy

    const stats = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: startOfYear, $lte: endOfYear }, // 🔍 dùng field "date"
        },
      },
      {
        $group: {
          _id: { month: { $month: "$date" } },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.month": 1 },
      },
    ]);

    // Đảm bảo đủ 12 tháng, nếu tháng nào không có giao dịch thì count = 0
    const result = Array.from({ length: 12 }, (_, i) => {
      const monthStat = stats.find((s) => s._id.month === i + 1);
      return {
        month: i + 1,
        count: monthStat?.count || 0,
      };
    });

    res.json(result);
  } catch (err) {
    console.error("❌ Lỗi khi lấy transaction count theo tháng:", err);
    res.status(500).json({ message: "Lỗi server khi lấy dữ liệu!" });
  }
};
