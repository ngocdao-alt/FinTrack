import Transaction from "../models/Transaction";
import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/requireAuth";

// CREATE
export const createTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { type, amount, category, note, date, receiptImage, isRecurring, recurringDay } = req.body;

        // Kiểm tra bắt buộc cho các giao dịch không định kỳ
        if (!isRecurring && !date) {
        res.status(400).json({ message: "Giao dịch thông thường yêu cầu ngày (date)" });
        return;
        }

        // Nếu là định kỳ nhưng không có recurringDay thì báo lỗi
        if (isRecurring && (!recurringDay || recurringDay < 1 || recurringDay > 31)) {
        res.status(400).json({ message: "Giao dịch định kỳ cần recurringDay hợp lệ (1–31)" });
        return;
        }

        const newTx = await Transaction.create({
            type,
            amount,
            category,
            note,
            date: isRecurring ? undefined : date,
            receiptImage,
            isRecurring,
            recurringDay,
            user: req.userId
        });

        res.status(201).json(newTx);
    } catch (err) {
        res.status(500).json({ message: "Không thể tạo giao dịch", error: err });
        console.log(err);
        
    }
}

// GET ALL
export const getTransactions = async (req: AuthRequest, res: Response) => {
    try {
        const { page = 1, limit = 10, type, category, keyword, month, year } = req.query;
        
        const filter: any = { user: req.userId };

        if(type) filter.type = type;
        if(category) filter.category = category;
        if(keyword) filter.note = { $regex: keyword, $options: "i"};

        if(month && year) {
            const start = new Date(`${year}-${month}-01`);
            const end = new Date(`${year}-${+month + 1}-01`);
            filter.date = { $gte: start, $lt: end};
        }

        const skip = (+page - 1)* +limit;

        const [transactions, total] = await Promise.all([
            Transaction.find(filter).sort({date: - 1}).skip(skip).limit(+limit),
            Transaction.countDocuments(filter),
        ]);

        res.json({
            data: transactions,
            total,
            page: +page,
            totalPages: Math.ceil(total / +limit)
        });
    } catch (err) {
        res.status(500).json({ message: "Không thể lấy danh sách!", error: err });
    }
};

// UPDATE
export const updateTransaction = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const tx = await Transaction.findOneAndUpdate(
            { _id: id, user: req.userId },
            req.body,
            { new: true }
        );
        if(!tx) {
            res.status(404).json({ message: "Giao dịch không tồn tại!" });
            return;
        }
        res.json(tx);
    } catch (error) {
        res.status(500).json({ message: "Không thể cập nhật!", error })
        console.log(error);
    }
}   

// DELETE
export const deleteTransaction = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const tx = await Transaction.findOneAndDelete({_id: id, user: req.userId});
        if(!tx) {
            res.status(404).json({ message: "Giao dịch không tồn tại!"});
            return;
        };
        res.json({ message: "Đã xóa giao dịch!" });
    } catch (error) {
        res.status(500).json({ message: "Không thể xóa giao dịch!", error});
        console.log(error);
    }
}

export const getUsedCategories = async (req: AuthRequest, res: Response) => {
    try {
        const categories = await Transaction.distinct("category", { user: req.userId });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: "Không thể lấy danh mục!", error});
    }   
}