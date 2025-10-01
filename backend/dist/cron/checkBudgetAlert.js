"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCheckBudgetAlert = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const Budget_1 = __importDefault(require("../models/Budget"));
const Transaction_1 = __importDefault(require("../models/Transaction"));
const Notification_1 = __importDefault(require("../models/Notification"));
const initCheckBudgetAlert = () => {
    node_cron_1.default.schedule('0 8 * * *', async () => {
        // cron.schedule('*/1 * * * *', async () => {
        console.log(`[Cron] Check budget alert running at ${new Date().toLocaleString()}`);
        const budgets = await Budget_1.default.find();
        for (const budget of budgets) {
            const { user, month, year, amount, alertLevel } = budget;
            const start = new Date(year, month - 1, 1);
            const end = new Date(year, month, 1);
            const totalExpense = await Transaction_1.default.aggregate([
                {
                    $match: {
                        user,
                        type: 'expense',
                        date: { $gte: start, $lt: end }
                    }
                },
                {
                    $group: { _id: null, total: { $sum: "$amount" } },
                },
            ]);
            const spent = totalExpense[0].total || 0;
            const percentUsed = Math.round((spent / amount) * 100);
            console.log(`[Budget Alert DEBUG] user=${user}, spent=${spent}, used=${percentUsed}%, alertLevel=${alertLevel}`);
            const thresholds = [80, 90, 100];
            for (const threshold of thresholds) {
                if (percentUsed >= threshold && alertLevel < threshold) {
                    const message = `Bạn đã chi tiêu ${percentUsed}% ngân sách tháng ${month}/${year}. Hãy cân nhắn kiểm soát chi tiêu!`;
                    await Notification_1.default.create({
                        user,
                        type: 'budget_warning',
                        message
                    });
                    console.log(`[Budget Alert] Gửi thông báo cho user ${user}: ${message}`);
                    await Budget_1.default.updateOne({ _id: budget._id }, { $set: { alertLevel: threshold } });
                    break;
                }
            }
        }
    });
};
exports.initCheckBudgetAlert = initCheckBudgetAlert;
