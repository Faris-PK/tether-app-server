"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAuthController = void 0;
const google_auth_library_1 = require("google-auth-library");
const User_1 = require("../../domain/entities/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
class GoogleAuthController {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async googleLogin(req, res) {
        const { token } = req.body;
        // console.log('google token: ', token);
        try {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            if (!payload) {
                return res.status(400).json({ message: 'Invalid token' });
            }
            const { email, name, sub } = payload;
            let user = await this.userRepository.findByEmail(email);
            if (!user) {
                const newUser = new User_1.User({
                    username: name,
                    email: email,
                    googleId: sub,
                    password: '',
                });
                user = await this.userRepository.save(newUser);
            }
            const accessToken = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
            const refreshToken = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
            res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 });
            res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
            return res.status(200).json({ user, message: 'Google login successful' });
        }
        catch (error) {
            console.error('Google login error:', error);
            return res.status(500).json({ message: 'An error occurred during Google login' });
        }
    }
}
exports.GoogleAuthController = GoogleAuthController;
//# sourceMappingURL=GoogleAuthController.js.map