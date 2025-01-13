"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adminAuthMiddleware = (req, res, next) => {
    const adminAccessToken = req.cookies.adminAccessToken;
    const adminRefreshToken = req.cookies.adminRefreshToken;
    if (!adminAccessToken && !adminRefreshToken) {
        console.log('No admin tokens provided');
        return res.status(401).json({ message: 'No admin tokens provided' });
    }
    try {
        const decodedAccessToken = jsonwebtoken_1.default.verify(adminAccessToken, process.env.JWT_ADMIN_ACCESS_SECRET);
        req.adminId = decodedAccessToken.adminId;
        return next();
    }
    catch (accessTokenError) {
        // If access token is invalid or expired
        if (!adminRefreshToken) {
            return res
                .status(401)
                .json({ message: 'Admin access token expired and no refresh token provided' });
        }
        try {
            const decodedRefreshToken = jsonwebtoken_1.default.verify(adminRefreshToken, process.env.JWT_ADMIN_REFRESH_SECRET);
            const newAdminAccessToken = jsonwebtoken_1.default.sign({ adminId: decodedRefreshToken.adminId }, process.env.JWT_ADMIN_ACCESS_SECRET, { expiresIn: '15m' });
            res.cookie('adminAccessToken', newAdminAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 15 * 60 * 1000,
            });
            req.adminId = decodedRefreshToken.adminId;
            return next();
        }
        catch (refreshTokenError) {
            res.clearCookie('adminAccessToken');
            res.clearCookie('adminRefreshToken');
            return res.status(403).json({ message: 'Invalid admin refresh token' });
        }
    }
};
exports.adminAuthMiddleware = adminAuthMiddleware;
//# sourceMappingURL=adminAuthMiddleware.js.map