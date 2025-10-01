"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const recurringJob_1 = require("./cron/recurringJob");
const checkBudgetAlert_1 = require("./cron/checkBudgetAlert");
const PORT = process.env.PORT || 5000;
(0, recurringJob_1.initRecurringTransactionJob)();
(0, checkBudgetAlert_1.initCheckBudgetAlert)();
const startServer = async () => {
    console.log(process.env.MONGODB_URI);
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log("✅ Connected to MongoDB");
        app_1.default.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.log("❌ MongoDB connection error:", error);
    }
};
startServer();
