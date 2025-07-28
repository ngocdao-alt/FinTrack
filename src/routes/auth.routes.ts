import { Router } from 'express';
import { login, register } from '../controllers/auth.controller';
import { logActivity } from '../middlewares/logActivity';

const router = Router();

router.use(logActivity);

router.post("/register", register);
router.post("/login", login);

export default router;