"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserUseCase = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../../../domain/entities/User");
const OTPGenerator_1 = require("../../../shared/utils/OTPGenerator");
const OTP_1 = require("../../../domain/entities/OTP");
class RegisterUserUseCase {
    constructor(userRepository, otpRepository, mailService) {
        this.userRepository = userRepository;
        this.otpRepository = otpRepository;
        this.mailService = mailService;
    }
    async execute(userData) {
        const { username, email, password, mobile } = userData;
        //console.log('userData from useCase', userData);
        const existingUserByEmail = await this.userRepository.findByEmail(email);
        if (existingUserByEmail) {
            throw new Error('User with this email already exists');
        }
        const existingUserByUsername = await this.userRepository.findByUsername(username);
        if (existingUserByUsername) {
            throw new Error('Username already exists');
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Create a new User instance
        const newUser = new User_1.User({
            username,
            email,
            password: hashedPassword,
            mobile
        });
        console.log('newUser: ', newUser);
        // Save the new user
        await this.userRepository.save(newUser);
        // Generate OTP
        const otp = (0, OTPGenerator_1.generateOTP)();
        console.log('Yout OTP: ', otp);
        // Create a new OTP instance and save it
        const otpRecord = new OTP_1.OTP({
            email,
            otp,
            createdAt: new Date(),
        });
        await this.otpRepository.save(otpRecord);
        // Send OTP to the user's email
        await this.mailService.sendOTP(email, otp);
    }
}
exports.RegisterUserUseCase = RegisterUserUseCase;
//# sourceMappingURL=RegisterUserUseCase.js.map