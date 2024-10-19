import { OTPRepository } from '../../../infrastructure/repositories/OTPRepository';
import { MailService } from '../../../infrastructure/mail/MailService';
import { generateOTP } from '../../../shared/utils/OTPGenerator';
import { OTP } from '../../../domain/entities/OTP';

export class ResendOTPUseCase {
  constructor(
    private otpRepository: OTPRepository,
    private mailService: MailService
  ) {}

  async execute(email: string): Promise<void> {
    // Generate new OTP
    const newOTP = generateOTP();
    console.log('Resend OTP: ',newOTP);

    // Delete existing OTP for this email
    await this.otpRepository.deleteByEmail(email);

    // Create a new OTP record
    const otpRecord = new OTP({
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