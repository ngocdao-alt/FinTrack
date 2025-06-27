import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from "cookie-parser";
import authRoutes from './routes/auth.routes'
import transactionRoutes from './routes/transaction.routes';
import dashboardRoutes from './routes/dashboard.routes';
import uploadRoutes from './routes/upload.routes';
import budgetRoutes from './routes/budget.routes';
import userRoutes from './routes/user.routes';
import notificationRoutes from './routes/notification.routes';
import statRoutes from './routes/stat.routes';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/upload', uploadRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/user', userRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/stats', statRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('FinTrack API is running');
});

export default app;
