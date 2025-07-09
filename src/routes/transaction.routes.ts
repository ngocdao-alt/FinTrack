import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { createTransaction, deleteTransaction, getTransactions, getUsedCategories, updateTransaction } from "../controllers/transaction.controller";
import upload from "../middlewares/upload";

const router = Router();

router.use(requireAuth);

router.post('/', upload.none(), createTransaction);
router.get('/', getTransactions);
router.put('/:id', upload.none(), updateTransaction);
router.delete('/:id', deleteTransaction);
router.get('/categories/used', getUsedCategories);

export default router;