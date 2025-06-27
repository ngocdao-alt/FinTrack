import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { getCategoryExpenseStats } from "../controllers/stat.controller";

const router = Router();

router.get('/category-expense', requireAuth, getCategoryExpenseStats);

export default router;