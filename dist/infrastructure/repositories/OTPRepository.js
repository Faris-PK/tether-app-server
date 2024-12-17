"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTPRepository = void 0;
const OTP_1 = require("../../domain/entities/OTP");
class OTPRepository {
    async save(otp) {
        return await otp.save();
    }
    async findByEmail(email) {
        return await OTP_1.OTP.findOne({ email });
    }
    async deleteByEmail(email) {
        await OTP_1.OTP.deleteMany({ email });
    }
}
exports.OTPRepository = OTPRepository;
//# sourceMappingURL=OTPRepository.js.map