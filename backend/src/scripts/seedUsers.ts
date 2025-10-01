import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import User from '../models/User';

dotenv.config();

const TOTAL_USERS = 100;
const ADMIN_COUNT = 10;
const USER_COUNT = TOTAL_USERS - ADMIN_COUNT;

const generateUsers = async () => {
  const users = [];

  for (let i = 0; i < TOTAL_USERS; i++) {
    const role = i < ADMIN_COUNT ? "admin" : "user";
    const name = faker.person.fullName();
    const email = faker.internet.email({ firstName: name.split(" ")[0] }).toLowerCase();
    const password = await bcrypt.hash("123456", 10); // Dùng password chung cho tất cả
    const avatarUrl = faker.image.avatar();
    const dob = faker.date.birthdate({
        mode: "year",
        min: 1980,
        max: 2005,
    }).toISOString().split("T")[0];
    const phone = faker.phone.number("+84 9## ### ###" as any);
    const address = faker.location.city() + ", Việt Nam";

    users.push({
      name,
      email,
      password,
      role,
      avatarUrl,
      dob,
      phone,
      address,
      isBanned: false,
    });
  }

  return users;
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("✅ Đã kết nối MongoDB");

    // ❌ Không xoá user cũ

    const users = await generateUsers();
    await User.insertMany(users);
    console.log(`✅ Đã thêm ${users.length} user mới (10 admin, 90 user)`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Lỗi khi seed user:", err);
    process.exit(1);
  }
};

seed();
