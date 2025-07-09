import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/requireAuth';
import Transaction from '../models/Transaction';
import cloudinary from '../utils/cloudinary';
import { v4 as uuid } from 'uuid';
import { getLastDayOfMonth } from '../utils/getLastDayOfMonth';

// CREATE
export const createTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      amount,
      type,
      category,
      note,
      date,
      recurringDay,
      isRecurring
    } = req.body;

    // ✅ Upload ảnh lên Cloudinary nếu có
    let receiptImages: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      const uploadPromises = (req.files as Express.Multer.File[]).map(file => {
        const base64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
        return cloudinary.uploader.upload(base64, {
          folder: 'fintrack_receipts',
          public_id: `receipt-${uuid()}`
        });
      });

      const results = await Promise.all(uploadPromises);
      receiptImages = results.map(result => result.secure_url);
    }

    const isRecurringBool = isRecurring === 'true' || isRecurring === true;

    // ✅ Nếu là giao dịch định kỳ
    if (isRecurringBool) {
      if (!recurringDay || recurringDay < 1 || recurringDay > 31) {
        res.status(400).json({ message: "Ngày định kỳ (recurringDay) không hợp lệ" });
        return;
      }

      // 👉 Tạo bản mẫu không có date
      const templateTx = await Transaction.create({
        user: req.userId,
        amount,
        type,
        category,
        note,
        receiptImage: receiptImages,
        isRecurring: true,
        recurringDay,
        date: undefined
      });

      // 👉 Tạo bản thực tế tháng này
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth();
      const day = Math.min(+recurringDay, getLastDayOfMonth(year, month));

      const firstTx = await Transaction.create({
        user: req.userId,
        amount,
        type,
        category,
        note,
        receiptImage: receiptImages,
        isRecurring: true,
        recurringDay,
        date: new Date(year, month, day)
      });

      res.status(201).json({
        message: "Đã tạo giao dịch định kỳ và bản đầu tiên",
        template: templateTx,
        firstTransaction: firstTx
      });
      return;
    }

    // ✅ Nếu là giao dịch thông thường
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
      receiptImage: receiptImages,
      isRecurring: false,
      date
    });

    res.status(201).json({
      message: "Đã tạo giao dịch thành công",
      transaction: tx
    });

  } catch (error) {
    console.error("❌ Lỗi khi tạo giao dịch:", error);
    res.status(500).json({ message: "Không thể tạo giao dịch", error });
  }
};


// GET ALL
export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, type, category, keyword, month, year } = req.query;

    const filter: any = { user: req.userId };

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (keyword) filter.note = { $regex: keyword, $options: 'i' };

    // Xử lý lọc theo tháng và/hoặc năm
    if (month && year) {
      const start = new Date(Number(year), Number(month) - 1, 1);
      const end = new Date(Number(year), Number(month), 1);
      filter.date = { $gte: start, $lt: end };
    } else if (year && !month) {
      const start = new Date(Number(year), 0, 1);
      const end = new Date(Number(year) + 1, 0, 1);
      filter.date = { $gte: start, $lt: end };
    } else if (month && !year) {
      // Nếu chỉ có tháng, lấy tất cả các năm trong tháng đó (ít dùng nhưng vẫn hỗ trợ)
      const monthNumber = Number(month);
      filter.$expr = { $eq: [{ $month: "$date" }, monthNumber] };
    }

    const skip = (+page - 1) * +limit;

    const [transactions, total] = await Promise.all([
      Transaction.find(filter).sort({ date: -1 }).skip(skip).limit(+limit),
      Transaction.countDocuments(filter),
    ]);

    res.json({
      data: transactions,
      total,
      page: +page,
      totalPages: Math.ceil(total / +limit),
    });
  } catch (err) {
    res.status(500).json({ message: 'Không thể lấy danh sách!', error: err });
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