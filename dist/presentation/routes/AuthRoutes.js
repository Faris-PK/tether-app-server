"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const GoogleAuthController_1 = require("../controllers/GoogleAuthController");
const UserRepository_1 = require("../../infrastructure/repositories/UserRepository");
const OTPRepository_1 = require("../../infrastructure/repositories/OTPRepository");
const MailService_1 = require("../../infrastructure/mail/MailService");
const authRouter = (0, express_1.Router)();
const userRepository = new UserRepository_1.UserRepository();
const otpRepository = new OTPRepository_1.OTPRepository();
const mailService = new MailService_1.MailService();
const authController = new AuthController_1.AuthController(userRepository, otpRepository, mailService);
const googleAuthController = new GoogleAuthController_1.GoogleAuthController(userRepository);
// Define routes
authRouter.post('/register', (req, res) => authController.register(req, res));
authRouter.post('/verify-otp', (req, res) => authController.verifyOTP(req, res));
authRouter.post('/resend-otp', (req, res) => authController.resendOTP(req, res));
authRouter.post('/login', (req, res) => authController.login(req, res));
authRouter.post('/logout', (req, res) => authController.logout(req, res));
authRouter.post('/google', (req, res) => googleAuthController.googleLogin(req, res));
authRouter.post('/forgot-password', (req, res) => authController.forgotPassword(req, res));
authRouter.post('/reset-password', (req, res) => authController.resetPassword(req, res));
exports.default = authRouter;
//# sourceMappingURL=AuthRoutes.js.map