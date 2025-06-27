import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { updateProfile } from "../controllers/user.controller";
import upload from "../middlewares/upload";

const router = Router();

router.put('/profile', requireAuth, upload.single("avatar"), updateProfile)

export default router;