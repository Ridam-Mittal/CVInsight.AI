import { Router } from "express";
import { checkauth, login, logout, signup, sendOtpController, resetPassword, EditInfo } from "../controllers/auth.js";
import { authenticate } from "../middlewares/auth.js";


const router = Router();

router.post('/signup', signup);

router.post('/login', login);

router.get('/logout', authenticate, logout);

router.get('/verify', authenticate, checkauth);

router.post("/forgotpassword", sendOtpController); 

router.post('/reset-password', resetPassword);

router.post('/edit-info', authenticate, EditInfo);

export default router;