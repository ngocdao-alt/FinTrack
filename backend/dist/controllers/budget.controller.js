"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMonthlyBudget = exports.setOrUpdateBudget = void 0;
const Budget_1 = __importDefault(require("../models/Budget"));
const Transaction_1 = __importDefault(require("../models/Transaction"));
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const mongoose_1 = __importDefault(require("mongoose"));
dayjs_1.default.extend(utc_1.default);
const setOrUpdateBudget = async (req, res) => {
    try {
        const { month, year, amount } = req.body;
        const budget = await Budget_1.default.findOneAndUpdate({ user: req.userId, month, year }, { amount }, { upsert: true, new: true });
        res.json(budget);
    }
    catch (err) {
        res.status(500).json({ message: "Không thể tạo/cập nhật ngân sách", error: err });
    }
};
exports.setOrUpdateBudget = setOrUpdateBudget;
const getMonthlyBudget = async (req, res) => {
    try {
        const { month, year } = req.query;
        if (!month || !year) {
            res.status(400).json({ message: "Thiếu tháng hoặc năm" });
            return;
        }
        const budget = await Budget_1.default.findOne({
            user: new mongoose_1.default.Types.ObjectId(req.userId),
            month: +month,
            year: +year,
        });
        if (!budget) {
            res.status(404).json({ message: "Chưa thiết lập ngân sách" });
            return;
        }
        const start = dayjs_1.default.utc((`${year}-${month}-01`)).toDate();
        const end = dayjs_1.default.utc((`${year}-${+month + 1}-01`)).toDate();
        console.log("Match user:", req.userId);
        console.log("Date range:", start, end);
        const transactions = await Transaction_1.default.find({
            user: new mongoose_1.default.Types.ObjectId(req.userId),
            type: "expense",
            date: { $gte: start, $lt: end },
        });
        console.log("Matched tx count:", transactions.length);
        const totalExpense = await Transaction_1.default.aggregate([
            {
                $match: {
                    user: new mongoose_1.default.Types.ObjectId(req.userId),
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
    }
    catch (err) {
        res.status(500).json({ message: "Không thể lấy ngân sách", error: err });
    }
};
exports.getMonthlyBudget = getMonthlyBudget;
