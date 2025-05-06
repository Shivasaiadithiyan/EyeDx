import express from 'express';
import {
  getDoctorPatients,
  getPatientScans,
  getScanDetail,
  updateScan
} from '../controllers/scanController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/patients', protect, getDoctorPatients);
router.get('/patient/:patientKey/scans', protect, getPatientScans);
router.get('/scan/:scanId', protect, getScanDetail);
router.put('/scan/:scanId', protect, updateScan);




export default router;
