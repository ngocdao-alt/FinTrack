"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNotification = exports.markNotificationAsRead = exports.getNotifications = void 0;
const Notification_1 = __importDefault(require("../models/Notification"));
const mongoose_1 = require("mongoose");
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification_1.default.find({ user: req.userId }).sort({ createdAt: -1 });
        res.json(notifications);
    }
    catch (error) {
        res.status(500).json({ message: 'Không thể lấy thông báo', error });
    }
};
exports.getNotifications = getNotifications;
const markNotificationAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id;
        if (!mongoose_1.Types.ObjectId.isValid(notificationId)) {
            res.status(400).json({ message: "ID không hợp lệ!" });
            return;
        }
        const notification = await Notification_1.default.findOneAndUpdate({ _id: notificationId, user: req.userId }, { isRead: true }, { new: true });
        if (!notification) {
            res.status(400).json({ message: "Không tìm thấy thông báo " });
            return;
        }
        res.json(notification);
    }
    catch (error) {
        res.status(500).json({ message: 'Không thể đánh dấu đã đọc', error });
    }
};
exports.markNotificationAsRead = markNotificationAsRead;
const deleteNotification = async (req, res) => {
    try {
        const notificationId = req.params.id;
        if (!mongoose_1.Types.ObjectId.isValid(notificationId)) {
            res.status(400).json({ message: "Id không hợp lệ" });
            return;
        }
        const result = await Notification_1.default.findOneAndDelete({
            _id: notificationId,
            user: req.userId
        });
        if (!result) {
            res.status(400).json({ message: "Không tìm thấy thông báo" });
            return;
        }
        res.json({ message: "Đã xóa thông báo thành công" });
    }
    catch (error) {
        res.status(500).json({ message: 'Không thể xóa thông báo', error });
    }
};
exports.deleteNotification = deleteNotification;
