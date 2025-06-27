import cron from 'node-cron';
import Transaction from '../models/Transaction';
import { getLastDayOfMonth } from '../utils/getLastDayOfMonth';

export const initRecurringTransactionJob = () => {
    // Chạy lúc 0:30 mỗi ngày
    cron.schedule("30 0 * * *", async () => {
  console.log(`[Recurring] Cron chạy lúc: ${new Date().toISOString()}`);

  const now = new Date();
  const today = now.getDate();
  const month = now.getMonth();
  const year = now.getFullYear();

  const recurringTransactions = await Transaction.find({
    isRecurring: true,
    recurringDay: { $lte: 31 }
  });

  console.log(`[Recurring] Tổng giao dịch định kỳ: ${recurringTransactions.length}`);

  for (const tx of recurringTransactions) {
    const triggerDay = Math.min(tx.recurringDay as number, getLastDayOfMonth(year, month));
    console.log(`[Recurring] TX: ${tx.note} | recurringDay=${tx.recurringDay} | triggerDay=${triggerDay} | hôm nay=${today}`);

    if (triggerDay !== today) {
      console.log(`[Recurring] Bỏ qua: ${tx.note} vì hôm nay không phải ngày thực thi`);
      continue;
    }

    const exists = await Transaction.findOne({
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

    await Transaction.create({
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
}