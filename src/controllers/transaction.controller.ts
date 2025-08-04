import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/requireAuth';
import Transaction from '../models/Transaction';
import cloudinary from '../utils/cloudinary';
import { v4 as uuid } from 'uuid';
import { getLastDayOfMonth } from '../utils/getLastDayOfMonth';
import { logAction } from '../utils/logAction';

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

    if (isRecurringBool) {
      if (!recurringDay || recurringDay < 1 || recurringDay > 31) {
        res.status(400).json({ message: "Ngày định kỳ (recurringDay) không hợp lệ" });
        return;
      }

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
        date: new Date(date)
      });

      await logAction(req, {
        action: "Create Recurring Transaction",
        statusCode: 201,
        description: `Tạo giao dịch định kỳ ngày ${recurringDay}`
      });

      res.status(201).json({
        message: "Đã tạo giao dịch định kỳ và bản đầu tiên",
        template: templateTx,
        firstTransaction: firstTx
      });
      return;
    }

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

    await logAction(req, {
      action: "Create Transaction",
      statusCode: 201,
      description: `Tạo giao dịch thường ${type} - ${category}`
    });

    res.status(201).json({
      message: "Đã tạo giao dịch thành công",
      transaction: tx
    });

  } catch (error) {
    console.error("❌ Lỗi khi tạo giao dịch:", error);

    await logAction(req, {
      action: "Create Transaction",
      statusCode: 500,
      description: "Lỗi khi tạo giao dịch",
      level: "error"
    });

    res.status(500).json({ message: "Không thể tạo giao dịch", error });
  }
};


// GET ALL
export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, type, category, keyword, month, year, specificDate } = req.query;

    const filter: any = { user: req.userId };

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (keyword) filter.note = { $regex: keyword, $options: 'i' };

    // Xử lý lọc theo tháng và/hoặc năm
    if (specificDate) {
      const date = new Date(specificDate as string);
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);
      filter.date = { $gte: date, $lt: nextDate };
    } else if (month && year) {
      const start = new Date(Number(year), Number(month) - 1, 1);
      const end = new Date(Number(year), Number(month), 1);
      filter.date = { $gte: start, $lt: end };
    } else if (year) {
      const start = new Date(Number(year), 0, 1);
      const end = new Date(Number(year) + 1, 0, 1);
      filter.date = { $gte: start, $lt: end };
    } else if (month) {
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

export const getTransactionsByMonth = async (req: AuthRequest, res: Response) => {
  try {
    const { month, year } = req.query;

    // Ép kiểu an toàn hơn
    const monthNum = Number(month);
    const yearNum = Number(year);

    // Bắt buộc phải có cả tháng và năm để lọc cho chính xác
    if (!month || !year || isNaN(monthNum) || isNaN(yearNum)) {
      res.status(400).json({ message: 'Thiếu hoặc sai định dạng month/year' });
      return;
    }

    const startOfMonth = new Date(yearNum, monthNum - 1, 1);
    const endOfMonth = new Date(yearNum, monthNum, 1); // đầu tháng sau

    const filter = {
      user: req.userId,
      date: { $gte: startOfMonth, $lt: endOfMonth },
    };

    const transactions = await Transaction.find(filter).sort({ date: 1 }); // sort tăng dần để thống kê đẹp hơn

    res.json({
      data: transactions,
      total: transactions.length,
      page: 1,
      totalPage: 1,
    });

  } catch (err) {
    console.error('[getTransactionsByMonth]', err);
    res.status(500).json({ message: 'Không thể lấy danh sách giao dịch!', error: err });
  }
}


// UPDATE
export const updateTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const tx = await Transaction.findOneAndUpdate(
      { _id: id, user: req.userId },
      req.body,
      { new: true }
    );

    if (!tx) {
      res.status(404).json({ message: "Giao dịch không tồn tại!" });
      return;
    }

    await logAction(req, {
      action: "Update Transaction",
      statusCode: 200,
      description: `Đã cập nhật giao dịch ID: ${id}`
    });

    res.json(tx);
  } catch (error) {
    console.log(error);

    await logAction(req, {
      action: "Update Transaction",
      statusCode: 500,
      description: "Lỗi khi cập nhật giao dịch",
      level: "error"
    });

    res.status(500).json({ message: "Không thể cập nhật!", error });
  }
};


// DELETE
export const deleteTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const tx = await Transaction.findOneAndDelete({ _id: id, user: req.userId });

    if (!tx) {
      res.status(404).json({ message: "Giao dịch không tồn tại!" });
      return;
    }

    await logAction(req, {
      action: "Delete Transaction",
      statusCode: 200,
      description: `Đã xoá giao dịch ID: ${id}`
    });

    res.json({ message: "Đã xóa giao dịch!" });
  } catch (error) {
    console.log(error);

    await logAction(req, {
      action: "Delete Transaction",
      statusCode: 500,
      description: "Lỗi khi xoá giao dịch",
      level: "error"
    });

    res.status(500).json({ message: "Không thể xóa giao dịch!", error });
  }
};

export const getUsedCategories = async (req: AuthRequest, res: Response) => {
    try {
        const categories = await Transaction.distinct("category", { user: req.userId });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: "Không thể lấy danh mục!", error});
    }   
}