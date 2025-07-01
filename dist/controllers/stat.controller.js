"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoryExpenseStats = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const Transaction_1 = __importDefault(require("../models/Transaction"));
const mongoose_1 = require("mongoose");
const getCategoryExpenseStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const start = startDate
            ? (0, dayjs_1.default)(startDate).startOf('day').toDate()
            : (0, dayjs_1.default)().startOf('month').toDate();
        const end = endDate
            ? (0, dayjs_1.default)(endDate).endOf('day').toDate()
            : (0, dayjs_1.default)().endOf('month').toDate();
        const stats = await Transaction_1.default.aggregate([
            {
                $match: {
                    user: new mongoose_1.Types.ObjectId(req.userId),
                    type: 'expense',
                    date: { $gte: start, $lt: end },
                    $or: [
                        { isRecurring: { $ne: true } },
                        { isRecurring: true, date: { $ne: null } }
                    ]
                }
            },
            {
                $group: {
                    _id: `$category`,
                    total: { $sum: '$amount' },
                },
            },
            {
                $project: {
                    category: '$_id',
                    total: 1,
                    _id: 0
                },
            },
            {
                $sort: { total: -1 }
            },
        ]);
        const txs = await Transaction_1.default.find({
            user: req.userId,
            type: 'expense',
            date: { $gte: start, $lte: end },
        });
        console.log('[DEBUG] Sample amount types:');
        txs.forEach(tx => console.log(`- ${tx.amount} (${typeof tx.amount})`));
        res.json(stats);
    }
    catch (error) {
        res.status(500).json({ message: "Không thể lấy thống kê theo danh mục", error });
    }
};
exports.getCategoryExpenseStats = getCategoryExpenseStats;
