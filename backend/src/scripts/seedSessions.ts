import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import { SessionModel } from "../models/Session";

const userIds = [
  "68934eff325842444791f50c", "68934eff325842444791f50d", "68934eff325842444791f50e",
  "68934eff325842444791f50f", "68934eff325842444791f510", "68934eff325842444791f512",
  "68934eff325842444791f513", "68934eff325842444791f514", "68934eff325842444791f515",
  "68934eff325842444791f516", "68934eff325842444791f517", "68934eff325842444791f518",
  "68934eff325842444791f519", "68934eff325842444791f51a", "68934eff325842444791f51b",
  "68934eff325842444791f51c", "68934eff325842444791f51d", "68934eff325842444791f51e",
  "68934eff325842444791f51f", "68934eff325842444791f520", "68934eff325842444791f521",
];

// 🔧 Tạo ngày login random trong tháng 8
const getRandomLoginDate = (year: number, month: number) => {
  const day = Math.floor(Math.random() * 28) + 1;
  const hour = Math.floor(Math.random() * 24);
  const minute = Math.floor(Math.random() * 60);
  return new Date(year, month, day, hour, minute);
};

// 🔧 Tạo danh sách session cho user trong tháng 8
const generateSessionsForUser = (userId: string, year: number, month: number) => {
  const sessions = [];
  const sessionCount = Math.floor(Math.random() * 30) + 20; // 20–50 session

  for (let i = 0; i < sessionCount; i++) {
    const loginAt = getRandomLoginDate(year, month);
    const durationInSeconds = Math.floor(Math.random() * 3 * 60 * 60) + 5 * 60; // 5 phút - 3 giờ
    const logoutAt = new Date(loginAt.getTime() + durationInSeconds * 1000);

    sessions.push({
      userId,
      loginAt,
      logoutAt,
      duration: durationInSeconds,
    });
  }

  return sessions;
};

const seedAugustSessions = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("✅ Kết nối MongoDB thành công!");

    const year = 2025;
    const month = 7; // tháng 8

    let total = 0;

    for (const userId of userIds) {
      const sessions = generateSessionsForUser(userId, year, month);
      await SessionModel.insertMany(sessions);
      console.log(`➕ Seed ${sessions.length} sessions cho user ${userId}`);
      total += sessions.length;
    }

    console.log(`🎯 Tổng cộng đã seed ${total} session cho tháng 8`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi seed session:", error);
    process.exit(1);
  }
};

seedAugustSessions();
