"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordUseCase = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class ResetPasswordUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(data) {
        const { token, newPassword } = data;
        try {
            // Verify token
            const decoded = jsonwebtoken_1.default.verify(token, process.env.PASSWORD_RESET_SECRET);
            // Hash new password
            const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
            // Update user password
            await this.userRepository.update(decoded.userId, { password: hashedPassword });
        }
        catch (error) {
            throw new Error('Invalid or expired reset token');
        }
    }
}
exports.ResetPasswordUseCase = ResetPasswordUseCase;
//# sourceMappingURL=ResetPasswordUseCase.js.map