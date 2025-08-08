import cron from 'node-cron';
import dayjs from 'dayjs';
import Budget from '../models/Budget';
import Transaction from '../models/Transaction';
import Notification from '../models/Notification';

const checkBudgetAlert = async () => {
  const now = new Date();
  console.log(`[Cron] Kiểm tra ngân sách lúc ${now.toLocaleString()}`);

  const budgets = await Budget.find();

  for (const budget of budgets) {
    const { user, month, year, totalAmount, alertLevel = 0, categories } = budget;

    const start = dayjs(`${year}-${month}-01`).startOf('month').toDate();
    const end = dayjs(`${year}-${month}-01`).endOf('month').toDate();

    const transactions = await Transaction.find({
      user,
      type: 'expense',
      date: { $gte: start, $lte: end },
    });

    // === Tổng ngân sách ===
    const totalSpent = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    const totalPercentUsed = Math.round((totalSpent / totalAmount) * 100);
    const totalThresholds = [80, 90, 100];

    for (const threshold of totalThresholds) {
      if (totalPercentUsed >= threshold && alertLevel < threshold) {
        const message = `Bạn đã chi tiêu ${totalPercentUsed}% ngân sách tổng tháng ${month}/${year}.`;

        const existing = await Notification.findOne({ user, type: 'budget_warning', message });
        if (!existing) {
          await Notification.create({ user, type: 'budget_warning', message });
          console.log(`[Budget Alert] [TỔNG] user=${user}: ${message}`);
          await Budget.updateOne({ _id: budget._id }, { $set: { alertLevel: threshold } });
        }

        break; // chỉ gửi cảnh báo cao nhất
      }
    }

    // === Ngân sách theo danh mục ===
    const spentPerCategory: Record<string, number> = {};
    transactions.forEach(tx => {
      spentPerCategory[tx.category] = (spentPerCategory[tx.category] || 0) + tx.amount;
    });

    const updatedCategories = categories.map(cat => ({ ...cat }));
    const thresholds = [80, 90, 100];

    for (let i = 0; i < updatedCategories.length; i++) {
      const catBudget = updatedCategories[i];
      const spent = spentPerCategory[catBudget.category] || 0;
      const percentUsed = Math.round((spent / catBudget.amount) * 100);
      const oldAlertLevel = catBudget.alertLevel ?? 0;

      for (const threshold of thresholds) {
        if (percentUsed >= threshold && oldAlertLevel < threshold) {
          const message = `Bạn đã chi tiêu ${percentUsed}% ngân sách danh mục "${catBudget.category}" tháng ${month}/${year}.`;

          const existing = await Notification.findOne({ user, type: 'budget_category_warning', message });
          if (!existing) {
            await Notification.create({ user, type: 'budget_category_warning', message });
            console.log(`[Budget Category Alert] user=${user}: ${message}`);
            updatedCategories[i].alertLevel = threshold;
          }

          break;
        }
      }
    }

    // ✅ Cập nhật alertLevel mới cho tất cả danh mục
    await Budget.updateOne({ _id: budget._id }, { $set: { categories: updatedCategories } });
  }
};

export const initCheckBudgetAlert = () => {
  checkBudgetAlert();
  cron.schedule('30 0 * * *', checkBudgetAlert);
  // cron.schedule('*/1 * * * *', checkBudgetAlert); // dùng khi test
};
