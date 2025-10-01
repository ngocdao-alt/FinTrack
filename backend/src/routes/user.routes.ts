import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { updateProfile } from "../controllers/user.controller";
import upload from "../middlewares/upload";
import { logActivity } from "../middlewares/logActivity";

const router = Router();
router.use(logActivity);

router.put('/profile', requireAuth, upload.single("avatar"), updateProfile)

export default router;