"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const requireAuth_1 = require("../middlewares/requireAuth");
const stat_controller_1 = require("../controllers/stat.controller");
const router = (0, express_1.Router)();
router.get('/category-expense', requireAuth_1.requireAuth, stat_controller_1.getCategoryExpenseStats);
exports.default = router;
