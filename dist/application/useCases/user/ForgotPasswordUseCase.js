"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPasswordUseCase = void 0;
const TokenGenerator_1 = require("../../../shared/utils/TokenGenerator");
class ForgotPasswordUseCase {
    constructor(userRepository, mailService) {
        this.userRepository = userRepository;
        this.mailService = mailService;
    }
    async execute(email) {
        // Check if user exists
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }
        // Generate password reset token
        const resetToken = (0, TokenGenerator_1.generatePasswordResetToken)(user.id, user.email);
        // Send reset link via email
        const resetLink = `${process.env.FRONTEND_URL}/user/reset-password?token=${resetToken}`;
        await this.mailService.sendPasswordResetLink(email, resetLink);
        return resetToken;
    }
}
exports.ForgotPasswordUseCase = ForgotPasswordUseCase;
//# sourceMappingURL=ForgotPasswordUseCase.js.map