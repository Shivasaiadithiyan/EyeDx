import express from 'express';

import { uploadScan,getUnclassifiedQuickScans,updateQuickScanClassification } from '../controllers/uploadController.js';

const router = express.Router();

router.post('/upload', uploadScan);
router.get('/unclassified', getUnclassifiedQuickScans);
router.patch('/quickscan/:id', updateQuickScanClassification);

export default router;
