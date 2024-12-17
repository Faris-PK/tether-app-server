"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminLoginUseCase = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AdminLoginUseCase {
    constructor(adminRepository) {
        this.adminRepository = adminRepository;
    }
    async execute(loginData) {
        const { email, password } = loginData;
        console.log('password from body', password);
        const admin = await this.adminRepository.findByEmail(email);
        if (!admin) {
            throw new Error('Invalid credentials');
        }
        console.log('password from db:', admin.password);
        const isPasswordValid = await bcryptjs_1.default.compare(password, admin.password);
        console.log(isPasswordValid);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials ');
        }
        const accessToken = jsonwebtoken_1.default.sign({ adminId: admin._id }, process.env.JWT_ADMIN_ACCESS_SECRET, { expiresIn: '15m' });
        const refreshToken = jsonwebtoken_1.default.sign({ adminId: admin._id }, process.env.JWT_ADMIN_REFRESH_SECRET, { expiresIn: '7d' });
        return { accessToken, refreshToken, admin };
    }
}
exports.AdminLoginUseCase = AdminLoginUseCase;
//# sourceMappingURL=AdminLoginUseCase.js.map