import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import Transaction from "../models/Transaction";

const userId = "685a45e4894c77a424207c66"; // 👈 Thay bằng userId thật nếu cần

const budgetByCategory: Record<string, number> = {
  "Nhà cửa": 6000000,
  "Ăn uống": 3000000,
  "Di chuyển": 2000000,
  "Giáo dục": 2000000,
  "Đầu tư": 2000000,
  "Giải trí": 3000000,
};

const notes: Record<string, string> = {
  "Nhà cửa": "Tiền nhà tháng 8",
  "Ăn uống": "Ăn uống hàng ngày",
  "Di chuyển": "Đi lại, xăng xe",
  "Giáo dục": "Học phí hoặc sách vở",
  "Đầu tư": "Đầu tư cổ phiếu",
  "Giải trí": "Xem phim, cafe",
};

const incomeCategories = ["Lương", "Thưởng", "Đầu tư", "Bán hàng"];
const incomeNotes = ["Lương tháng", "Thưởng hiệu suất", "Lãi cổ phiếu", "Bán đồ cũ"];

const generateAugustTransactions = () => {
  const transactions = [];
  const year = 2025;
  const month = 7; // August (0-index)

  let totalExpense = 0;

  // Tạo expense từ từng hạng mục budget
  for (const category in budgetByCategory) {
    const budget = budgetByCategory[category];
    const targetExpense = Math.floor(budget * (0.8 + Math.random() * 0.2)); // 80–100%
    totalExpense += targetExpense;

    let remaining = targetExpense;

    while (remaining > 0) {
      const amount = Math.min(
        remaining,
        Math.floor(Math.random() * 1000000) + 100000 // mỗi giao dịch nhỏ hơn 1 triệu
      );
      const day = Math.floor(Math.random() * 28) + 1;
      const date = new Date(year, month, day);

      transactions.push({
        user: userId,
        type: "expense",
        amount,
        category,
        note: notes[category],
        date,
        isRecurring: false,
        receiptImage: "",
      });

      remaining -= amount;
    }
  }

  // Tạo income sao cho tổng > 120% expense
  const minIncome = Math.ceil(totalExpense * 1.2);
  let currentIncome = 0;

  while (currentIncome < minIncome) {
    const amount = Math.floor(Math.random() * 5000000) + 3000000;
    const day = Math.floor(Math.random() * 28) + 1;
    const categoryIndex = Math.floor(Math.random() * incomeCategories.length);
    const date = new Date(year, month, day);

    transactions.push({
      user: userId,
      type: "income",
      amount,
      category: incomeCategories[categoryIndex],
      note: incomeNotes[categoryIndex],
      date,
      isRecurring: false,
      receiptImage: "",
    });

    currentIncome += amount;
  }

  return transactions;
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("✅ Kết nối MongoDB OK");

    const start = new Date(2025, 7, 1);
    const end = new Date(2025, 8, 1);

    await Transaction.deleteMany({
      user: userId,
      date: { $gte: start, $lt: end },
    });

    console.log("🗑️ Xoá giao dịch tháng 8 cũ");

    const transactions = generateAugustTransactions();
    await Transaction.insertMany(transactions);
    console.log(`✅ Tạo ${transactions.length} giao dịch tháng 8`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Lỗi seed:", err);
    process.exit(1);
  }
};

seed();
