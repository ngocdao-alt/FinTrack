import { Router } from 'express';
import { requireAuth } from '../middlewares/requireAuth';
import upload from '../middlewares/upload';
import { uploadReceiptImages } from '../controllers/upload.controller';

const router = Router();

router.post('/receipt', requireAuth, upload.array("receiptImages", 5), uploadReceiptImages);

export default router;