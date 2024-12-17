"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyOTPUseCase = void 0;
class VerifyOTPUseCase {
    constructor(otpRepository) {
        this.otpRepository = otpRepository;
    }
    async execute({ email, otp }) {
        const otpRecord = await this.otpRepository.findByEmail(email);
        if (!otpRecord || otpRecord.otp !== otp) {
            return false;
        }
        await this.otpRepository.deleteByEmail(email);
        return true;
    }
}
exports.VerifyOTPUseCase = VerifyOTPUseCase;
//# sourceMappingURL=VerifyOTPUseCase.js.map