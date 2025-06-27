import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { getNotifications } from "../controllers/notification.controller";

const router = Router();

router.get('/', requireAuth, getNotifications);

export default router;