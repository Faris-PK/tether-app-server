"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adminAuthMiddleware = (req, res, next) => {
    var _a;
    const token = req.cookies.adminRefreshToken;
    if (!token) {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Admin access token not found' });
        }
        const headerToken = authHeader.split(' ')[1];
        if (!headerToken) {
            return res.status(401).json({ message: 'Admin access token not found' });
        }
    }
    try {
        const finalToken = token || ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]);
        const payload = jsonwebtoken_1.default.verify(finalToken, process.env.JWT_ADMIN_REFRESH_SECRET);
        req.adminId = payload.adminId;
        next();
    }
    catch (error) {
        return res.status(403).json({ message: 'Invalid admin access token' });
    }
};
exports.adminAuthMiddleware = adminAuthMiddleware;
//# sourceMappingURL=adminAuthMiddleware.js.map