import express from 'express';
import { body } from 'express-validator';
import { signupDoctor, loginDoctor } from '../controllers/doctorController.js';

const router = express.Router();

router.post('/signup', [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], signupDoctor);



router.post('/login', [
  body('loginKey').isLength({ min: 8, max: 8 }),
  body('password').isLength({ min: 6 })
], loginDoctor);



export default router;