import { AuthRequest } from "../middlewares/requireAuth";
import { Request, Response } from 'express';
import Transaction from "../models/Transaction";

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
    try {
        const { month, year } = req.query;
        const filter: any = { user: req.userId };

        console.log("User ID:", req.userId);
        console.log("Filter:", filter);

        if(month && year){
            const monthNum = parseInt(month as string, 10);
            const yearNum = parseInt(year as string, 10);
            const start = new Date(Date.UTC(yearNum, monthNum - 1, 1)); 
            const end = new Date(Date.UTC(yearNum, monthNum, 1));       
            filter.date =  { $gte: start, $lt: end};
        }

        const transactions = await Transaction.find(filter);

        let totalIncome = 0;
        let totalExpense = 0;

        transactions.forEach((tx) => {
            if(tx.type === 'income') totalIncome += tx.amount;
            else totalExpense += tx.amount;
        });

        const balance = totalIncome - totalExpense;

        res.json({ totalIncome, totalExpense, balance });
    } catch (error) {
        res.status(500).json({ message: "Không thể lấy thống kê", error});
    }
}