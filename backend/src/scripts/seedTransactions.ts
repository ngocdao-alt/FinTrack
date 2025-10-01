import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import Transaction from "../models/Transaction";

const userIds = [
  "68934eff325842444791f50c", "68934eff325842444791f50d", "68934eff325842444791f50e",
  "68934eff325842444791f50f", "68934eff325842444791f510", "68934eff325842444791f512",
  "68934eff325842444791f513", "68934eff325842444791f514", "68934eff325842444791f515",
  "68934eff325842444791f516", "68934eff325842444791f517", "68934eff325842444791f518",
  "68934eff325842444791f519", "68934eff325842444791f51a", "68934eff325842444791f51b",
  "68934eff325842444791f51c", "68934eff325842444791f51d", "68934eff325842444791f51e",
  "68934eff325842444791f51f", "68934eff325842444791f520", "68934eff325842444791f521",
];

const incomeCategories = ["salary", "bonus", "investment", "sales"];
const incomeNotes = ["Lương tháng", "Thưởng hiệu suất", "Lãi đầu tư", "Bán hàng cá nhân"];
const expenseCategories = ["food", "housing", "transportation", "education", "entertainment", "shopping", "health"];
const expenseNotes: any = {
  food: "Ăn uống linh tinh",
  housing: "Tiền nhà",
  transportation: "Đi lại",
  education: "Học phí",
  entertainment: "Xem phim, cafe",
  shopping: "Mua sắm",
  health: "Khám bệnh, thuốc men",
};

const getRandomAmount = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomDate = (year: number, month: number) => {
  const day = Math.floor(Math.random() * 28) + 1;
  return new Date(year, month, day);
};

const generateRandomTransactions = (year: number, month: number, userId: string) => {
  const transactions = [];
  const count = getRandomAmount(500, 1000);

  for (let i = 0; i < count; i++) {
    const isIncome = Math.random() < 0.3; // 30% là income, còn lại expense
    const date = getRandomDate(year, month);

    if (isIncome) {
      const idx = Math.floor(Math.random() * incomeCategories.length);
      transactions.push({
        user: userId,
        type: "income",
        amount: getRandomAmount(2000000, 10000000),
        category: incomeCategories[idx],
        note: incomeNotes[idx],
        date,
        isRecurring: false,
        receiptImage: "",
      });
    } else {
      const idx = Math.floor(Math.random() * expenseCategories.length);
      const category = expenseCategories[idx];
      transactions.push({
        user: userId,
        type: "expense",
        amount: getRandomAmount(100000, 3000000),
        category,
        note: expenseNotes[category],
        date,
        isRecurring: false,
        receiptImage: "",
      });
    }
  }

  return transactions;
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("✅ Đã kết nối MongoDB");

    const year = 2025;
    const monthsToSeed = [0, 2, 4]; // Tháng 1, 3, 5

    let totalTransactions = 0;

    for (const userId of userIds) {
      for (const month of monthsToSeed) {
        const transactions = generateRandomTransactions(year, month, userId);
        await Transaction.insertMany(transactions);
        console.log(`➕ ${transactions.length} giao dịch cho user ${userId} - Tháng ${month + 1}`);
        totalTransactions += transactions.length;
      }
    }

    console.log(`🎉 Tổng cộng đã tạo ${totalTransactions} giao dịch cho các tháng 1, 3, 5`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Lỗi khi seed giao dịch:", err);
    process.exit(1);
  }
};

seed();
