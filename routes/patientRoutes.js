import express from 'express';
import { body } from 'express-validator';
import {
  signupPatient,
  loginPatient,
  getPatientScans,
  getPatientScanById,
  createQuickScan,
  getQuickscanById,
  getQuickscans
} from '../controllers/patientController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], signupPatient);

router.post('/login', [
  body('loginKey').isLength({ min: 8, max: 8 }),
  body('password').isLength({ min: 6 })
], loginPatient);



router.get('/quickscans', protect, getQuickscans);
router.get('/scans', protect, getPatientScans);


router.get('/scan/:id', protect, getPatientScanById);
router.get('/quickscan/:id', protect, getQuickscanById);


router.post('/quickscan', protect, createQuickScan);


export default router;
