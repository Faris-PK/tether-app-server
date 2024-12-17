import { OTPRepository } from '../../../infrastructure/repositories/OTPRepository';
import { VerifyOTPDTO } from '../../dto/VerifyOTPDTO';
export declare class VerifyOTPUseCase {
    private otpRepository;
    constructor(otpRepository: OTPRepository);
    execute({ email, otp }: VerifyOTPDTO): Promise<boolean>;
}
