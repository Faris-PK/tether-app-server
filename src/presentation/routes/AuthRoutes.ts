import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { GoogleAuthController } from '../controllers/GoogleAuthController';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { OTPRepository } from '../../infrastructure/repositories/OTPRepository';
import { MailService } from '../../infrastructure/mail/MailService';

const authRouter = Router();


const userRepository = new UserRepository();
const otpRepository = new OTPRepository();
const mailService = new MailService();
 
const authController = new AuthController(userRepository, otpRepository, mailService);
const googleAuthController = new GoogleAuthController(userRepository);

// Define routes
authRouter.post('/register', (req, res) => authController.register(req, res));
authRouter.post('/verify-otp', (req, res) => authController.verifyOTP(req, res));
authRouter.post('/login', (req, res) => authController.login(req, res));
authRouter.post('/refresh-token', (req, res) => authController.refreshToken(req, res));
authRouter.post('/logout', (req, res) => authController.logout(req, res));
authRouter.post('/google', (req, res) => googleAuthController.googleLogin(req, res));

export default authRouter;