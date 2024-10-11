import { OTPRepository } from '../../../infrastructure/repositories/OTPRepository';
import { VerifyOTPDTO } from '../../dto/VerifyOTPDTO';

export class VerifyOTPUseCase {
  private otpRepository: OTPRepository;

  constructor(otpRepository: OTPRepository) {
    this.otpRepository = otpRepository;
  }

  async execute({ email, otp }: VerifyOTPDTO): Promise<boolean> {
    const otpRecord = await this.otpRepository.findByEmail(email);
    if (!otpRecord || otpRecord.otp !== otp) {
      return false;
    }

    await this.otpRepository.deleteByEmail(email);
    return true;
  }
}
