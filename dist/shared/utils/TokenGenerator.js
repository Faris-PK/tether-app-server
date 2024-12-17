"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePasswordResetToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAccessToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '15m', //Access token expires in 15 minutes
    });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d' // Refresh token expires in 7 days
    });
};
exports.generateRefreshToken = generateRefreshToken;
const generatePasswordResetToken = (userId, email) => {
    return jsonwebtoken_1.default.sign({ userId, email }, process.env.PASSWORD_RESET_SECRET, { expiresIn: '1h' } // Reset token expires in 1 hour
    );
};
exports.generatePasswordResetToken = generatePasswordResetToken;
//# sourceMappingURL=TokenGenerator.js.map