import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

import app from './app'
import { initRecurringTransactionJob } from './cron/recurringJob';
import { initCheckBudgetAlert } from './cron/checkBudgetAlert';

const PORT = process.env.PORT;

initRecurringTransactionJob();
initCheckBudgetAlert();

const startServer = async () => {
    console.log(process.env.MONGODB_URI);
    
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("✅ Connected to MongoDB");
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`)
        })
    } catch (error) {
        console.log("❌ MongoDB connection error:", error);
    }
};

startServer();
