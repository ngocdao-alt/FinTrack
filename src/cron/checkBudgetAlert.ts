import cron from 'node-cron';
import dayjs from 'dayjs';
import Budget from '../models/Budget';
import Transaction from '../models/Transaction';
import Notification from '../models/Notification';

export const initCheckBudgetAlert = () => {
  cron.schedule('0 8 * * *', async () => {
    console.log(`[Cron] Check budget alert running at ${new Date().toLocaleString()}`);

    const budgets = await Budget.find();

    for (const budget of budgets) {
      const { user, month, year, totalAmount, alertLevel, categories } = budget;

      const start = dayjs(`${year}-${month}-01`).startOf('month').toDate();
      const end = dayjs(`${year}-${month}-01`).endOf('month').toDate();

      const transactions = await Transaction.find({
        user,
        type: 'expense',
        date: { $gte: start, $lte: end },
      });

      // ======= 1️⃣ Kiểm tra Ngân sách Tổng =======
      const totalSpent = transactions.reduce((sum, tx) => sum + tx.amount, 0);
      const totalPercentUsed = Math.round((totalSpent / totalAmount) * 100);

      const totalThresholds = [80, 90, 100];

      for (const threshold of totalThresholds) {
        if (totalPercentUsed >= threshold && (alertLevel ?? 0) < threshold) {
          const message = `Bạn đã chi tiêu ${totalPercentUsed}% ngân sách tổng tháng ${month}/${year}.`;

          await Notification.create({
            user,
            type: 'budget_warning',
            message
          });

          console.log(`[Budget Alert] Gửi cảnh báo TỔNG cho user ${user}: ${message}`);

          await Budget.updateOne({ _id: budget._id }, { $set: { alertLevel: threshold } });
          break;  // Chỉ gửi 1 cảnh báo cao nhất
        }
      }

      // ======= 2️⃣ Kiểm tra từng Danh mục =======
      const spentPerCategory: Record<string, number> = {};
      transactions.forEach(tx => {
        if (!spentPerCategory[tx.category]) spentPerCategory[tx.category] = 0;
        spentPerCategory[tx.category] += tx.amount;
      });

      for (const catBudget of categories) {
        const spent = spentPerCategory[catBudget.category] || 0;
        const percentUsed = Math.round((spent / catBudget.amount) * 100);

        if (percentUsed >= 100) {
          const message = `Bạn đã vượt ngân sách danh mục "${catBudget.category}" tháng ${month}/${year}.`;

          const exists = await Notification.findOne({
            user,
            type: 'budget_category_warning',
            message
          });

          if (!exists) {
            await Notification.create({
              user,
              type: 'budget_category_warning',
              message
            });

            console.log(`[Budget Category Alert] Gửi cảnh báo DANH MỤC cho user ${user}: ${message}`);
          }
        }
      }
    }
  });
};
