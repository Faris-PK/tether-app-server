"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    if (!accessToken && !refreshToken) {
        console.log('No tokens provided');
        return res.status(401).json({ message: 'No tokens provided' });
    }
    try {
        const decodedAccessToken = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_ACCESS_SECRET);
        req.userId = decodedAccessToken.userId;
        return next();
    }
    catch (accessTokenError) {
        .000;
        if (!refreshToken) {
            return res.status(401).json({ message: 'Access token expired and no refresh token provided' });
        }
        try {
            const decodedRefreshToken = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            const newAccessToken = jsonwebtoken_1.default.sign({ userId: decodedRefreshToken.userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 15 * 60 * 1000
            });
            req.userId = decodedRefreshToken.userId;
            return next();
        }
        catch (refreshTokenError) {
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            return res.status(403).json({ message: 'Invalid refresh token' });
        }
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map