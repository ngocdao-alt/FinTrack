import { Response } from "express";
import { AuthRequest } from "../middlewares/requireAuth";
import Notification from "../models/Notification";
import { Types } from "mongoose";

export const getNotifications = async (req: AuthRequest, res: Response) => {
    try {
        const notifications = await Notification.find({ user: req.userId }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Không thể lấy thông báo', error });
    }
}

export const markNotificationAsRead = async (req: AuthRequest, res: Response):Promise<void> => {
    console.log("🔐 req.userId:", req.userId);
    try {
        const notificationId = req.params.id;

        if(!Types.ObjectId.isValid(notificationId)){
            res.status(400).json({message: "ID không hợp lệ!"});
            return;
        }

        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, user: req.userId },
            { isRead: true },
            { new: true },
        );

        if(!notification){
            res.status(400).json({ message: "Không tìm thấy thông báo "});
            return;
        }

        res.json(notification);
    } catch (error) {
        res.status(500).json({ message: 'Không thể đánh dấu đã đọc', error});
    }
};

export const deleteNotification = async (req: AuthRequest, res: Response):Promise<void> => {
    try {
        const notificationId = req.params.id;

        if(!Types.ObjectId.isValid(notificationId)){
            res.status(400).json({ message: "Id không hợp lệ" });
            return;
        }

        const result = await Notification.findOneAndDelete({
            _id: notificationId,
            user: req.userId
        })

        if (!result){
            res.status(400).json({ message: "Không tìm thấy thông báo" });
            return;
        }

        res.json({ id: notificationId, message: "Đã xóa thông báo thành công"});
    } catch (error) {
        res.status(500).json({ message: 'Không thể xóa thông báo', error});
    }
}