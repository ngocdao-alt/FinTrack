"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initRecurringTransactionJob = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const Transaction_1 = __importDefault(require("../models/Transaction"));
const getLastDayOfMonth_1 = require("../utils/getLastDayOfMonth");
const initRecurringTransactionJob = () => {
    // Chạy lúc 0:30 mỗi ngày
    node_cron_1.default.schedule("30 0 * * *", async () => {
        console.log(`[Recurring] Cron chạy lúc: ${new Date().toISOString()}`);
        const now = new Date();
        const today = now.getDate();
        const month = now.getMonth();
        const year = now.getFullYear();
        const recurringTransactions = await Transaction_1.default.find({
            isRecurring: true,
            recurringDay: { $lte: 31 }
        });
        console.log(`[Recurring] Tổng giao dịch định kỳ: ${recurringTransactions.length}`);
        for (const tx of recurringTransactions) {
            const triggerDay = Math.min(tx.recurringDay, (0, getLastDayOfMonth_1.getLastDayOfMonth)(year, month));
            console.log(`[Recurring] TX: ${tx.note} | recurringDay=${tx.recurringDay} | triggerDay=${triggerDay} | hôm nay=${today}`);
            if (triggerDay !== today) {
                console.log(`[Recurring] Bỏ qua: ${tx.note} vì hôm nay không phải ngày thực thi`);
                continue;
            }
            const exists = await Transaction_1.default.findOne({
                user: tx.user,
                amount: tx.amount,
                type: tx.type,
                category: tx.category,
                isRecurring: true,
                date: {
                    $gte: new Date(year, month, 1),
                    $lt: new Date(year, month + 1, 1),
                },
            });
            if (exists) {
                console.log(`[Recurring] Bỏ qua: ${tx.note} vì đã tồn tại trong tháng`);
                continue;
            }
            await Transaction_1.default.create({
                user: tx.user,
                amount: tx.amount,
                type: tx.type,
                note: tx.note,
                category: tx.category,
                isRecurring: true,
                recurringDay: tx.recurringDay,
                date: new Date(year, month, triggerDay),
            });
            console.log(`[Recurring] ĐÃ THÊM: ${tx.note} vào ${triggerDay}/${month + 1}`);
        }
    });
};
exports.initRecurringTransactionJob = initRecurringTransactionJob;
