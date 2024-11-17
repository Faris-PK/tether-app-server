import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
import { MailService } from '../../../infrastructure/mail/MailService';
import { generatePasswordResetToken } from '../../../shared/utils/TokenGenerator';

export class ForgotPasswordUseCase {
  constructor(
    private userRepository: UserRepository,
    private mailService: MailService
  ) {}

  async execute(email: string): Promise<string> {
    // Check if user exists
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    // Generate password reset token
    const resetToken = generatePasswordResetToken(user.id, user.email);

    // Send reset link via email
    const resetLink = `${process.env.FRONTEND_URL}/user/reset-password?token=${resetToken}`;
    await this.mailService.sendPasswordResetLink(email, resetLink);

    return resetToken;
  }
}