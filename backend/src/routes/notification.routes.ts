import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { deleteNotification, getNotifications, markNotificationAsRead } from "../controllers/notification.controller";

const router = Router();

router.use(requireAuth);

router.get('/', getNotifications);
router.patch('/:id/read', markNotificationAsRead);
router.delete('/:id', deleteNotification);

export default router;