"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const RegisterUserUseCase_1 = require("../../application/useCases/user/RegisterUserUseCase");
const VerifyOTPUseCase_1 = require("../../application/useCases/user/VerifyOTPUseCase");
const LoginUserUseCase_1 = require("../../application/useCases/user/LoginUserUseCase");
const RefreshTokenUseCase_1 = require("../../application/useCases/user/RefreshTokenUseCase");
const ResendOTPUseCase_1 = require("../../application/useCases/user/ResendOTPUseCase");
const ForgotPasswordUseCase_1 = require("../../application/useCases/user/ForgotPasswordUseCase");
const ResetPasswordUseCase_1 = require("../../application/useCases/user/ResetPasswordUseCase");
class AuthController {
    constructor(userRepository, otpRepository, mailService) {
        this.userRepository = userRepository;
        this.otpRepository = otpRepository;
        this.mailService = mailService;
        this.registerUserUseCase = new RegisterUserUseCase_1.RegisterUserUseCase(userRepository, otpRepository, mailService);
        this.verifyOTPUseCase = new VerifyOTPUseCase_1.VerifyOTPUseCase(otpRepository);
        this.loginUserUseCase = new LoginUserUseCase_1.LoginUserUseCase(userRepository);
        this.refreshTokenUseCase = new RefreshTokenUseCase_1.RefreshTokenUseCase(userRepository);
        this.resendOTPUseCase = new ResendOTPUseCase_1.ResendOTPUseCase(otpRepository, mailService);
        this.forgotPasswordUseCase = new ForgotPasswordUseCase_1.ForgotPasswordUseCase(userRepository, mailService);
        this.resetPasswordUseCase = new ResetPasswordUseCase_1.ResetPasswordUseCase(userRepository);
    }
    async register(req, res) {
        try {
            const userData = req.body;
            //  console.log('userData : ',userData);
            await this.registerUserUseCase.execute(userData);
            return res.status(201).json({ message: 'User registered and OTP sent' });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
        }
    }
    async verifyOTP(req, res) {
        try {
            const { email, otp } = req.body;
            const isValidOTP = await this.verifyOTPUseCase.execute({ email, otp });
            if (!isValidOTP) {
                return res.status(400).json({ message: 'Invalid OTP' });
            }
            return res.status(200).json({ message: 'OTP verified' });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ message: error.message });
            }
        }
    }
    async resendOTP(req, res) {
        try {
            const { email } = req.body;
            await this.resendOTPUseCase.execute(email);
            return res.status(200).json({ message: 'New OTP sent successfully' });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const { accessToken, refreshToken, user } = await this.loginUserUseCase.execute({ email, password });
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                maxAge: 15 * 60 * 1000, // 15 minutes
                sameSite: 'none',
                secure: true,
                path: '/'
            });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: 'none',
                secure: true,
                path: '/'
            });
            return res.status(200).json({ message: 'Login successful', user });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
        }
    }
    async refreshToken(req, res) {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return res.status(401).json({ message: 'Refresh token not found' });
            }
            const newAccessToken = await this.refreshTokenUseCase.execute(refreshToken);
            res.cookie('accessToken', newAccessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 });
            return res.status(200).json({ message: 'Access token refreshed' });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(401).json({ message: error.message });
            }
        }
    }
    async logout(req, res) {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        return res.status(200).json({ message: 'Logged out successfully' });
    }
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            const resetToken = await this.forgotPasswordUseCase.execute(email);
            return res.status(200).json({
                message: 'Password reset link has been sent to your email',
                resetToken // In production, don't send this in response, only send via email
            });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
        }
    }
    async resetPassword(req, res) {
        try {
            const { token, newPassword } = req.body;
            await this.resetPasswordUseCase.execute({ token, newPassword });
            return res.status(200).json({
                message: 'Password has been reset successfully'
            });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map