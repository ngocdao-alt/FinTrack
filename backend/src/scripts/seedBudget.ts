import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import Budget from "../models/Budget";
import { Types } from "mongoose";

const userIds = [
  "68934eff325842444791f50c",
  "68934eff325842444791f50d",
  "68934eff325842444791f50e",
  "68934eff325842444791f50f",
  "68934eff325842444791f510",
  "68934eff325842444791f512",
  "68934eff325842444791f513",
  "68934eff325842444791f514",
  "68934eff325842444791f515",
  "68934eff325842444791f516",
  "68934eff325842444791f517",
  "68934eff325842444791f518",
  "68934eff325842444791f519",
  "68934eff325842444791f51a",
  "68934eff325842444791f51b",
  "68934eff325842444791f51c",
  "68934eff325842444791f51d",
  "68934eff325842444791f51e",
  "68934eff325842444791f51f",
  "68934eff325842444791f520",
  "68934eff325842444791f521",
];

// Danh mục ngân sách
const categories = [
  { key: "housing", amount: 6000000 },
  { key: "food", amount: 3000000 },
  { key: "transportation", amount: 2000000 },
  { key: "education", amount: 2000000 },
  { key: "investment", amount: 3000000 },
  { key: "entertainment", amount: 2000000 },
  { key: "shopping", amount: 1000000 },
  { key: "health", amount: 1000000 },
];

const generateBudgetsForUser = (userId: string) => {
  const budgets = [];

  for (let month = 6; month <= 8; month++) {
    const categoriesList = categories.map((cat) => ({
      category: cat.key,
      amount: cat.amount,
      alertLevel: 0,
    }));

    const totalAmount = categories.reduce((sum, c) => sum + c.amount, 0);

    budgets.push({
      user: new Types.ObjectId(userId),
      month,
      year: 2025,
      totalAmount,
      categories: categoriesList,
      alertLevel: 0,
    });
  }

  return budgets;
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("✅ Đã kết nối MongoDB");

    const allBudgets = [];

    for (const userId of userIds) {
      const userBudgets = generateBudgetsForUser(userId);
      allBudgets.push(...userBudgets);
    }

    await Budget.insertMany(allBudgets);
    console.log(`✅ Đã tạo ${allBudgets.length} ngân sách cho tháng 6–8 cho ${userIds.length} user`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Lỗi khi seed ngân sách:", err);
    process.exit(1);
  }
};

seed();
