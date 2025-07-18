import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { createTransaction, deleteTransaction, getTransactions, getTransactionsByMonth, getUsedCategories, updateTransaction } from "../controllers/transaction.controller";
import upload from "../middlewares/upload";

const router = Router();

router.use(requireAuth);

router.post(
  '/',
  requireAuth,
  upload.array('receiptImages', 5),  // 👈 Nhớ đúng tên key và giới hạn số ảnh
  createTransaction
);
router.get('/', getTransactions);
router.get('/by-month', getTransactionsByMonth);
router.put('/:id', upload.none(), updateTransaction);
router.delete('/:id', deleteTransaction);
router.get('/categories/used', getUsedCategories);

export default router;