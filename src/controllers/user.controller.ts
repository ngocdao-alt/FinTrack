import { Response } from "express";
import { AuthRequest } from "../middlewares/requireAuth";
import cloudinary from "../utils/cloudinary";
import User from "../models/User";

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, dob, phone, address } = req.body;
    let avatarUrl = "";

    // Nếu có ảnh mới được upload
    if (req.file) {
      const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      const uploadResult = await cloudinary.uploader.upload(base64, {
        folder: "fintrack_avatars",
        public_id: `avatar-${req.userId}`,
        overwrite: true,
      });
      avatarUrl = uploadResult.secure_url;
    }

    const updateFields: Partial<{
      name: string;
      avatarUrl: string;
      dob: Date;
      phone: string;
      address: string;
    }> = {};

    if (name) updateFields.name = name;
    if (avatarUrl) updateFields.avatarUrl = avatarUrl;
    if (dob) updateFields.dob = dob;
    if (phone) updateFields.phone = phone;
    if (address) updateFields.address = address;

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { $set: updateFields },
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Không thể cập nhật hồ sơ", error });
  }
};
