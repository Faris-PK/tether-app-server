"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserUseCase = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class LoginUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(loginData) {
        const { email, password } = loginData;
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        //  console.log('user : ', user);
        if (user.isBlocked) {
            throw new Error('This user already blocked');
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }
        const accessToken = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
        const refreshToken = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
        console.log(jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET));
        return { accessToken, refreshToken, user };
    }
}
exports.LoginUserUseCase = LoginUserUseCase;
//# sourceMappingURL=LoginUserUseCase.js.map