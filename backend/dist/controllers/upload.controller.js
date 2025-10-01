"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadReceiptImages = void 0;
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const uuid_1 = require("uuid");
const uploadReceiptImages = async (req, res) => {
    try {
        const files = req.files;
        if (!req.files || Array.isArray(req.files)) {
            res.status(400).json({ message: "Không có file đính kèm!" });
            return;
        }
        const uploadPromises = (files).map((file) => {
            const base64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
            return cloudinary_1.default.uploader.upload(base64, {
                folder: 'fintrack_receipts',
                public_id: `receipt-${(0, uuid_1.v4)()}`
            });
        });
        const results = await Promise.all(uploadPromises);
        const urls = results.map((result) => result.secure_url);
        res.json({ urls });
    }
    catch (error) {
        res.status(500).json({ message: "Upload thất bại!", error });
    }
};
exports.uploadReceiptImages = uploadReceiptImages;
