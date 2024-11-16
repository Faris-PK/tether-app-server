import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
import { OTPRepository } from '../../../infrastructure/repositories/OTPRepository';
import { MailService } from '../../../infrastructure/mail/MailService';
import { generateOTP } from '../../../shared/utils/OTPGenerator';
import { OTP } from '../../../domain/entities/OTP';

export class ForgotPasswordUseCase {
  constructor(
    private userRepository: UserRepository,
    private otpRepository: OTPRepository,
    private mailService: MailService
  ) {}

  async execute(email: string): Promise<void> {
    // Check if user exists
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    // Generate new OTP
    const otp = generateOTP();

    // Delete any existing OTP
    await this.otpRepository.deleteByEmail(email);

    // Create new OTP record
    const otpRecord = new OTP({
      email,
      otp,
      createdAt: new Date(),
    });

    // Save OTP
    await this.otpRepository.save(otpRecord);

    // Send OTP via email
    await this.mailService.sendPasswordResetOTP(email, otp);
  }
}