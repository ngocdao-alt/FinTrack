"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = void 0;
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const User_1 = __importDefault(require("../models/User"));
const updateProfile = async (req, res) => {
    try {
        console.log(req.file);
        const { name } = req.body;
        let avatarUrl = "";
        if (req.file) {
            const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
            const uploadResult = await cloudinary_1.default.uploader.upload(base64, {
                folder: "fintrack_avatars",
                public_id: `avatar-${req.userId}`,
                overwrite: true
            });
            avatarUrl = uploadResult.secure_url;
            console.log(avatarUrl);
        }
        const updateFields = {};
        if (name)
            updateFields.name = name;
        if (avatarUrl)
            updateFields.avatarUrl = avatarUrl;
        const updatedUser = await User_1.default.findByIdAndUpdate(req.userId, { $set: updateFields }, { new: true }).select("-password");
        res.json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ message: "Không thể cập nhật hồ sơ", error });
    }
};
exports.updateProfile = updateProfile;
