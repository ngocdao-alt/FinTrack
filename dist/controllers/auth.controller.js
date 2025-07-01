"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
const register = async (req, res) => {
    try {
        console.log(req.body);
        const { name, email, password } = req.body;
        const userExists = await User_1.default.findOne({ email });
        if (userExists)
            return res.status(400).json({ message: "Email đã tồn tại" });
        const hashed = await bcrypt_1.default.hash(password, 10);
        const user = await User_1.default.create({ name, email, password: hashed });
        const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
        res.status(201).json({
            token,
            user: { id: user._id, name: user.name, email: user.email, avatar: user.avatarUrl }
        });
    }
    catch (err) {
        res.status(500).json({ message: "Đăng ký thất bại!", error: err });
        console.log(err);
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "Email chưa được đăng ký!" });
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(404).json({ message: "Sai mật khẩu!" });
        const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
        res.status(201).json({
            token,
            user: { id: user._id, name: user.name, email: user.email, avatar: user.avatarUrl }
        });
    }
    catch (err) {
        res.status(500).json({ message: "Đăng nhập thất bại!", error: err });
    }
};
exports.login = login;
