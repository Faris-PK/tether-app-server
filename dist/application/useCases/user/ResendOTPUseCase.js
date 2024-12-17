"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResendOTPUseCase = void 0;
const OTPGenerator_1 = require("../../../shared/utils/OTPGenerator");
const OTP_1 = require("../../../domain/entities/OTP");
class ResendOTPUseCase {
    constructor(otpRepository, mailService) {
        this.otpRepository = otpRepository;
        this.mailService = mailService;
    }
    async execute(email) {
        // Generate new OTP
        const newOTP = (0, OTPGenerator_1.generateOTP)();
        console.log('Resend OTP: ', newOTP);
        // Delete existing OTP for this email
        await this.otpRepository.deleteByEmail(email);
        // Create a new OTP record
        const otpRecord = new OTP_1.OTP({
            email,
            otp: newOTP,
            createdAt: new Date(),
        });
        // Save the new OTP
        await this.otpRepository.save(otpRecord);
        // Send the new OTP via email
        await this.mailService.sendOTP(email, newOTP);
    }
}
exports.ResendOTPUseCase = ResendOTPUseCase;
//# sourceMappingURL=ResendOTPUseCase.js.map