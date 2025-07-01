"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const transaction_routes_1 = __importDefault(require("./routes/transaction.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const budget_routes_1 = __importDefault(require("./routes/budget.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const stat_routes_1 = __importDefault(require("./routes/stat.routes"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)('dev'));
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/transaction', transaction_routes_1.default);
app.use('/api/dashboard', dashboard_routes_1.default);
app.use('/api/upload', upload_routes_1.default);
app.use('/api/budget', budget_routes_1.default);
app.use('/api/user', user_routes_1.default);
app.use('/api/notification', notification_routes_1.default);
app.use('/api/stats', stat_routes_1.default);
// Default route
app.get('/', (req, res) => {
    res.send('FinTrack API is running');
});
exports.default = app;
