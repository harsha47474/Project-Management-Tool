import express from 'express'
import { login, logout, otpVerification, registerUser } from '../controllers/auth.controller.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';

const router = express.Router();


router.post('/register', registerUser);
router.post('/otp-verification', otpVerification);
router.post('/login', login)
router.post('/logout', isAuthenticated, logout)
router.get('/check', isAuthenticated, (req, res) => {
    res.json(req.user);
});

export default router;