import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { getMonthlyBudget, setOrUpdateBudget } from "../controllers/budget.controller";

const router = Router();

router.use(requireAuth);

router.post('/', setOrUpdateBudget);
router.get('/', getMonthlyBudget);

export default router;

