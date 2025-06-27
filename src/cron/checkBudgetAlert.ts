import cron from 'node-cron';
import Budget from '../models/Budget';
import Transaction from '../models/Transaction';
import Notification from '../models/Notification';

export const initCheckBudgetAlert = () => {
    cron.schedule('0 8 * * *', async () => {
        const budgets = await Budget.find();

        for (const budget of budgets){
            const { user, month, year, amount, alertLevel } = budget;

            const start = new Date(year, month - 1, 1);
            const end = new Date(year, month -1 );

            const totalExpense = await Transaction.aggregate([
                {
                    $match: {
                        user,
                        type: 'expense',
                        date: { $gte: start, $lt: end }
                    }
                },
                {
                    $group: {_id: null, total: { $sum: amount }},
                },
            ]);

            const spent = totalExpense[0].total || 0;
            const percentUsed = Math.round((spent / amount) * 100);

            const thresholds = [80, 90, 100];

            for (const threshold of thresholds) {
                if (percentUsed >= threshold && alertLevel < threshold) {
                    const message = `Bạn đã chi tiêu ${percentUsed}% ngân sách tháng ${month}/${year}. Hãy cân nhắn kiểm soát chi tiêu!`;

                    await Notification.create({
                        user,
                        type: 'budget_warning',
                        message
                    })

                    console.log(`[Budget Alert] Gửi thông báo cho user ${user}: ${message}`);

                    await Budget.updateOne(
                        { _id: budget._id },
                        { $set: {alertLevel: threshold} }
                    );

                    break;
                }
            }
        }
    })
}