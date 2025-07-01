"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const Transaction_1 = __importDefault(require("../models/Transaction"));
const getDashboardStats = async (req, res) => {
    try {
        const { month, year } = req.query;
        const filter = { user: req.userId };
        console.log("User ID:", req.userId);
        console.log("Filter:", filter);
        if (month && year) {
            const monthNum = parseInt(month, 10);
            const yearNum = parseInt(year, 10);
            const start = new Date(Date.UTC(yearNum, monthNum - 1, 1)); // ví dụ: UTC 2025-06-01T00:00:00Z
            const end = new Date(Date.UTC(yearNum, monthNum, 1)); // UTC 2025-07-01T00:00:00Z
            filter.date = { $gte: start, $lt: end };
        }
        const transactions = await Transaction_1.default.find(filter);
        let totalIncome = 0;
        let totalExpense = 0;
        transactions.forEach((tx) => {
            if (tx.type === 'income')
                totalIncome += tx.amount;
            else
                totalExpense += tx.amount;
        });
        const balance = totalIncome - totalExpense;
        res.json({ totalIncome, totalExpense, balance });
    }
    catch (error) {
        res.status(500).json({ message: "Không thể lấy thống kê", error });
    }
};
exports.getDashboardStats = getDashboardStats;
