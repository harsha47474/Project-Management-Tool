import express from 'express'
import { otpVerification, registerUser } from '../controllers/auth.controller.js';

const router = express.Router();


router.post('/register', registerUser);
router.post('/otp-verification', otpVerification);

export default router;