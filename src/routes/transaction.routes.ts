import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { createTransaction, deleteTransaction, getTransactions, getUsedCategories, updateTransaction } from "../controllers/transaction.controller";

const router = Router();

router.use(requireAuth);

router.post('/', createTransaction);
router.get('/', getTransactions);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);
router.get('/categories/used', getUsedCategories);

export default router;