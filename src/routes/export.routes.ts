// routes/pdf.ts
import express from "express";
import { generatePDF } from "../controllers/export.controller";

const router = express.Router();
router.post("/generate", generatePDF);
export default router;
