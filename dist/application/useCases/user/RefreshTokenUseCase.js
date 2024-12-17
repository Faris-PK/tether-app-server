"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenUseCase = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class RefreshTokenUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(refreshToken) {
        try {
            const payload = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            const user = await this.userRepository.findById(payload.userId);
            if (!user) {
                throw new Error('User not found');
            }
            const accessToken = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
            return accessToken;
        }
        catch (error) {
            throw new Error('Invalid refresh token');
        }
    }
}
exports.RefreshTokenUseCase = RefreshTokenUseCase;
//# sourceMappingURL=RefreshTokenUseCase.js.map