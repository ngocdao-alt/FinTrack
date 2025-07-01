"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const requireAuth_1 = require("../middlewares/requireAuth");
const upload_1 = __importDefault(require("../middlewares/upload"));
const upload_controller_1 = require("../controllers/upload.controller");
const router = (0, express_1.Router)();
router.post('/receipt', requireAuth_1.requireAuth, upload_1.default.array("receiptImages", 10), upload_controller_1.uploadReceiptImages);
exports.default = router;
