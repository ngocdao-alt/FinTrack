import { Response } from "express";
import { AuthRequest } from "../middlewares/requireAuth";
import Notification from "../models/Notification";

export const getNotifications = async (req: AuthRequest, res: Response) => {
    try {
        const notifications = await Notification.find({ user: req.userId }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Không thể lấy thông báo', error });
    }
}