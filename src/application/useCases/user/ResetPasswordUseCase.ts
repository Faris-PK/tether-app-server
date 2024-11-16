import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
import { OTPRepository } from '../../../infrastructure/repositories/OTPRepository';
import bcrypt from 'bcryptjs';

interface ResetPasswordDTO {
  email: string;
  otp: string;
  newPassword: string;
}

export class ResetPasswordUseCase {
  constructor(
    private userRepository: UserRepository,
    private otpRepository: OTPRepository
  ) {}

  async execute(data: ResetPasswordDTO): Promise<void> {
    const { email, otp, newPassword } = data;

    // Verify OTP
    const otpRecord = await this.otpRepository.findByEmail(email);
    if (!otpRecord || otpRecord.otp !== otp) {
      throw new Error('Invalid OTP');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    await this.userRepository.update(user.id, { password: hashedPassword });

    // Delete used OTP
    await this.otpRepository.deleteByEmail(email);
  }
}