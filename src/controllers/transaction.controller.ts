import Transaction from "../models/Transaction";
import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/requireAuth";
import { getLastDayOfMonth } from "../utils/getLastDayOfMonth";

// CREATE
export const createTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { amount, type, category, note, receiptImage, date, isRecurring, recurringDay } = req.body;

    // Trường hợp GIAO DỊCH ĐỊNH KỲ
    if (isRecurring) {
      // Validate
      if (!recurringDay || recurringDay < 1 || recurringDay > 31) {
        res.status(400).json({ message: "Ngày định kỳ (recurringDay) không hợp lệ" });
        return;
      }

      // Tạo bản mẫu (không có date)
      const templateTx = await Transaction.create({
        user: req.userId,
        amount,
        type,
        category,
        note,
        receiptImage,
        isRecurring: true,
        recurringDay,
        date: undefined,
      });

      // Tạo bản đầu tiên có date
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth();
      const day = Math.min(recurringDay, getLastDayOfMonth(year, month));

      const firstTx = await Transaction.create({
        user: req.userId,
        amount,
        type,
        category,
        note,
        receiptImage,
        isRecurring: true,
        recurringDay,
        date: new Date(year, month, day),
      });

      res.status(201).json({
        message: "Đã tạo giao dịch định kỳ và bản đầu tiên thành công",
        template: templateTx,
        firstTransaction: firstTx,
      });
    }

    // Trường hợp GIAO DỊCH THÔNG THƯỜNG
    if (!date) {
      res.status(400).json({ message: "Giao dịch thường cần trường `date`" });
      return;
    }

    const tx = await Transaction.create({
      user: req.userId,
      amount,
      type,
      category,
      note,
      receiptImage,
      isRecurring: false,
      date,
    });

    res.status(201).json({
      message: "Đã tạo giao dịch thành công",
      transaction: tx,
    });
  } catch (error) {
    console.error("Lỗi khi tạo giao dịch:", error);
    res.status(500).json({ message: "Không thể tạo giao dịch", error });
  }
};

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