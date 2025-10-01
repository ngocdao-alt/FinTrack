"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const requireAuth_1 = require("../middlewares/requireAuth");
const user_controller_1 = require("../controllers/user.controller");
const upload_1 = __importDefault(require("../middlewares/upload"));
const router = (0, express_1.Router)();
router.put('/profile', requireAuth_1.requireAuth, upload_1.default.single("avatar"), user_controller_1.updateProfile);
exports.default = router;
