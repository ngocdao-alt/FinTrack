import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Transaction from '../models/Transaction';

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI!
const userId = '685a45e4894c77a424207c66'; // 👉 Thay bằng UserId của bạn

const expenseCategories = ['Ăn uống', 'Giải trí', 'Mua sắm', 'Di chuyển', 'Sức khỏe', 'Thuê nhà', 'Giáo dục'];
const expenseNotes = ['Mua cà phê', 'Xem phim', 'Mua áo quần', 'Đi taxi', 'Khám sức khỏe', 'Trả tiền thuê nhà', 'Học phí'];

const incomeCategories = ['Lương', 'Thưởng', 'Đầu tư', 'Bán hàng'];
const incomeNotes = ['Lương tháng', 'Thưởng KPI', 'Lãi cổ phiếu', 'Bán đồ cũ'];

const generateBalancedTransactions = () => {
  const transactions = [];

  for (let month = 0; month < 6; month++) {  // Tháng 1 → Tháng 6
    const year = 2025;

    const numExpense = Math.floor(Math.random() * 5) + 3; // 3–7 chi tiêu
    const numIncome = Math.floor(Math.random() * 2) + 1;  // 1–2 thu nhập

    let totalExpense = 0;
    let totalIncome = 0;

    // 👉 Tạo chi tiêu
    for (let i = 0; i < numExpense; i++) {
      const day = Math.floor(Math.random() * 28) + 1;
      const categoryIndex = Math.floor(Math.random() * expenseCategories.length);
      const amount = Math.floor(Math.random() * 2000000) + 50000; // 50k–2tr
      const date = new Date(year, month, day);

      totalExpense += amount;

      transactions.push({
        user: userId,
        type: 'expense',
        amount,
        category: expenseCategories[categoryIndex],
        note: expenseNotes[categoryIndex],
        date,
        isRecurring: false,
        receiptImage: '',
      });
    }

    // 👉 Tạo thu nhập sao cho tổng thu > tổng chi ít nhất 20%
    const minIncomeNeeded = Math.ceil(totalExpense * 1.2);
    let currentIncome = 0;

    while (currentIncome < minIncomeNeeded) {
      const day = Math.floor(Math.random() * 28) + 1;
      const categoryIndex = Math.floor(Math.random() * incomeCategories.length);
      const amount = Math.floor(Math.random() * 5000000) + 3000000;  // 3tr–8tr
      const date = new Date(year, month, day);

      currentIncome += amount;

      transactions.push({
        user: userId,
        type: 'income',
        amount,
        category: incomeCategories[categoryIndex],
        note: incomeNotes[categoryIndex],
        date,
        isRecurring: false,
        receiptImage: '',
      });
    }
  }

  return transactions;
};

const seed = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Kết nối MongoDB thành công');

    await Transaction.deleteMany({ user: userId });
    console.log('🗑️ Đã xoá toàn bộ giao dịch cũ');

    const transactions = generateBalancedTransactions();

    await Transaction.insertMany(transactions);
    console.log(`✅ Đã tạo ${transactions.length} giao dịch giả (thu > chi) từ tháng 1 đến tháng 6`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi seed dữ liệu:', err);
    process.exit(1);
  }
};

seed();
