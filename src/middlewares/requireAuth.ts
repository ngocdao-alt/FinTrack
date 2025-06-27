import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    userId?: string
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if(!token) {
        res.status(401).json({ message: "Bạn chưa đăng nhập!"});
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string};
        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token không hợp lệ!" });
    }
}