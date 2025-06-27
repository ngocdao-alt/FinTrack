import { Response } from "express";
import { AuthRequest } from "../middlewares/requireAuth";
import cloudinary from "../utils/cloudinary";
import User from "../models/User";


export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        console.log(req.file);
        
        const { name } = req.body;
        let avatarUrl = "";

        if(req.file){
            const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
            const uploadResult = await cloudinary.uploader.upload(base64, {
                folder: "fintrack_avatars",
                public_id: `avatar-${req.userId}`,
                overwrite: true
            });
            avatarUrl = uploadResult.secure_url;
            console.log(avatarUrl);
        }

        const updateFields: any = {};
        if (name) updateFields.name = name;
        if (avatarUrl) updateFields.avatarUrl = avatarUrl;

        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            { $set: updateFields},
            { new: true }
        ).select("-password");

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Không thể cập nhật hồ sơ", error });
    }
};