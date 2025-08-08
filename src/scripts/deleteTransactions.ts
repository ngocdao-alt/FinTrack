import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import Transaction from "../models/Transaction";

const deleteTransactionsInSpecificMonths = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("✅ Kết nối MongoDB thành công!");

    // Tạo điều kiện lọc các tháng 1, 3, 5 của năm hiện tại
    const year = new Date().getFullYear();

    const monthsToDelete = [0, 2, 4]; // Tháng 1, 3, 5
    const conditions = monthsToDelete.map((month) => {
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 1);
      return {
        date: { $gte: start, $lt: end },
      };
    });

    const result = await Transaction.deleteMany({
      $or: conditions,
    });

    console.log(`🗑️ Đã xoá ${result.deletedCount} giao dịch ở các tháng 1, 3, 5!`);
    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Lỗi khi xoá giao dịch:", err);
  }
};

deleteTransactionsInSpecificMonths();
