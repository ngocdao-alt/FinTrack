import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export const register = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log(req.body);
        
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if(userExists) return res.status(400).json({ message: "Email đã tồn tại" })
        
        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashed})

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

        res.status(201).json({
            token,
            user: { id: user._id, name: user.name, email: user.email, avatar: user.avatarUrl}
        });
    } catch (err) {
        res.status(500).json({ message: "Đăng ký thất bại!", error: err });
        console.log(err);
        
    }
};

export const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(!user) return res.status(400).json({ message: "Email chưa được đăng ký!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(404).json({ message: "Sai mật khẩu!"});

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d"});

        res.status(201).json({
            token,
            user: {id: user._id, name: user.name, email: user.email, avatar: user.avatarUrl}
        });
    } catch (err) {
        res.status(500).json({ message: "Đăng nhập thất bại!", error: err});
    }
}
